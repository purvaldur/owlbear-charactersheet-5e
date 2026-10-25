// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseSheet } from "../model/migrate";
import type { SrdItem } from "../model/srd";
import type { Rules } from "../model/types";
import { activeChoices, blankPicks, buildCharacter, choiceFrom, findFeat, subtitle } from "./build";
import { slotsFor } from "./tables";
import type { SetupPicks, SrdSetup } from "./types";

const data = <T>(name: string): T => JSON.parse(readFileSync(fileURLToPath(new URL(`../../../scripts/data/${name}`, import.meta.url)), "utf8"));
const SETUP: Record<Rules, SrdSetup> = { 2014: data("setup_2014.json"), 2024: data("setup_2024.json") };
const ITEMS: Record<Rules, SrdItem[]> = { 2014: data("items_2014.json"), 2024: data("items_2024.json") };
const picks = (o: Partial<SetupPicks>): SetupPicks => ({ ...blankPicks(), ...o });
const ARRAY = { str: 8, dex: 12, con: 14, int: 10, wis: 15, cha: 13 };

describe.each(["2014", "2024"] as const)("the %s setup data", (rules) => {
  const s = SETUP[rules];

  it("has every SRD class with what the setup needs, and their subclasses", () => {
    expect(s.classes).toHaveLength(12);
    for (const c of s.classes) {
      expect(c.hitDie, c.name).toBeGreaterThanOrEqual(6);
      expect(c.grants.saves, c.name).toHaveLength(2);
      expect(c.subclasses.length, c.name).toBeGreaterThan(0);
      expect(c.subclassLevel, c.name).toBeLessThanOrEqual(3);
      expect(c.features.length, c.name).toBeGreaterThan(5);
      expect(c.choices.some((x) => x.kind === "skill"), c.name).toBe(true);
      if (c.caster) expect(c.castingAbility, c.name).toBeTruthy();
    }
    expect(s.classes.filter((c) => c.caster).map((c) => c.name)).toEqual(["Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard"]);
  });

  it("has Open5e's misspellings corrected", () => {
    expect(JSON.stringify(s)).not.toMatch(/Unarmoed|Studdied/);
    if (rules === "2024") {
      expect(s.classes.find((c) => c.name === "Monk")!.features.map((f) => f.name)).toContain("Unarmored Movement");
      expect(s.classes.find((c) => c.name === "Fighter")!.features.map((f) => f.name)).toContain("Studied Attacks");
    }
  });

  it("asks only choices that can be answered", () => {
    const all = (choices: SrdSetup["general"]["choices"]): SrdSetup["general"]["choices"] =>
      choices.flatMap((c) => [c, ...all((c.options ?? []).flatMap((o) => o.choices ?? []))]);
    const choices = all([
      ...s.general.choices,
      ...s.species.flatMap((x) => [...x.choices, ...x.subspecies.flatMap((y) => y.choices)]),
      ...s.classes.flatMap((x) => [...x.choices, ...x.subclasses.flatMap((y) => y.choices)]),
      ...s.backgrounds.flatMap((x) => x.choices),
      ...s.feats.flatMap((x) => x.choices),
    ]);
    for (const c of choices) {
      if (c.from === "proficient") continue;
      expect(choiceFrom(s, c).length, `${c.label}`).toBeGreaterThanOrEqual(c.count);
      if (c.kind === "feat") for (const f of choiceFrom(s, c)) expect(findFeat(s, f), f).toBeTruthy();
    }
    for (const b of s.backgrounds) if (b.feat) expect(findFeat(s, b.feat), b.feat).toBeTruthy();
  });

  it("gives starting equipment that is SRD items, or named for what the SRD doesn't list", () => {
    const items = new Set(ITEMS[rules].map((i) => i.name));
    for (const c of [...s.classes, ...s.backgrounds])
      for (const g of c.equipment) {
        expect(g.options.length, c.name).toBeGreaterThan(0);
        for (const o of g.options) for (const it of o.items) if (it.srd) expect(items.has(it.srd), `${c.name}: ${it.srd}`).toBe(true);
      }
    expect(s.classes.every((c) => c.equipment.length)).toBe(true);
  });
});

describe("a guided-setup character", () => {
  it("2014: a level 5 hill dwarf life cleric", () => {
    const s = SETUP[2014];
    const p = picks({ name: "Bruna", species: "Dwarf", subspecies: "Hill Dwarf", class: "Cleric", level: 5, subclass: "Life Domain", background: "Acolyte", scores: ARRAY });
    const tool = activeChoices(s, p).find((a) => a.choice.kind === "tool")!;
    p.choices[tool.key] = ["Smith's tools"];
    p.choices[activeChoices(s, p).find((a) => a.source === "Cleric" && a.choice.kind === "skill")!.key] = ["Medicine", "History"];
    p.choices[activeChoices(s, p).find((a) => a.source === "Acolyte")!.key] = ["Elvish", "Giant"];
    const sh = buildCharacter(s, p, ITEMS[2014]);

    expect(sh).toMatchObject({ name: "Bruna", subtitle: "Hill Dwarf Life Domain Cleric 5", rules: "2014", prof: 3 });
    // Wisdom 15 + 1 (hill dwarf), Constitution 14 + 2 (dwarf).
    expect(sh.abilities.wis).toEqual({ score: 16, save: true });
    expect(sh.abilities.con).toEqual({ score: 16, save: false });
    expect(sh.abilities.cha.save).toBe(true);
    // d8: 8 + 3, then 4 × (5 + 3), plus 1 a level from Dwarven Toughness.
    expect(sh.hp.max).toBe(11 + 4 * 8 + 5);
    expect(sh.spellcasting).toMatchObject({ ab: "wis", shortRest: false });
    expect(sh.slots).toEqual(slotsFor("full", 5));
    expect(sh.slots).toMatchObject({ 1: { max: 4 }, 2: { max: 3 }, 3: { max: 2 } });
    expect(sh.skills).toMatchObject({ insight: 1, religion: 1, medicine: 1, history: 1, arcana: 0 });
    expect(sh.proficiencies.armor).toEqual(["Light armor", "Medium armor", "Shields", "Heavy armor"]);
    expect(sh.proficiencies.weapons).toContain("Battleaxe");
    expect(sh.proficiencies.tools).toEqual(["Smith's tools"]);
    expect(sh.proficiencies.languages).toEqual(["Common", "Dwarvish", "Elvish", "Giant"]);
    const names = sh.features.map((f) => f.name);
    expect(names[0]).toBe("Walking Speed: 25 ft.");
    expect(names).toEqual(expect.arrayContaining(["Dwarven Toughness", "Disciple of Life", "Channel Divinity: Preserve Life"]));
    expect(names).not.toContain("Divine Strike"); // level 8
    expect(sh.background).toMatchObject({ name: "Acolyte", feature: { name: "Shelter of the Faithful" } });
    // The first of each equipment choice: a mace, scale mail, a light crossbow and bolts, a priest's pack; a shield and holy symbol.
    expect(sh.inventory.items.map((i) => i.name)).toEqual(expect.arrayContaining(["Mace", "Scale mail", "Light crossbow", "Shield"]));
    expect(sh.inventory.items.find((i) => i.name === "Mace")).toMatchObject({ wt: 4, cat: "equipment" });
    expect(sh.inventory.coins.gp).toBe(15);
    const res = parseSheet(JSON.parse(JSON.stringify(sh)));
    expect(res.ok && res.sheet).toEqual(sh);
  });

  it("2024: a level 1 elf rogue with expertise, a lineage and a background's increases and feat", () => {
    const s = SETUP[2024];
    const p = picks({ species: "Elf", class: "Rogue", level: 1, background: "Criminal", scores: { str: 8, dex: 15, con: 13, int: 14, wis: 12, cha: 10 }, increases: { dex: 2, int: 1 } });
    const key = (match: (a: ReturnType<typeof activeChoices>[number]) => boolean) => activeChoices(s, p).find(match)!.key;
    p.choices[key((a) => a.choice.id === "elven-lineage")] = ["Wood Elf"];
    p.choices[key((a) => a.choice.id === "species-keen-senses-skill")] = ["Perception"];
    p.choices[key((a) => a.source === "Rogue" && a.choice.kind === "skill")] = ["Acrobatics", "Deception", "Investigation", "Insight"];
    p.choices[key((a) => a.choice.kind === "expertise")] = ["Stealth", "Perception"];
    p.choices[key((a) => a.choice.id === "languages")] = ["Elvish", "Goblin"];
    p.equipment["class/0"] = 0;
    p.equipment["background/0"] = 1;
    const sh = buildCharacter(s, p, ITEMS[2024]);

    // Subclass comes at 3, so a level 1 rogue names none.
    expect(sh.subtitle).toBe("Elf Rogue 1");
    expect(sh.abilities.dex.score).toBe(17);
    expect(sh.abilities.int.score).toBe(15);
    expect(sh.hp.max).toBe(8 + 1);
    expect(sh.skills).toMatchObject({ stealth: 2, perception: 2, acrobatics: 1, sleight: 1 });
    expect(sh.proficiencies.tools).toEqual(["Thieves' Tools"]);
    expect(sh.proficiencies.languages).toEqual(["Common", "Thieves' Cant", "Elvish", "Goblin"]);
    expect(sh.features[0]!.name).toBe("Walking Speed: 35 ft.");
    expect(sh.features.map((f) => f.name)).toEqual(expect.arrayContaining(["Elven Lineage: Wood Elf", "Sneak Attack", "Alert"]));
    expect(sh.spellcasting).toBeNull();
    // Rogue option A and the background's 50 GP.
    expect(sh.inventory.items.map((i) => i.name)).toContain("Burglar's Pack");
    expect(sh.inventory.coins.gp).toBe(8 + 50);
  });

  it("2024: a dragonborn's breath weapon grows with level and has proficiency-many uses", () => {
    const s = SETUP[2024];
    const p = picks({ species: "Dragonborn", class: "Paladin", level: 11, scores: ARRAY });
    p.choices[activeChoices(s, p).find((a) => a.choice.id === "draconic-ancestry")!.key] = ["Red dragon"];
    const sh = buildCharacter(s, p, ITEMS[2024]);
    expect(sh.actions.find((a) => a.name === "Breath Weapon")).toMatchObject({ dmg: [{ n: 3, d: 10, type: "fire" }], uses: { max: 4 }, save: { target: "dex" } });
    expect(sh.slots).toEqual(slotsFor("half2024", 11));
    expect(sh.slots[1]).toEqual({ max: 4, used: 0 });
    expect(sh.slots[3]).toEqual({ max: 3, used: 0 });
  });

  it("2024: a human's origin feat brings its own choices", () => {
    const s = SETUP[2024];
    const p = picks({ species: "Human" });
    p.choices[activeChoices(s, p).find((a) => a.choice.kind === "feat")!.key] = ["Skilled"];
    const skilled = activeChoices(s, p).find((a) => a.choice.id === "skilled")!;
    expect(skilled.choice.count).toBe(3);
    p.choices[skilled.key] = ["Arcana", "Lute", "History"];
    const sh = buildCharacter(s, p, ITEMS[2024]);
    expect(sh.skills).toMatchObject({ arcana: 1, history: 1 });
    expect(sh.proficiencies.tools).toEqual(["Lute"]);
    expect(sh.features.map((f) => f.name)).toContain("Skilled");
  });

  it("gets actions and uses from class features: a fighter's Second Wind and Action Surge, a rogue's Sneak Attack", () => {
    const f14 = buildCharacter(SETUP[2014], picks({ class: "Fighter", level: 5, scores: ARRAY }), ITEMS[2014]);
    expect(f14.actions.find((a) => a.name === "Second Wind")).toMatchObject({ act: "BA", dmg: [{ n: 1, d: 10, flat: 5, type: "healing" }], uses: { max: 1, recharge: "SR" } });
    expect(f14.features.find((f) => f.name === "Action Surge")?.uses).toMatchObject({ max: 1, recharge: "SR" });
    const f24 = buildCharacter(SETUP[2024], picks({ class: "Fighter", level: 10, scores: ARRAY }), ITEMS[2024]);
    expect(f24.actions.find((a) => a.name === "Second Wind")).toMatchObject({ dmg: [{ n: 1, d: 10, flat: 10 }], uses: { max: 4 } });
    const rogue = buildCharacter(SETUP[2024], picks({ class: "Rogue", level: 7, scores: ARRAY }), ITEMS[2024]);
    expect(rogue.actions.find((a) => a.name === "Sneak Attack")?.dmg).toEqual([{ n: 4, d: 6, ab: "", flat: 0, type: "" }]);
    const monk = buildCharacter(SETUP[2024], picks({ class: "Monk", level: 5, scores: ARRAY }), ITEMS[2024]);
    expect(monk.actions.map((a) => a.name)).toEqual(["Unarmed Strike (Martial Arts)"]);
    expect(monk.actions[0]!.dmg[0]).toMatchObject({ n: 1, d: 8, ab: "dex" });
    expect(monk.features.find((f) => f.name === "Monk's Focus")?.uses?.max).toBe(5);
    const bard = buildCharacter(SETUP[2014], picks({ class: "Bard", scores: ARRAY }), ITEMS[2014]);
    expect(bard.features.find((f) => f.name === "Bardic Inspiration")?.uses?.max).toBe(1);
    // Open5e's class tables aren't features.
    expect(f14.features.map((f) => f.name)).not.toContain("Rages");
  });

  it("left blank, is the starter sheet with a name and a custom subtitle", () => {
    const sh = buildCharacter(SETUP[2014], picks({ name: "Nobody" }), ITEMS[2014]);
    expect(sh).toMatchObject({ name: "Nobody", subtitle: "Custom Species, Custom Class 1", hp: { max: 10 }, spellcasting: null, slots: {} });
    expect(sh.features.map((f) => f.name)).toEqual(["Walking Speed: 30 ft."]);
    expect(sh.actions.map((a) => a.name)).toEqual(["Unarmed Strike"]);
  });
});

describe("a guided-setup subtitle", () => {
  const s = SETUP[2024];
  const sub = (o: Partial<SetupPicks>) => subtitle(s, picks(o));
  it("names species, subclass, class and level, with Custom for a step left blank", () => {
    expect(sub({ species: "Human", class: "Fighter", subclass: "Champion", level: 4 })).toBe("Human Champion Fighter 4");
    expect(sub({ species: "Human", class: "Fighter", level: 4 })).toBe("Human, Custom Subclass Fighter 4");
    expect(sub({ class: "Fighter", subclass: "Champion", level: 4 })).toBe("Custom Species, Champion Fighter 4");
    expect(sub({ species: "Human", level: 4 })).toBe("Human, Custom Class 4");
    expect(sub({ species: "Human", class: "Fighter", level: 2 })).toBe("Human Fighter 2");
    expect(subtitle(SETUP[2014], picks({ species: "Dwarf", subspecies: "Hill Dwarf", class: "Cleric", subclass: "Life Domain", level: 5 }))).toBe("Hill Dwarf Life Domain Cleric 5");
  });

  it("names a Custom step by the name given for it", () => {
    expect(sub({ customSpecies: "Owlfolk", class: "Fighter", subclass: "Champion", level: 4 })).toBe("Owlfolk Champion Fighter 4");
    expect(sub({ species: "Human", customClass: "Blood Hunter", customSubclass: "Order of the Lycan", level: 3 })).toBe("Human Order of the Lycan Blood Hunter 3");
    expect(sub({ species: "Human", customClass: "Blood Hunter", level: 3 })).toBe("Human Blood Hunter 3");
    expect(sub({ species: "Human", class: "Fighter", customSubclass: "Rune Knight", level: 3 })).toBe("Human Rune Knight Fighter 3");
    expect(sub({ customSpecies: "Owlfolk", level: 3 })).toBe("Owlfolk, Custom Class 3");
  });
});
