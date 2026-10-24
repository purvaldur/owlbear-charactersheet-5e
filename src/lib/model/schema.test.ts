import { describe, expect, it } from "vitest";
import { blankSheet } from "./defaults";
import { loadLibrary, parseSheet } from "./migrate";

describe("library loading", () => {
  it("round-trips a valid library", () => {
    const sh = blankSheet("character");
    const res = loadLibrary(JSON.parse(JSON.stringify({ schemaVersion: 1, sheets: [sh], activeId: sh.id })));
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.library.sheets[0]).toEqual(sh);
  });
  it("fills obvious defaults for missing optional fields", () => {
    const sh = blankSheet("creature") as unknown as Record<string, unknown>;
    delete sh.notes;
    delete sh.background;
    const res = parseSheet(sh);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.sheet.notes).toBe("");
      expect(res.sheet.background).toEqual({ name: "", feature: { name: "", desc: "" } });
    }
  });
  it("names the field that is wrong", () => {
    const sh = blankSheet("character") as unknown as Record<string, any>;
    sh.abilities.dex.score = "high";
    const res = parseSheet(sh);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors[0]).toMatch(/^abilities\.dex\.score/);
  });
  it("reads a cleared number field (saved as null) as the field's default", () => {
    const sh = blankSheet("character") as unknown as Record<string, any>;
    sh.ac = null;
    sh.abilities.str.score = null;
    sh.inventory.coins.gp = null;
    const res = loadLibrary({ schemaVersion: 1, sheets: [sh], activeId: sh.id });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.library.sheets[0]!.ac).toBe(10);
      expect(res.library.sheets[0]!.abilities.str.score).toBe(10);
      expect(res.library.sheets[0]!.inventory.coins.gp).toBe(0);
    }
  });
  it("reads save targets stored in capitals", () => {
    const sh = blankSheet("character") as unknown as Record<string, any>;
    sh.spells = [{ id: "s1", name: "Thunderwave", level: 1, save: { target: "CON" } }];
    const res = parseSheet(sh);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.sheet.spells[0]!.save).toEqual({ target: "con" });
  });
  it("refuses data from a newer schema", () => {
    const res = loadLibrary({ schemaVersion: 99, sheets: [], activeId: null });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors[0]).toMatch(/newer version/);
  });
});
