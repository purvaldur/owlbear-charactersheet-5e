// Dice notation: the free-form input in the rolls sidebar, and the labelled notation sent to Dice+.
import type { RollIntent } from "./types";

/** Parses "2d6+3", "d20-1" or "4d6". Returns null for anything else. */
export function parseNotation(input: string): { n: number; d: number; flat: number } | null {
  const m = input.replace(/\s+/g, "").toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!m) return null;
  const n = Number(m[1] || 1);
  const d = Number(m[2]);
  const flat = Number(m[3] || 0);
  if (n < 1 || n > 50 || d < 2 || d > 1000) return null;
  return { n, d, flat };
}

/**
 * Dice+ notation for an intent. Each dice group carries a description ("hit", "p0", "p1"…) so results can be
 * matched back to the intent; descriptions stop at operators, so modifiers follow as separate terms.
 * With `critOnly`, only the extra crit dice are requested (a follow-up after a natural 20).
 */
export function toDicePlus(intent: RollIntent, critOnly = false): string {
  const terms: { neg: boolean; text: string }[] = [];
  const modifier = (n: number) => n && !critOnly && terms.push({ neg: n < 0, text: String(Math.abs(n)) });
  if (intent.d20 && !critOnly) {
    const { mode, mod } = intent.d20;
    terms.push({ neg: false, text: `${mode === "normal" ? "1d20" : mode === "adv" ? "2d20kh1" : "2d20kl1"} # hit` });
    modifier(mod);
  }
  intent.parts.forEach((p, i) => {
    if (!p.n) return;
    terms.push({ neg: false, text: `${p.n}d${p.d} # p${i}` });
    modifier(p.bonus);
  });
  return terms.map((t, i) => (i === 0 ? (t.neg ? "-" : "") + t.text : `${t.neg ? "-" : "+"} ${t.text}`)).join(" ");
}

/** A Dice+ result group, as its developer docs describe it. */
export interface DicePlusGroup {
  description?: string;
  diceType: string;
  dice: { value: number; kept: boolean }[];
  total: number;
}

/** Matches Dice+ groups back to the intent's d20 and parts by description. */
export function fromDicePlus(intent: RollIntent, groups: DicePlusGroup[]): { d20?: number[]; parts: number[][] } {
  const byDesc = new Map(groups.map((g) => [(g.description ?? "").trim(), g]));
  const hit = byDesc.get("hit");
  return {
    d20: intent.d20 ? (hit ? hit.dice.map((d) => d.value) : undefined) : undefined,
    parts: intent.parts.map((_, i) => byDesc.get(`p${i}`)?.dice.map((d) => d.value) ?? []),
  };
}
