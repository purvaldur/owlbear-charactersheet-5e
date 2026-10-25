import { describe, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import MainTab from "./MainTab.svelte";
import { app } from "../lib/app.svelte";
import { blankSheet } from "../lib/model/defaults";
import { parseSheet } from "../lib/model/migrate";

function render() {
  const sheet = $state(blankSheet("character"));
  const target = document.createElement("div");
  const view = mount(MainTab, { target, props: { sheet } });
  flushSync();
  const heads = () => [...target.querySelectorAll(".section-h")].map((h) => h.textContent);
  return { sheet, target, heads, done: () => unmount(view) };
}

describe("proficiencies", () => {
  it("shows only the lists that have something, after the features, and hides the section when none do", () => {
    const { sheet, target, heads, done } = render();
    expect(heads()).not.toContain("Proficiencies");
    sheet.proficiencies.armor = ["Light armor", "Shields"];
    sheet.proficiencies.languages = ["Common"];
    flushSync();
    expect(heads().at(-1)).toBe("Proficiencies");
    expect([...target.querySelectorAll(".profs div")].map((d) => d.textContent)).toEqual(["ArmorLight armor, Shields", "LanguagesCommon"]);
    done();
  });

  it("edits each list as comma-separated text in Edit", () => {
    app.ui.edit = true;
    const { sheet, target, done } = render();
    const tools = [...target.querySelectorAll<HTMLLabelElement>(".prof-edit label")].find((l) => l.textContent?.startsWith("Tools"))!.querySelector("input")!;
    tools.value = " Thieves' tools,, Vehicles (land) ";
    tools.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
    expect(sheet.proficiencies.tools).toEqual(["Thieves' tools", "Vehicles (land)"]);
    app.ui.edit = false;
    done();
  });

  it("reads sheets saved before the section with empty lists", () => {
    const { proficiencies: _, ...old } = blankSheet("character");
    const res = parseSheet(JSON.parse(JSON.stringify(old)));
    expect(res.ok && res.sheet.proficiencies).toEqual({ armor: [], weapons: [], tools: [], languages: [] });
  });
});
