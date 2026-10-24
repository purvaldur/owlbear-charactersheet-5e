import { describe, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import AbilityStrip from "./AbilityStrip.svelte";
import { app } from "../lib/app.svelte";
import { blankSheet } from "../lib/model/defaults";

describe("number fields", () => {
  it("put the field's default back when left empty", () => {
    const sheet = blankSheet("character");
    sheet.abilities.str.score = 16;
    app.ui.edit = true;
    const target = document.createElement("div");
    const view = mount(AbilityStrip, { target, props: { sheet } });
    flushSync();
    const input = target.querySelector<HTMLInputElement>('input[aria-label="Strength score"]')!;
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    flushSync();
    expect(sheet.abilities.str.score).toBeNull();
    input.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
    expect(sheet.abilities.str.score).toBe(10);
    unmount(view);
    app.ui.edit = false;
  });

  it("keep a value within its bounds and whole when asked", async () => {
    const NumInput = (await import("./NumInput.svelte")).default;
    let value = 1;
    const target = document.createElement("div");
    const props = { get value() { return value; }, set value(v) { value = v; }, min: 0, max: 100, integer: true };
    const view = mount(NumInput, { target, props });
    flushSync();
    const input = target.querySelector("input")!;
    for (const [typed, kept] of [["1e9", 100], ["-2", 0], ["2.7", 2]] as const) {
      input.value = typed;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      flushSync();
      expect(value).toBe(kept);
    }
    unmount(view);
  });
});
