import { describe, expect, it } from "vitest";
import { abilities, blankSheet, damage, newAction } from "../model/defaults";
import { entryFrom, intentForItem, intentForSave, needsCritDice, summary } from "./roll";

const sheet = () => {
  const sh = blankSheet("character");
  sh.prof = 3;
  sh.abilities = abilities([8, 18, 14, 14, 13, 10], ["dex"]);
  return sh;
};
const by = (sh: ReturnType<typeof sheet>) => ({ sheet: sh, player: "Sam", playerId: "p1", vis: "public" as const });

describe("roll intents", () => {
  it("rolls everything for a row: to-hit, damage and the save DC", () => {
    const sh = sheet();
    const bite = newAction({ name: "Bite", hit: { ab: "dex", prof: true, flat: 0 }, dmg: [damage(1, 10, "dex", 0, "piercing"), damage(1, 6, "", 0, "fire")], save: { ab: "con", dc: 13, target: "dex" } });
    const intent = intentForItem(sh, bite, "action", "adv");
    expect(intent.d20).toEqual({ mod: 7, mode: "adv", label: "to hit" });
    expect(intent.parts).toEqual([{ n: 1, d: 10, bonus: 4, type: "piercing" }, { n: 1, d: 6, bonus: 0, type: "fire" }]);
    expect(intent.save).toEqual({ target: "dex", dc: 13 });
  });
  it("uses save proficiency", () => {
    expect(intentForSave(sheet(), "dex", "normal").d20?.mod).toBe(7);
  });
});

describe("roll entries", () => {
  it("builds a card and summarises it", () => {
    const sh = sheet();
    const rapier = newAction({ name: "Rapier", hit: { ab: "dex", prof: true, flat: 0 }, dmg: [damage(1, 8, "dex", 0, "piercing")] });
    const intent = intentForItem(sh, rapier, "action", "normal");
    const en = entryFrom(intent, { d20: [13], parts: [[6]] }, by(sh), "r1");
    expect(en.d20?.total).toBe(20);
    expect(en.dmg?.[0]?.total).toBe(10);
    expect(summary(en)).toBe("Rapier: 20 to hit · 10 piercing");
  });
  it("asks for crit dice only on a natural 20 attack with damage", () => {
    const sh = sheet();
    const rapier = newAction({ hit: { ab: "dex", prof: true, flat: 0 }, dmg: [damage(1, 8, "dex", 0, "piercing")] });
    const intent = intentForItem(sh, rapier, "action", "normal");
    expect(needsCritDice(intent, { d20: [20], parts: [[3]] })).toBe(true);
    expect(needsCritDice(intent, { d20: [19], parts: [[3]] })).toBe(false);
  });
  it("shows the description when nothing is rolled", () => {
    const sh = sheet();
    const dash = newAction({ name: "Cunning Action", desc: "Dash, Disengage or Hide." });
    const en = entryFrom(intentForItem(sh, dash, "action", "normal"), { parts: [] }, by(sh));
    expect(en.showDesc).toBe(true);
  });
});
