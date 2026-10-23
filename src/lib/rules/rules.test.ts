import { describe, expect, it } from "vitest";
import { abilities, blankSheet, damage, newAction, newSpell, skills } from "../model/defaults";
import {
  applyDamage, applyHeal, deathSave, effects, hpHint, hpState, mod, parseHpDelta, partText, passive, rest, rollInfo,
  saveMod, signed, skillMod, spellAttack, spellDC,
} from "./index";

const ilse = () => {
  const sh = blankSheet("character");
  sh.prof = 3;
  sh.abilities = abilities([8, 18, 14, 14, 13, 10], ["dex", "int"]);
  sh.skills = skills({ acrobatics: 2, perception: 1 });
  sh.spellcasting = { ab: "int", atk: 0, dc: 0 };
  return sh;
};

describe("modifiers", () => {
  it("follows the 5e table", () => {
    expect([1, 8, 9, 10, 11, 12, 18, 20, 30].map(mod)).toEqual([-5, -1, -1, 0, 0, 1, 4, 5, 10]);
  });
  it("signs with a real minus", () => {
    expect(signed(-1)).toBe("−1");
    expect(signed(0)).toBe("+0");
  });
  it("adds proficiency to proficient saves only", () => {
    const sh = ilse();
    expect(saveMod(sh, "dex")).toBe(7);
    expect(saveMod(sh, "str")).toBe(-1);
  });
  it("doubles proficiency for expertise and derives passives", () => {
    const sh = ilse();
    expect(skillMod(sh, "acrobatics")).toBe(10);
    expect(skillMod(sh, "perception")).toBe(4);
    expect(skillMod(sh, "arcana")).toBe(2);
    expect(passive(sh, "perception")).toBe(14);
  });
  it("derives spell attack and DC with magic-item bonuses", () => {
    const sh = ilse();
    expect(spellAttack(sh)).toBe(5);
    expect(spellDC(sh)).toBe(13);
    sh.spellcasting = { ab: "int", atk: 1, dc: 2 };
    expect(spellAttack(sh)).toBe(6);
    expect(spellDC(sh)).toBe(15);
  });
});

describe("roll info and effects", () => {
  it("computes to-hit, damage text and a fixed DC override", () => {
    const sh = ilse();
    const rapier = newAction({ name: "Rapier", range: "Melee · 5 ft", hit: { ab: "dex", prof: true, flat: 0 }, dmg: [damage(1, 8, "dex", 0, "piercing")] });
    expect(rollInfo(sh, rapier, "action").hit).toBe(7);
    expect(partText(sh, rapier.dmg[0]!)).toBe("1d8+4");
    const breath = newAction({ save: { ab: "con", dc: null, target: "dex" } });
    expect(rollInfo(sh, breath, "action").dc).toBe(13);
    breath.save!.dc = 15;
    expect(rollInfo(sh, breath, "action").dc).toBe(15);
  });
  it("writes the effects line with the range as one unit", () => {
    const sh = ilse();
    const rapier = newAction({ range: "Melee · 5 ft · finesse", hit: { ab: "dex", prof: true, flat: 0 }, dmg: [damage(1, 8, "dex", 0, "piercing")] });
    const e = effects(sh, rapier, "action");
    expect(e.fx).toEqual([{ strong: "+7", rest: "to hit" }, { strong: "1d8+4", rest: "piercing" }]);
    expect(e.range).toBe("Melee · 5 ft · finesse");
  });
  it("labels healing and spell concentration", () => {
    const sh = ilse();
    const word = newSpell({ range: "60 ft", conc: true, dmg: [damage(1, 4, "sc", 0, "healing")] });
    const e = effects(sh, word, "spell");
    expect(e.fx[0]).toEqual({ strong: "1d4+2", rest: "healing" });
    expect(e.range).toBe("60 ft · concentration");
  });
  it("shows flat-only parts as the bonus", () => {
    expect(partText(ilse(), damage(0, 4, "", 1, "slashing"))).toBe("1");
  });
});

describe("hit points", () => {
  it("spends temp HP before current HP and floors at zero", () => {
    expect(applyDamage({ cur: 24, max: 38, temp: 5 }, 8)).toEqual({ cur: 21, max: 38, temp: 0 });
    expect(applyDamage({ cur: 3, max: 38, temp: 0 }, 10).cur).toBe(0);
  });
  it("heals up to max", () => {
    expect(applyHeal({ cur: 30, max: 38, temp: 0 }, 20).cur).toBe(38);
  });
  it("parses the damage-or-heal field", () => {
    expect(parseHpDelta("7")).toEqual({ n: 7, op: "dmg" });
    expect(parseHpDelta("-7")).toEqual({ n: 7, op: "dmg" });
    expect(parseHpDelta(" +6")).toEqual({ n: 6, op: "heal" });
    expect(parseHpDelta("abc").n).toBe(0);
  });
  it("hints what Enter will do", () => {
    expect(hpHint({ cur: 24, max: 38, temp: 5 }, "dmg", 8)).toBe("Enter: 8 damage, 24 → 21 (temp absorbs 5)");
    expect(hpHint({ cur: 24, max: 38, temp: 0 }, "heal", 6)).toBe("Enter: heal 6, 24 → 30");
  });
  it("classifies the bar colour", () => {
    expect(hpState({ cur: 38, max: 38, temp: 0 })).toBe("ok");
    expect(hpState({ cur: 19, max: 38, temp: 0 })).toBe("mid");
    expect(hpState({ cur: 9, max: 38, temp: 0 })).toBe("low");
  });
});

describe("death saves", () => {
  it("handles natural 20, natural 1, success and failure", () => {
    expect(deathSave({ s: 1, f: 1 }, 20)).toMatchObject({ revived: true, death: { s: 0, f: 0 } });
    expect(deathSave({ s: 0, f: 2 }, 1)).toMatchObject({ death: { s: 0, f: 3 }, text: "Natural 1: two failures. Dead" });
    expect(deathSave({ s: 2, f: 0 }, 12)).toMatchObject({ death: { s: 3, f: 0 }, text: "Success. Stable" });
    expect(deathSave({ s: 0, f: 0 }, 9)).toMatchObject({ death: { s: 0, f: 1 }, pass: false });
  });
});

describe("rests", () => {
  it("restores short-rest uses on a short rest and everything on a long rest", () => {
    const sh = ilse();
    sh.features = [
      { id: "a", name: "Channel", uses: { max: 1, used: 1, recharge: "SR" }, desc: "" },
      { id: "b", name: "Lucky", uses: { max: 3, used: 2, recharge: "LR" }, desc: "" },
    ];
    sh.slots = { "1": { max: 3, used: 2 } };
    sh.hp = { cur: 5, max: 38, temp: 3 };
    rest(sh, "SR");
    expect(sh.features.map((f) => f.uses!.used)).toEqual([0, 2]);
    expect(sh.slots["1"]!.used).toBe(2);
    rest(sh, "LR");
    expect(sh.features[1]!.uses!.used).toBe(0);
    expect(sh.slots["1"]!.used).toBe(0);
    expect(sh.hp).toEqual({ cur: 38, max: 38, temp: 0 });
  });
});

