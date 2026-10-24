import { describe, expect, it } from "vitest";
import { DEFAULT_BARS, LINK_KEY, BARS_KEY, linkFor, parseBars, parseLink, staleLinks, type TokenLink } from "./link";
import { barModel, barShapes, modeFor } from "./hpBar";
import { blankSheet } from "../model/defaults";

const link = (o: Partial<TokenLink> = {}): TokenLink => ({ sheetId: "s1", ownerId: "me", kind: "character", name: "Ilse", hp: { cur: 24, max: 38, temp: 0 }, ...o });

describe("token links", () => {
  it("reads valid links and ignores malformed ones", () => {
    expect(parseLink({ [LINK_KEY]: link() })).toEqual(link());
    expect(parseLink({ [LINK_KEY]: { sheetId: "s1" } })).toBeNull();
    expect(parseLink({ [LINK_KEY]: { ...link(), hp: { cur: "x", max: 1, temp: 0 } } })).toBeNull();
    expect(parseLink(undefined)).toBeNull();
  });

  it("fills missing or unknown bar settings from the defaults", () => {
    expect(parseBars(undefined)).toEqual(DEFAULT_BARS);
    expect(parseBars({ [BARS_KEY]: { players: { creature: "none", character: "sparkles" } } })).toEqual({
      gm: DEFAULT_BARS.gm,
      players: { character: "number", creature: "none" },
    });
  });

  it("finds only my links whose HP, name or kind changed", () => {
    const sheet = blankSheet("character");
    sheet.hp = { cur: 7, max: 10, temp: 2 };
    const fresh = linkFor(sheet, "me");
    const tokens = [
      { id: "t1", name: "", link: { ...fresh, hp: { cur: 10, max: 10, temp: 0 } } },
      { id: "t2", name: "", link: fresh },
      { id: "t3", name: "", link: { ...fresh, ownerId: "someone-else", hp: { cur: 1, max: 10, temp: 0 } } },
      { id: "t4", name: "", link: { ...fresh, sheetId: "gone" } },
      { id: "t5", name: "", link: null },
    ];
    expect(staleLinks(tokens, [sheet], "me")).toEqual([{ id: "t1", link: fresh }]);
  });
});

describe("HP bars", () => {
  it("shows owners their own tokens exactly and others what the GM chose", () => {
    const settings = { gm: { character: "bar", creature: "number" }, players: { character: "steps", creature: "none" } } as const;
    expect(modeFor(link(), { id: "me", role: "PLAYER" }, settings)).toBe("number");
    expect(modeFor(link(), { id: "gm", role: "GM" }, settings)).toBe("bar");
    expect(modeFor(link({ kind: "creature" }), { id: "gm", role: "GM" }, settings)).toBe("number");
    expect(modeFor(link(), { id: "robin", role: "PLAYER" }, settings)).toBe("steps");
    expect(modeFor(link({ kind: "creature" }), { id: "robin", role: "PLAYER" }, settings)).toBe("none");
  });

  it("labels the number mode and keeps temp HP inside the bar", () => {
    expect(barModel({ cur: 24, max: 38, temp: 5 }, "number")).toMatchObject({ label: "24/38 +5", state: "ok" });
    const full = barModel({ cur: 38, max: 38, temp: 5 }, "bar")!;
    expect(full.fill).toBe(1);
    expect(full.temp).toBe(0);
    expect(full.label).toBe("");
  });

  it("rounds steps up to quarters, so a standing creature never looks empty", () => {
    expect(barModel({ cur: 1, max: 100, temp: 0 }, "steps")).toMatchObject({ fill: 0.25, state: "low" });
    expect(barModel({ cur: 51, max: 100, temp: 0 }, "steps")).toMatchObject({ fill: 0.75, state: "ok" });
    expect(barModel({ cur: 50, max: 100, temp: 9 }, "steps")).toMatchObject({ fill: 0.5, temp: 0, state: "mid", label: "" });
    expect(barModel({ cur: 0, max: 100, temp: 0 }, "steps")!.fill).toBe(0);
  });

  it("draws nothing in none mode and copes with zero max HP", () => {
    expect(barModel({ cur: 5, max: 10, temp: 0 }, "none")).toBeNull();
    expect(barModel({ cur: 0, max: 0, temp: 0 }, "bar")).toMatchObject({ fill: 0, temp: 0, state: "low" });
  });
});

describe("HP bar layout", () => {
  it("sits above the token, scaled to its width, with fill and temp side by side", () => {
    const s = barShapes(barModel({ cur: 15, max: 30, temp: 5 }, "number")!, { x: 0, y: 100, w: 150 });
    expect(s.track.w).toBeCloseTo(135);
    expect(s.track.y + s.track.h).toBeLessThan(100);
    expect(s.fill!.w).toBeCloseTo((135 - 2 * s.stroke) * 0.5);
    expect(s.temp!.x).toBeCloseTo(s.fill!.x + s.fill!.w);
    expect(s.label?.text).toBe("15/30 +5");
  });

  it("draws three breakpoint ticks in steps mode and no fill at 0 HP", () => {
    const s = barShapes(barModel({ cur: 0, max: 30, temp: 0 }, "steps")!, { x: 0, y: 0, w: 150 });
    expect(s.ticks).toHaveLength(3);
    expect(s.fill).toBeNull();
    expect(s.label).toBeNull();
  });
});
