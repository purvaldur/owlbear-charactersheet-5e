import { describe, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import ItemEditor from "./ItemEditor.svelte";
import { blankSheet, damage, newItem, newSpell } from "../lib/model/defaults";

describe("item editor", () => {
  it("keeps a damage type and die that are off its lists selectable", () => {
    const sheet = blankSheet("character");
    const item = newSpell({ name: "False Life", dmg: [damage(1, 3, "", 4, "temp. hp")] });
    sheet.spells.push(item);
    const target = document.createElement("div");
    const view = mount(ItemEditor, { target, props: { sheet, kind: "spell", item } });
    flushSync();
    expect(target.querySelector<HTMLSelectElement>('select[aria-label="Damage type"]')!.value).toBe("temp. hp");
    expect(target.querySelector<HTMLSelectElement>('select[aria-label="Die"]')!.selectedOptions[0]?.textContent).toBe("d3");
    unmount(view);
  });

  it("ends attunement when an item stops needing it or stops being magic", () => {
    const sheet = $state(blankSheet("character"));
    sheet.inventory.items.push(newItem({ name: "Cloak", rarity: "uncommon", attune: true, attuned: true }));
    const item = sheet.inventory.items[0]!;
    const target = document.createElement("div");
    const view = mount(ItemEditor, { target, props: { sheet, kind: "item", item } });
    flushSync();
    const rarity = [...target.querySelectorAll("label.fld")].find((l) => l.textContent?.startsWith("Rarity"))!.querySelector("select")!;
    rarity.value = "";
    rarity.dispatchEvent(new Event("change"));
    flushSync();
    expect(item).toMatchObject({ rarity: "", attune: false, attuned: false });
    expect(target.textContent).not.toContain("Requires attunement");
    unmount(view);
  });
});
