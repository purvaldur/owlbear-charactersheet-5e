// Token links: which sheet a token on the map belongs to. The link lives in the token's metadata, so it is saved with
// the scene; it carries HP (and nothing else from the sheet) because every viewer's HP bar needs it.
import type { Sheet, SheetKind } from "../model/types";

export const LINK_KEY = "io.vald.codex/link";
export const BARS_KEY = "io.vald.codex/hp-bars";

export interface TokenLink {
  sheetId: string;
  ownerId: string;
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

/** What each audience sees on tokens they don't own, per token kind. Set by the GM, kept in room metadata. */
export interface BarSettings {
  gm: Record<SheetKind, BarMode>;
  players: Record<SheetKind, BarMode>;
}
export const DEFAULT_BARS: BarSettings = {
  gm: { character: "number", creature: "number" },
  players: { character: "number", creature: "steps" },
};

const isNum = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const isMode = (x: unknown): x is BarMode => BAR_MODES.some(([m]) => m === x);

/** Reads a link from token metadata; anything malformed counts as no link. */
export function parseLink(meta: Record<string, unknown> | undefined): TokenLink | null {
  const l = meta?.[LINK_KEY] as Partial<TokenLink> | undefined;
  if (!l || typeof l.sheetId !== "string" || typeof l.ownerId !== "string" || !l.hp) return null;
  if (!isNum(l.hp.cur) || !isNum(l.hp.max) || !isNum(l.hp.temp)) return null;
  return { sheetId: l.sheetId, ownerId: l.ownerId, kind: l.kind === "creature" ? "creature" : "character", name: String(l.name ?? ""), hp: { ...l.hp } };
}

/** Reads the GM's bar settings from room metadata, filling anything missing from the defaults. */
export function parseBars(meta: Record<string, unknown> | undefined): BarSettings {
  const b = meta?.[BARS_KEY] as Partial<BarSettings> | undefined;
  const pick = (aud: keyof BarSettings, kind: SheetKind) => {
    const v = b?.[aud]?.[kind];
    return isMode(v) ? v : DEFAULT_BARS[aud][kind];
  };
  return {
    gm: { character: pick("gm", "character"), creature: pick("gm", "creature") },
    players: { character: pick("players", "character"), creature: pick("players", "creature") },
  };
}

export const linkFor = (sheet: Sheet, ownerId: string): TokenLink => ({
  sheetId: sheet.id,
  ownerId,
  kind: sheet.kind,
  name: sheet.name,
  hp: { cur: sheet.hp.cur, max: sheet.hp.max, temp: sheet.hp.temp },
});

const sameLink = (a: TokenLink, b: TokenLink) =>
  a.name === b.name && a.kind === b.kind && a.hp.cur === b.hp.cur && a.hp.max === b.hp.max && a.hp.temp === b.hp.temp;

/** Tokens linked to my sheets whose stored HP, name or kind no longer match the sheet, with the link they should carry. */
export function staleLinks(tokens: Token[], sheets: Sheet[], me: string): { id: string; link: TokenLink }[] {
  const out: { id: string; link: TokenLink }[] = [];
  for (const t of tokens) {
    if (!t.link || t.link.ownerId !== me) continue;
    const sheet = sheets.find((s) => s.id === t.link!.sheetId);
    if (!sheet) continue;
    const fresh = linkFor(sheet, me);
    if (!sameLink(t.link, fresh)) out.push({ id: t.id, link: fresh });
  }
  return out;
}
