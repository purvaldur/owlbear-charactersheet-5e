// @vitest-environment node
import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { blankSheet } from "./defaults";
import { parseSheet } from "./migrate";
import { effects } from "../rules";
import { itemFromSrd, spellFromSrd, type SrdItem, type SrdList, type SrdSpell } from "./srd";
import type { Rules } from "./types";

execFileSync(process.execPath, [fileURLToPath(new URL("../../../scripts/build-srd.mjs", import.meta.url))]);
const load = <T>(list: SrdList, rules: Rules): T[] =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`../../../public/srd/${list}-${rules}.json`, import.meta.url)), "utf8"));

describe.each(["2014", "2024"] as const)("the %s SRD lists", (rules) => {
  it("adds every SRD spell as a spell the sheet can show and load", () => {
    const sheet = blankSheet("character", undefined, rules);
    sheet.spellcasting = { ab: "int", atk: 0, dc: 0, shortRest: false };
    sheet.spells = load<SrdSpell>("spells", rules).map(spellFromSrd);
    for (const s of sheet.spells) expect(() => effects(sheet, s, "spell"), s.name).not.toThrow();
    const res = parseSheet(JSON.parse(JSON.stringify(sheet)));
    expect(res.ok && res.sheet.spells).toEqual(sheet.spells);
    expect(res.ok && res.sheet.rules).toBe(rules);
    expect(sheet.spells.find((s) => s.name === "Thunderwave")?.save).toEqual({ target: "con" });
    expect(sheet.spells.find((s) => s.name === "Cure Wounds")?.dmg[0]).toMatchObject({ n: rules === "2014" ? 1 : 2, d: 8, ab: "sc", type: "healing" });
    expect(new Set(sheet.spells.map((s) => s.name)).size).toBe(sheet.spells.length);
    expect(sheet.spells.find((s) => s.name === "Cure Wounds")?.desc).toMatch(/higher|Higher/);
  });

  it("knows every spell's classes and school, for the list's filters", () => {
    const spells = load<SrdSpell>("spells", rules);
    expect(spells.filter((s) => !s.classes.length || !s.school).map((s) => s.name)).toEqual([]);
    expect(spells.find((s) => s.name === "Bless")).toMatchObject({ classes: ["Cleric", "Paladin"], school: "Enchantment" });
  });

  it("adds every SRD item as an item the sheet can show and load", () => {
    const sheet = blankSheet("character", undefined, rules);
    sheet.inventory.items = load<SrdItem>("items", rules).map((i) => itemFromSrd(i, "backpack"));
    const res = parseSheet(JSON.parse(JSON.stringify(sheet)));
    expect(res.ok && res.sheet.inventory.items).toEqual(sheet.inventory.items);
    expect(sheet.inventory.items.find((i) => i.name === "Longsword")).toMatchObject({ wt: 3, cost: 15, rarity: "", cat: "backpack" });
    expect(sheet.inventory.items.find((i) => i.name === "Bag of Holding")).toMatchObject({ rarity: "uncommon" });
    // Full descriptions, not just the first paragraph.
    expect(sheet.inventory.items.find((i) => i.name === "Staff of Power")?.desc.split("\n\n").length).toBeGreaterThan(2);
    expect(new Set(sheet.inventory.items.map((i) => i.name)).size).toBe(sheet.inventory.items.length);
  });
});

describe("SRD entries", () => {
  it("are copied onto a sheet, not shared with the list", () => {
    const [fireball] = load<SrdSpell>("spells", "2024").filter((s) => s.name === "Fireball");
    const a = spellFromSrd(fireball!);
    a.dmg[0]!.n = 99;
    expect(spellFromSrd(fireball!).dmg[0]!.n).toBe(8);
    expect(Object.keys(a)).not.toContain("classes");
    const it = itemFromSrd(load<SrdItem>("items", "2024")[0]!, "c123");
    expect(it.cat).toBe("c123");
    expect(Object.keys(it)).not.toContain("type");
  });
});
