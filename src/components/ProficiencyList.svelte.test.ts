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
  it("always shows all four lists after the features, an empty one as None", () => {
    const { sheet, target, heads, done } = render();
    const rows = () => [...target.querySelectorAll(".profs div")].map((d) => d.textContent);
    expect(heads().at(-1)).toBe("Proficiencies");
    expect(rows()).toEqual(["ArmorNone", "WeaponsNone", "ToolsNone", "LanguagesNone"]);
    sheet.proficiencies.armor = ["Light armor", "Shields"];
    sheet.proficiencies.languages = ["Common"];
    flushSync();
    expect(rows()).toEqual(["ArmorLight armor, Shields", "WeaponsNone", "ToolsNone", "LanguagesCommon"]);
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
