// Built-in dice (used when Dice+ is not in the room, or fails), and turning raw dice into results.
import type { D20Result, DiceOutcome, PartResult, RollIntent, RollMode } from "./types";

export type Rng = (sides: number) => number;
export const cryptoRng: Rng = (sides) => {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return 1 + (a[0]! % Math.max(1, sides));
};

const d20Count = (mode: RollMode) => (mode === "normal" ? 1 : 2);

/** Rolls each part's dice once; a crit rolls them again (never the flat bonus) and adds them to the first roll. */
export const rollParts = (intent: RollIntent, rng: Rng = cryptoRng) => intent.parts.map((p) => Array.from({ length: p.n }, () => rng(p.d || 1)));

/** Rolls every die an intent needs. */
export function rollOutcome(intent: RollIntent, rng: Rng = cryptoRng): DiceOutcome {
  return { d20: intent.d20 ? Array.from({ length: d20Count(intent.d20.mode) }, () => rng(20)) : undefined, parts: rollParts(intent, rng) };
}

export function d20Result(rolls: number[], mode: RollMode, modifier: number, label: string): D20Result {
  const [a = 1, b = a] = rolls;
  const kept = mode === "adv" ? (a >= b ? 0 : 1) : mode === "dis" ? (a <= b ? 0 : 1) : 0;
  const nat = rolls[kept] ?? a;
  return { rolls: mode === "normal" ? [a] : [a, b], kept, nat, mode, mod: modifier, total: nat + modifier, label };
}

export function partResults(intent: RollIntent, dice: number[][]): PartResult[] {
  return intent.parts.map((p, i) => {
    const rolls = dice[i] ?? [];
    return { n: rolls.length, d: p.d, rolls, bonus: p.bonus, total: Math.max(0, rolls.reduce((s, r) => s + r, 0) + p.bonus), type: p.type };
  });
}

export const isCrit = (d20: number[] | undefined, mode: RollMode | undefined, label: string | undefined) =>
  label === "to hit" && !!d20 && d20Result(d20, mode ?? "normal", 0, "").nat === 20;
