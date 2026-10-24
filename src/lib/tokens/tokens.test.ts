import { describe, expect, it } from "vitest";
import { DEFAULT_BARS, LINK_KEY, BARS_KEY, linkFor, parseBars, parseLink, staleLinks, type TokenLink } from "./link";
import { barModel, barShapes, footprint, modeFor } from "./hpBar";
import { blankSheet } from "../model/defaults";

const link = (o: Partial<TokenLink> = {}): TokenLink => ({ sheetId: "s1", ownerId: "me", role: "PLAYER", kind: "character", name: "Ilse", hp: { cur: 24, max: 38, temp: 0 }, ...o });

describe("token links", () => {
  it("reads valid links and ignores malformed ones", () => {
    expect(parseLink({ [LINK_KEY]: link() })).toEqual(link());
    expect(parseLink({ [LINK_KEY]: { sheetId: "s1" } })).toBeNull();
    expect(parseLink({ [LINK_KEY]: { ...link(), hp: { cur: "x", max: 1, temp: 0 } } })).toBeNull();
    expect(parseLink(undefined)).toBeNull();
  });

  it("guesses the linker's role on links made before roles were recorded", () => {
    const { role: _, ...old } = link();
    expect(parseLink({ [LINK_KEY]: old })?.role).toBe("PLAYER");
    expect(parseLink({ [LINK_KEY]: { ...old, kind: "creature" } })?.role).toBe("GM");
  });

  it("fills missing or unknown bar settings from the defaults", () => {
    expect(parseBars(undefined)).toEqual(DEFAULT_BARS);
    expect(parseBars({ [BARS_KEY]: { players: { gm: "none", player: "sparkles" }, step: 33 } })).toEqual({
      gm: DEFAULT_BARS.gm,
      players: { player: "number", gm: "none" },
      step: 33,
    });
    // The settings shape before release, and step sizes that aren't offered.
    expect(parseBars({ [BARS_KEY]: { gm: { character: "bar" }, players: { creature: "none" }, step: 15 } })).toEqual(DEFAULT_BARS);
  });

  it("finds only my links whose HP, name, kind or role changed", () => {
    const sheet = blankSheet("character");
    sheet.hp = { cur: 7, max: 10, temp: 2 };
    const fresh = linkFor(sheet, "me", "PLAYER");
    const tokens = [
      { id: "t1", name: "", link: { ...fresh, hp: { cur: 10, max: 10, temp: 0 } } },
      { id: "t2", name: "", link: fresh },
      { id: "t3", name: "", link: { ...fresh, ownerId: "someone-else", hp: { cur: 1, max: 10, temp: 0 } } },
      { id: "t4", name: "", link: { ...fresh, sheetId: "gone" } },
      { id: "t5", name: "", link: null },
    ];
    expect(staleLinks(tokens, [sheet], "me", "PLAYER")).toEqual([{ id: "t1", link: fresh }]);
    // Made GM: every link of mine now counts as the GM's.
    expect(staleLinks(tokens, [sheet], "me", "GM").map((s) => s.id)).toEqual(["t1", "t2"]);
  });
});

describe("HP bars", () => {
  it("shows owners their own tokens exactly and others what the GM chose for their role", () => {
    const settings = { gm: { player: "bar" }, players: { player: "steps", gm: "none" }, step: 25 } as const;
    const gmToken = link({ ownerId: "gm", role: "GM", kind: "creature" });
    expect(modeFor(link(), { id: "me", role: "PLAYER" }, settings)).toBe("number");
    expect(modeFor(link(), { id: "gm", role: "GM" }, settings)).toBe("bar");
    expect(modeFor(gmToken, { id: "gm", role: "GM" }, settings)).toBe("number");
    expect(modeFor(gmToken, { id: "co-gm", role: "GM" }, settings)).toBe("number");
    expect(modeFor(link(), { id: "robin", role: "PLAYER" }, settings)).toBe("steps");
    expect(modeFor(gmToken, { id: "robin", role: "PLAYER" }, settings)).toBe("none");
    // A player's creature (a familiar) follows the player setting, not the GM's.
    expect(modeFor(link({ kind: "creature" }), { id: "robin", role: "PLAYER" }, settings)).toBe("steps");
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

  it("uses the GM's step size, landing exactly on breakpoints", () => {
    expect(barModel({ cur: 3, max: 10, temp: 0 }, "steps", 10)).toMatchObject({ fill: 0.3 });
    expect(barModel({ cur: 31, max: 100, temp: 0 }, "steps", 10)!.fill).toBeCloseTo(0.4);
    expect(barModel({ cur: 1, max: 3, temp: 0 }, "steps", 33)!.fill).toBeCloseTo(1 / 3);
    expect(barModel({ cur: 34, max: 100, temp: 0 }, "steps", 33)!.fill).toBeCloseTo(2 / 3);
    expect(barModel({ cur: 51, max: 100, temp: 0 }, "steps", 50)!.fill).toBe(1);
    expect(barModel({ cur: 1, max: 100, temp: 0 }, "steps", 20)!.ticks).toEqual([0.2, 0.4, 0.6, 0.8]);
    expect(barModel({ cur: 1, max: 100, temp: 0 }, "steps", 33)!.ticks).toHaveLength(2);
  });

  it("draws nothing in none mode and copes with zero max HP", () => {
    expect(barModel({ cur: 5, max: 10, temp: 0 }, "none")).toBeNull();
    expect(barModel({ cur: 0, max: 0, temp: 0 }, "bar")).toMatchObject({ fill: 0, temp: 0, state: "low" });
  });
});

describe("HP bar layout", () => {
  it("measures a token by its image, so rotating it doesn't change the bar", () => {
    const token = { scale: { x: 2, y: 2 }, image: { width: 300, height: 300 }, grid: { dpi: 300 } };
    // At 45°, a 300-unit token's bounding box is ~424 wide; the footprint stays 300, centred on the box.
    const box = footprint({ center: { x: 500, y: 500 }, width: 424, height: 424 }, token, 150);
    expect(box).toEqual({ x: 350, y: 350, w: 300 });
    expect(footprint({ center: { x: 0, y: 0 }, width: 80, height: 40 }, { scale: { x: 1, y: 1 } }, 150)).toEqual({ x: -40, y: -20, w: 80 });
  });

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
