// @vitest-environment node
import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { blankSheet } from "./defaults";
import { parseSheet } from "./migrate";
import { effects, rollInfo, spellAttack, spellDC } from "../rules";
import { itemFromSrd, sheetFromSrdMonster, spellFromSrd, type SrdItem, type SrdList, type SrdMonster, type SrdSpell } from "./srd";
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

describe.each(["2014", "2024"] as const)("the %s SRD creatures", (rules) => {
  const monsters = load<SrdMonster>("monsters", rules).map((m) => sheetFromSrdMonster(m, "#3d8bfd"));
  const find = (name: string) => monsters.find((m) => m.name === name)!;

  it("are each a creature sheet the Codex loads as it is, with rolls it can show", () => {
    expect(monsters.length).toBeGreaterThan(300);
    for (const m of monsters) {
      const res = parseSheet(JSON.parse(JSON.stringify(m)));
      expect(res.ok && res.sheet, m.name).toEqual(m);
      for (const a of m.actions) expect(() => effects(m, a, "action"), `${m.name}: ${a.name}`).not.toThrow();
      for (const s of m.spells) expect(() => effects(m, s, "spell"), `${m.name}: ${s.name}`).not.toThrow();
    }
    expect(new Set(monsters.map((m) => m.name)).size).toBe(monsters.length);
  });

  it("match the stat block: an adult red dragon", () => {
    const d = find("Adult Red Dragon");
    expect(d).toMatchObject({ kind: "creature", rules, subtitle: "CR 17 · Huge dragon", ac: 19, hp: { max: 256 }, prof: 6 });
    const bite = d.actions.find((a) => a.name === (rules === "2014" ? "Bite" : "Rend"))!;
    expect(rollInfo(d, bite, "action").hit).toBe(14);
    const breath = d.actions.find((a) => a.name.startsWith("Fire Breath"))!;
    expect(rollInfo(d, breath, "action")).toMatchObject({ dc: 21, target: "dex" });
    expect(breath.uses).toMatchObject({ max: 1, recharge: "5–6" });
    expect(breath.dmg[0]).toMatchObject({ n: rules === "2014" ? 18 : 17, d: 6, type: "fire" });
    expect(d.actions.some((a) => a.act === "—" && a.range.startsWith("Legendary"))).toBe(true);
    expect(d.features.map((f) => f.name)).toContain("Damage Immunities: fire");
    expect(d.features.find((f) => f.name.startsWith("Legendary Resistance"))?.uses).toMatchObject({ max: 3, recharge: "LR" });
    expect(d.proficiencies.languages).toEqual(["Common", "Draconic"]);
  });

  it("match the stat block: spellcasting", () => {
    const mage = find("Mage");
    expect(mage.spellcasting?.ab).toBe("int");
    expect(spellDC(mage)).toBe(14);
    expect(mage.spells.map((s) => s.name)).toContain("Fireball");
    if (rules === "2014") {
      expect(spellAttack(mage)).toBe(6);
      expect(mage.slots[1]).toEqual({ max: 4, used: 0 });
    }
  });

  it("keep a bonus action as one", () => {
    const goblin = find(rules === "2014" ? "Goblin" : "Goblin Warrior");
    const escape = [...goblin.actions, ...goblin.features].find((x) => x.name === "Nimble Escape")!;
    if (rules === "2024") expect(escape).toMatchObject({ act: "BA" });
    else expect(goblin.features).toContainEqual(escape);
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
