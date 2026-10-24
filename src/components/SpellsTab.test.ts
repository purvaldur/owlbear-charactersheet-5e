import { describe, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import SpellsTab from "./SpellsTab.svelte";
import { blankSheet, newSpell } from "../lib/model/defaults";
import { app } from "../lib/app.svelte";

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

  it("puts New spell and Add from SRD list above the levels in Edit, and opens the SRD list in the dialog", () => {
    const sheet = blankSheet("character");
    sheet.spellcasting = { ab: "int", atk: 0, dc: 0, shortRest: false };
    sheet.spells.push(newSpell({ name: "Fire Bolt", level: 0 }));
    app.ui.edit = true;
    const { target, done } = render(sheet);
    const adds = target.querySelector(".spell-adds");
    const cantrips = [...target.querySelectorAll(".spell-h")].find((h) => h.textContent?.includes("Cantrips"))!;
    expect(adds?.textContent).toContain("New spell");
    expect(adds!.compareDocumentPosition(cantrips) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    [...adds!.querySelectorAll("button")].find((b) => b.textContent?.includes("SRD"))!.click();
    expect(app.ui.dialog).toEqual({ view: "srd" });
    app.ui.edit = false;
    app.ui.dialog = null;
    done();
  });
});
