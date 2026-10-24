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
  it("gives an inventory from before 2.1.2 the default categories, its items in the backpack and no magic", () => {
    const sh = blankSheet("character") as unknown as { inventory: Record<string, unknown> };
    sh.inventory = { coins: { cp: 0, sp: 0, ep: 0, gp: 5, pp: 0 }, items: [{ id: "i1", qty: 1, name: "Rope", wt: 10 }] };
    const res = parseSheet(sh);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.sheet.inventory.categories.map((c) => c.name)).toEqual(["Equipment", "Backpack"]);
    expect(res.sheet.inventory.items[0]).toEqual({ id: "i1", qty: 1, name: "Rope", wt: 10, cost: 0, rarity: "", attune: false, attuned: false, desc: "", cat: "backpack" });
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
  it("keeps dice counts and uses to whole numbers from 0 to 100", () => {
    const sh = blankSheet("character") as unknown as Record<string, any>;
    sh.actions = [{ id: "a1", dmg: [{ n: 1e9, d: 6 }, { d: 8 }, { n: -3, d: 4 }], uses: { max: 2.5 } }];
    const res = parseSheet(sh);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.sheet.actions[0]!.dmg.map((p) => p.n)).toEqual([100, 1, 0]);
      expect(res.sheet.actions[0]!.uses?.max).toBe(2);
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
