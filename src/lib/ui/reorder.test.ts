import { describe, expect, it } from "vitest";
import { move } from "./reorder";
describe("reorder", () => {
  it("moves an item and ignores out-of-range moves", () => {
    const l = ["a", "b", "c"];
    move(l, 0, 2);
    expect(l).toEqual(["b", "c", "a"]);
    move(l, 0, 5);
    expect(l).toEqual(["b", "c", "a"]);
  });
});
