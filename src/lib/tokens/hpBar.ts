// What a token's HP bar shows to one viewer. Pure, so the background page's drawing code stays thin.
import type { Role } from "../obr/adapter";
import type { BarMode, BarSettings, BarStep, TokenLink } from "./link";

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

/**
 * Owners always see their own tokens exactly, and so does the GM on another GM's token. Otherwise the GM's choice for
 * the viewer's role applies: the GM's view of players' tokens, or players' view of each other's tokens and the GM's.
 */
export function modeFor(link: TokenLink, viewer: { id: string; role: Role }, settings: BarSettings): BarMode {
  if (link.ownerId === viewer.id) return "number";
  if (viewer.role === "GM") return link.role === "GM" ? "number" : settings.gm.player;
  return settings.players[link.role === "GM" ? "gm" : "player"];
}

/** Same thresholds as the sheet's own HP bar (rules.hpState): red at a quarter or less, amber at half or less. */
function stateOf(share: number): BarState {
  return share <= 0.25 ? "low" : share <= 0.5 ? "mid" : "ok";
}

export function barModel(hp: TokenLink["hp"], mode: BarMode, step: BarStep = 25): BarModel | null {
  if (mode === "none") return null;
  const share = hp.max > 0 ? Math.min(1, Math.max(0, hp.cur / hp.max)) : 0;
  if (mode === "steps") {
    // Rounded up, so anything still standing never reads as empty; temp HP and exact numbers stay hidden. The
    // tolerance keeps exact breakpoints (3 of 10 HP in 10% steps) from rounding up a whole step on float error.
    const n = Math.round(100 / step);
    const fill = share > 0 ? Math.min(n, Math.ceil(share * n - 1e-9)) / n : 0;
    const ticks = Array.from({ length: n - 1 }, (_, i) => (i + 1) / n);
    return { mode, fill, temp: 0, state: stateOf(fill), label: "", ticks };
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
 * A token's unrotated footprint in scene units: its image at its scale, centred on its bounding box (which a rotated
 * token keeps centred but widens). Without an image to measure, falls back to the bounding box.
 */
export function footprint(
  bounds: { center: { x: number; y: number }; width: number; height: number },
  token: { scale: { x: number; y: number }; image?: { width: number; height: number }; grid?: { dpi: number } },
  sceneDpi: number,
): { x: number; y: number; w: number } {
  const { image, grid } = token;
  const w = image && grid?.dpi ? (image.width / grid.dpi) * sceneDpi * Math.abs(token.scale.x) : bounds.width;
  const h = image && grid?.dpi ? (image.height / grid.dpi) * sceneDpi * Math.abs(token.scale.y) : bounds.height;
  return { x: bounds.center.x - w / 2, y: bounds.center.y - h / 2, w };
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
