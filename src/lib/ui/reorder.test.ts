import { describe, expect, it } from "vitest";
import { move, reorderHandlers } from "./reorder";

const key = (handlers: { onkeydown: (e: KeyboardEvent) => void }, k: string) => {
  const grip = document.createElement("button");
  grip.addEventListener("keydown", handlers.onkeydown);
  grip.dispatchEvent(new KeyboardEvent("keydown", { key: k }));
};

describe("reorder", () => {
  it("moves an item and ignores out-of-range moves", () => {
    const l = ["a", "b", "c"];
    move(l, 0, 2);
    expect(l).toEqual(["b", "c", "a"]);
    move(l, 0, 5);
    expect(l).toEqual(["b", "c", "a"]);
  });

  it("steps past rows shown in another group", () => {
    // Spells of levels 1, 2, 1: the level-1 rows are a1 and a2, with a level-2 spell between them in the list.
    const list = [{ n: "a1", l: 1 }, { n: "b", l: 2 }, { n: "a2", l: 1 }];
    const [a1] = list;
    const level1 = () => list.filter((s) => s.l === 1);
    key(reorderHandlers(list, () => a1!, level1), "ArrowDown");
    expect(list.map((s) => s.n)).toEqual(["b", "a2", "a1"]);
    key(reorderHandlers(list, () => a1!, level1), "ArrowDown");
    expect(list.map((s) => s.n)).toEqual(["b", "a2", "a1"]);
    key(reorderHandlers(list, () => a1!, level1), "ArrowUp");
    expect(list.map((s) => s.n)).toEqual(["b", "a1", "a2"]);
  });
});
