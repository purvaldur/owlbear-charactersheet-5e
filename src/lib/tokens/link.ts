// Token links: which sheet a token on the map belongs to. The link lives in the token's metadata, so it is saved with
// the scene; it carries HP (and nothing else from the sheet) because every viewer's HP bar needs it.
import type { Sheet, SheetKind } from "../model/types";
import type { Role } from "../obr/adapter";

export const LINK_KEY = "io.vald.codex/link";
export const BARS_KEY = "io.vald.codex/hp-bars";

export interface TokenLink {
  sheetId: string;
  ownerId: string;
  /** The linker's role, which decides whose bar settings apply: a GM's tokens or a player's. */
  role: Role;
  kind: SheetKind;
  name: string;
  hp: { cur: number; max: number; temp: number };
}

export interface Token {
  id: string;
  name: string;
  link: TokenLink | null;
}

export type BarMode = "number" | "bar" | "steps" | "none";
export const BAR_MODES: readonly [BarMode, string][] = [
  ["number", "Number"],
  ["bar", "Bar"],
  ["steps", "Steps"],
  ["none", "None"],
];

/** Breakpoint size for the steps mode, in percent. */
export type BarStep = 10 | 20 | 25 | 33 | 50;
export const BAR_STEPS: readonly BarStep[] = [10, 20, 25, 33, 50];

/** What each audience sees on tokens they don't own, by whose token it is. Set by the GM, kept in room metadata. */
export interface BarSettings {
  /** What the GM sees on players' tokens. */
  gm: { player: BarMode };
  /** What players see on each other's tokens and on the GM's. */
  players: { player: BarMode; gm: BarMode };
  step: BarStep;
}
export const DEFAULT_BARS: BarSettings = {
  gm: { player: "number" },
  players: { player: "number", gm: "steps" },
  step: 25,
};

const isNum = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const isMode = (x: unknown): x is BarMode => BAR_MODES.some(([m]) => m === x);

/** Reads a link from token metadata; anything malformed counts as no link. */
export function parseLink(meta: Record<string, unknown> | undefined): TokenLink | null {
  const l = meta?.[LINK_KEY] as Partial<TokenLink> | undefined;
  if (!l || typeof l.sheetId !== "string" || typeof l.ownerId !== "string" || !l.hp) return null;
  if (!isNum(l.hp.cur) || !isNum(l.hp.max) || !isNum(l.hp.temp)) return null;
  const kind = l.kind === "creature" ? "creature" : "character";
  // Links made before roles were recorded: creatures are most likely the GM's.
  const role = l.role === "GM" || l.role === "PLAYER" ? l.role : kind === "creature" ? "GM" : "PLAYER";
  return { sheetId: l.sheetId, ownerId: l.ownerId, role, kind, name: String(l.name ?? ""), hp: { ...l.hp } };
}

/** Reads the GM's bar settings from room metadata, filling anything missing from the defaults. */
export function parseBars(meta: Record<string, unknown> | undefined): BarSettings {
  const b = meta?.[BARS_KEY] as { gm?: Record<string, unknown>; players?: Record<string, unknown>; step?: unknown } | undefined;
  const mode = (v: unknown, fallback: BarMode) => (isMode(v) ? v : fallback);
  return {
    gm: { player: mode(b?.gm?.player, DEFAULT_BARS.gm.player) },
    players: { player: mode(b?.players?.player, DEFAULT_BARS.players.player), gm: mode(b?.players?.gm, DEFAULT_BARS.players.gm) },
    step: BAR_STEPS.find((s) => s === b?.step) ?? DEFAULT_BARS.step,
  };
}

export const linkFor = (sheet: Sheet, ownerId: string, role: Role): TokenLink => ({
  sheetId: sheet.id,
  ownerId,
  role,
  kind: sheet.kind,
  name: sheet.name,
  hp: { cur: sheet.hp.cur, max: sheet.hp.max, temp: sheet.hp.temp },
});

const sameLink = (a: TokenLink, b: TokenLink) =>
  a.name === b.name && a.kind === b.kind && a.role === b.role && a.hp.cur === b.hp.cur && a.hp.max === b.hp.max && a.hp.temp === b.hp.temp;

/** Tokens linked to my sheets whose stored HP, name, kind or role no longer match, with the link they should carry. */
export function staleLinks(tokens: Token[], sheets: Sheet[], me: string, role: Role): { id: string; link: TokenLink }[] {
  const out: { id: string; link: TokenLink }[] = [];
  for (const t of tokens) {
    if (!t.link || t.link.ownerId !== me) continue;
    const sheet = sheets.find((s) => s.id === t.link!.sheetId);
    if (!sheet) continue;
    const fresh = linkFor(sheet, me, role);
    if (!sameLink(t.link, fresh)) out.push({ id: t.id, link: fresh });
  }
  return out;
}
