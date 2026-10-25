// @vitest-environment node
import { describe, expect, it } from "vitest";
import { profByLevel, slotsFor } from "./tables";

const maxes = (s: ReturnType<typeof slotsFor>) => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v.max]));

describe("setup tables", () => {
  it("gives proficiency +2 to +6 over twenty levels", () => {
    expect([1, 4, 5, 9, 13, 17, 20].map(profByLevel)).toEqual([2, 2, 3, 4, 5, 6, 6]);
  });

  it("gives each caster type its slots", () => {
    expect(maxes(slotsFor("full", 1))).toEqual({ 1: 2 });
    expect(maxes(slotsFor("full", 20))).toEqual({ 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 });
    expect(slotsFor("half", 1)).toEqual({});
    expect(maxes(slotsFor("half", 2))).toEqual({ 1: 2 });
    expect(maxes(slotsFor("half", 5))).toEqual({ 1: 4, 2: 2 });
    expect(maxes(slotsFor("half2024", 1))).toEqual({ 1: 2 });
    expect(maxes(slotsFor("pact", 1))).toEqual({ 1: 1 });
    expect(maxes(slotsFor("pact", 5))).toEqual({ 3: 2 });
    expect(maxes(slotsFor("pact", 11))).toEqual({ 5: 3 });
    expect(slotsFor(null, 10)).toEqual({});
  });
});
