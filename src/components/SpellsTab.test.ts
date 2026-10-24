import { describe, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import SpellsTab from "./SpellsTab.svelte";
import { blankSheet, newSpell } from "../lib/model/defaults";

function render(sheet = blankSheet("character")) {
  const target = document.createElement("div");
  const view = mount(SpellsTab, { target, props: { sheet } });
  flushSync();
  return { target, done: () => unmount(view) };
}

describe("spells tab", () => {
  it("offers spellcasting when the sheet has neither spellcasting nor spells", () => {
    const { target, done } = render();
    expect(target.querySelector("h2")?.textContent).toBe("No spellcasting");
    done();
  });

  it("still lists spells on a sheet without spellcasting", () => {
    const sheet = blankSheet("character");
    sheet.spells.push(newSpell({ name: "Fire Bolt", level: 0 }), newSpell({ name: "Shield", level: 1 }));
    const { target, done } = render(sheet);
    expect(target.querySelector("h2")).toBeNull();
    expect(target.textContent).toContain("Fire Bolt");
    expect(target.textContent).toContain("Shield");
    expect(target.querySelector(".cast-missing")?.textContent).toContain("Add spellcasting to show spell attack and save DC");
    done();
  });
});
