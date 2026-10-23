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
  it("refuses data from a newer schema", () => {
    const res = loadLibrary({ schemaVersion: 99, sheets: [], activeId: null });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors[0]).toMatch(/newer version/);
  });
});
