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
});
