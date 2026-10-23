import { describe, expect, it } from "vitest";
import { fromDicePlus, parseNotation, toDicePlus } from "./notation";
import { d20Result, isCrit, partResults, rollOutcome } from "./roller";
import type { RollIntent } from "./types";

const rapier: RollIntent = {
  title: "Rapier",
  d20: { mod: 7, mode: "adv", label: "to hit" },
  parts: [{ n: 1, d: 8, bonus: 4, type: "piercing" }],
};
const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length]!;
};

describe("notation", () => {
  it("parses free-form input", () => {
    expect(parseNotation("2d6+3")).toEqual({ n: 2, d: 6, flat: 3 });
    expect(parseNotation("d20 - 1")).toEqual({ n: 1, d: 20, flat: -1 });
    expect(parseNotation("4d6")).toEqual({ n: 4, d: 6, flat: 0 });
    expect(parseNotation("fireball")).toBeNull();
    expect(parseNotation("0d6")).toBeNull();
  });
  it("labels Dice+ groups so results map back", () => {
    expect(toDicePlus(rapier)).toBe("2d20kh1 # hit + 7 + 1d8 # p0 + 4");
    expect(toDicePlus({ ...rapier, d20: { mod: -1, mode: "dis", label: "check" }, parts: [] })).toBe("2d20kl1 # hit - 1");
    expect(toDicePlus(rapier, true)).toBe("1d8 # p0");
  });
  it("reads Dice+ groups back by description", () => {
    const out = fromDicePlus(rapier, [
      { description: "hit", diceType: "d20", total: 18, dice: [{ value: 18, kept: true }, { value: 7, kept: false }] },
      { description: "p0", diceType: "d8", total: 5, dice: [{ value: 5, kept: true }] },
    ]);
    expect(out).toEqual({ d20: [18, 7], parts: [[5]] });
  });
});

describe("roller", () => {
  it("keeps the higher die with advantage and the lower with disadvantage", () => {
    expect(d20Result([4, 15], "adv", 7, "to hit")).toMatchObject({ kept: 1, nat: 15, total: 22 });
    expect(d20Result([4, 15], "dis", 7, "to hit")).toMatchObject({ kept: 0, nat: 4, total: 11 });
    expect(d20Result([9], "normal", -1, "check")).toMatchObject({ rolls: [9], total: 8 });
  });
  it("doubles only the dice on a crit", () => {
    const outcome = rollOutcome(rapier, seq(20, 3, 6, 2), true);
    expect(outcome.d20).toEqual([20, 3]);
    expect(outcome.parts).toEqual([[6, 2]]);
    const parts = partResults(rapier, outcome.parts);
    expect(parts[0]).toMatchObject({ n: 2, total: 12, bonus: 4 });
  });
  it("detects crits on attack rolls only", () => {
    expect(isCrit([20, 2], "adv", "to hit")).toBe(true);
    expect(isCrit([20, 2], "dis", "to hit")).toBe(false);
    expect(isCrit([20], "normal", "check")).toBe(false);
  });
});
