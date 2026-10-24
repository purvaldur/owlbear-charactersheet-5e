// @vitest-environment node
import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ABILITY, blankSheet } from "./defaults";
import { parseSheet } from "./migrate";
import { effects } from "../rules";
import { spellFromSrd, type SrdSpell } from "./srd";

describe("SRD spells", () => {
  it("adds every SRD spell as a spell the sheet can show and load", () => {
    execFileSync(process.execPath, [fileURLToPath(new URL("../../../scripts/build-srd.mjs", import.meta.url))]);
    const srd: SrdSpell[] = JSON.parse(readFileSync(fileURLToPath(new URL("../../../public/srd-spells.json", import.meta.url)), "utf8"));
    expect(srd.filter((s) => s[5] && !(s[5] in ABILITY)).map((s) => s[0])).toEqual([]);
    const sheet = blankSheet("character");
    sheet.spellcasting = { ab: "int", atk: 0, dc: 0, shortRest: false };
    sheet.spells = srd.map(spellFromSrd);
    for (const s of sheet.spells) expect(() => effects(sheet, s, "spell"), s.name).not.toThrow();
    const res = parseSheet(JSON.parse(JSON.stringify(sheet)));
    expect(res.ok && res.sheet.spells).toEqual(sheet.spells);
    expect(sheet.spells.find((s) => s.name === "Thunderwave")?.save).toEqual({ target: "con" });
  });
});
