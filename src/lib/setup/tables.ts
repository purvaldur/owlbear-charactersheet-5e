// Tables the SRD prints that its data doesn't carry: proficiency by level, spell slots by caster type, point-buy costs.
import type { Caster } from "./types";

export const profByLevel = (level: number) => 2 + Math.floor((Math.min(Math.max(level, 1), 20) - 1) / 4);

/** A full caster's slots for spell levels 1–9, by class level. */
const FULL: number[][] = [
  [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

/** Pact Magic: [how many slots, their level], by warlock level. */
function pact(level: number): [number, number] {
  if (level >= 17) return [4, 5];
  if (level >= 11) return [3, 5];
  return [level === 1 ? 1 : 2, Math.min(5, Math.ceil(level / 2))];
}

/**
 * Spell slots by spell level ("1" to "9") for a caster type at a class level. Half casters use the full table at half
 * their level, rounded up; in 2014 they have none at level 1.
 */
export function slotsFor(caster: Caster | null, level: number): Record<string, { max: number; used: number }> {
  const l = Math.min(Math.max(level, 1), 20);
  if (caster === "pact") {
    const [n, at] = pact(l);
    return { [at]: { max: n, used: 0 } };
  }
  const row = caster === "full" ? FULL[l]! : caster === "half2024" || (caster === "half" && l >= 2) ? FULL[Math.ceil(l / 2)]! : [];
  return Object.fromEntries(row.map((n, i) => [String(i + 1), { max: n, used: 0 }]));
}

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
export const POINT_BUY_BUDGET = 27;
/** What a score from 8 to 15 costs in point buy. */
export const POINT_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
