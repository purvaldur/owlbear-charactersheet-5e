import { describe, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import InlineEditor from "./InlineEditor.svelte";
import { blankSheet, damage, newSpell } from "../lib/model/defaults";

describe("inline editor", () => {
  it("keeps a damage type and die that are off its lists selectable", () => {
    const sheet = blankSheet("character");
    const item = newSpell({ name: "False Life", dmg: [damage(1, 3, "", 4, "temp. hp")] });
    sheet.spells.push(item);
    const target = document.createElement("div");
    const view = mount(InlineEditor, { target, props: { sheet, kind: "spell", item } });
    flushSync();
    expect(target.querySelector<HTMLSelectElement>('select[aria-label="Damage type"]')!.value).toBe("temp. hp");
    expect(target.querySelector<HTMLSelectElement>('select[aria-label="Die"]')!.selectedOptions[0]?.textContent).toBe("d3");
    unmount(view);
  });
});
