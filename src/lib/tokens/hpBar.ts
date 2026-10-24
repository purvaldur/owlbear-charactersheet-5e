// What a token's HP bar shows to one viewer. Pure, so the background page's drawing code stays thin.
import type { Role } from "../obr/adapter";
import type { BarMode, BarSettings, TokenLink } from "./link";

export type BarState = "ok" | "mid" | "low";

/**
 * Fixed colours for bars on the map, which has no theme: near the sheet's semantic hues, on a dark translucent track
 * with a black edge so they read on any map. The GM's preview uses the same values.
 */
export const BAR_COLORS: Record<BarState | "temp" | "track" | "edge", string> = {
  ok: "#3fbf7f",
  mid: "#f2b544",
  low: "#e5484d",
  temp: "#bb99ff",
  track: "#11131c",
  edge: "#000000",
};
export const BAR_TRACK_OPACITY = 0.75;
export const BAR_EDGE_OPACITY = 0.7;

export interface BarModel {
  mode: Exclude<BarMode, "none">;
  /** Share of the bar filled by current HP, 0–1. */
  fill: number;
  /** Share taken by temp HP after the fill, 0–1 (never past the end). */
  temp: number;
  state: BarState;
  /** "24/38", "24/38 +5"; only in number mode. */
  label: string;
  /** Breakpoint ticks to draw, as shares of the bar; only in steps mode. */
  ticks: number[];
}

/** Owners always see their own tokens exactly; everyone else gets what the GM chose for their role and the token's kind. */
export function modeFor(link: TokenLink, viewer: { id: string; role: Role }, settings: BarSettings): BarMode {
  if (link.ownerId === viewer.id) return "number";
  return (viewer.role === "GM" ? settings.gm : settings.players)[link.kind];
}

const STEP = 0.25;

/** Same thresholds as the sheet's own HP bar (rules.hpState): red at a quarter or less, amber at half or less. */
function stateOf(share: number): BarState {
  return share <= 0.25 ? "low" : share <= 0.5 ? "mid" : "ok";
}

export function barModel(hp: TokenLink["hp"], mode: BarMode): BarModel | null {
  if (mode === "none") return null;
  const share = hp.max > 0 ? Math.min(1, Math.max(0, hp.cur / hp.max)) : 0;
  if (mode === "steps") {
    // Rounded up, so anything still standing never reads as empty; temp HP and exact numbers stay hidden.
    const fill = share > 0 ? Math.ceil(share / STEP) * STEP : 0;
    return { mode, fill, temp: 0, state: stateOf(fill), label: "", ticks: [0.25, 0.5, 0.75] };
  }
  const temp = hp.max > 0 ? Math.min(hp.temp / hp.max, 1 - share) : 0;
  const label = mode === "number" ? `${hp.cur}/${hp.max}${hp.temp > 0 ? ` +${hp.temp}` : ""}` : "";
  return { mode, fill: share, temp: Math.max(0, temp), state: stateOf(share), label, ticks: [] };
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface BarShapes {
  track: Rect;
  fill: Rect | null;
  temp: Rect | null;
  ticks: Rect[];
  /** Where the number label sits (the whole bar), and its font size. */
  label: (Rect & { size: number; text: string }) | null;
  /** Outline width, in scene units. */
  stroke: number;
}

/**
 * Lays a bar out just above a token's bounding box, in scene units, scaled to the token so it reads at any zoom.
 * The number mode is taller so its label fits inside the bar.
 */
export function barShapes(m: BarModel, box: { x: number; y: number; w: number }): BarShapes {
  const w = box.w * 0.9;
  const h = box.w * (m.mode === "number" ? 0.17 : 0.09);
  const x = box.x + (box.w - w) / 2;
  const y = box.y - h - box.w * 0.05;
  const stroke = Math.max(1, box.w * 0.012);
  const inner = { x: x + stroke, y: y + stroke, w: w - stroke * 2, h: h - stroke * 2 };
  const fillW = inner.w * m.fill;
  const tempW = inner.w * m.temp;
  return {
    track: { x, y, w, h },
    fill: fillW > 0 ? { ...inner, w: fillW } : null,
    temp: tempW > 0 ? { ...inner, x: inner.x + fillW, w: tempW } : null,
    ticks: m.ticks.map((t) => ({ x: inner.x + inner.w * t - stroke / 2, y: inner.y, w: stroke, h: inner.h })),
    label: m.label ? { x, y, w, h, size: h * 0.74, text: m.label } : null,
    stroke,
  };
}
