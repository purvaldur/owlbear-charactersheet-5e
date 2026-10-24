// v2.1: token links. Linking a selected token, keeping its HP in step, following the map selection, unlinking.
import { describe, expect, it, vi } from "vitest";
import { App } from "./app.svelte";
import { MockRoom } from "./obr/mock";
import { SheetStore } from "./store/sheets.svelte";
import { CHANNELS, chunkEntries, entriesMessage } from "./log/channel";
import { BARS_KEY, DEFAULT_BARS } from "./tokens/link";
import { sampleIlse, sampleMaren, sampleDrake } from "../dev/fixtures";
import { entryFrom, intentForItem } from "./dice/roll";

const memory = () => {
  const data: Record<string, string> = {};
  return { getItem: (k: string) => data[k] ?? null, setItem: (k: string, v: string) => void (data[k] = v) };
};
const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function setup() {
  const room = new MockRoom();
  const app = new App(new SheetStore(memory()));
  app.store.addSheets([sampleIlse(), sampleMaren()]);
  await app.init(room);
  await tick();
  return { app, room };
}

describe("linking tokens", () => {
  it("links the one selected token, with the sheet's HP, and undoes it", async () => {
    const { app, room } = await setup();
    const id = room.addToken("Ilse token");
    room.select([id]);
    const sheet = app.sheet!;
    await app.linkSelected(sheet);
    expect(room.tokenList[0]!.link).toMatchObject({ sheetId: sheet.id, ownerId: "player-sam", hp: sheet.hp });
    expect(app.linkedTokens(sheet)).toHaveLength(1);
    expect(app.ui.toast?.msg).toBe(`Linked Ilse token to ${sheet.name}`);
    app.ui.toast!.undo!();
    await tick();
    expect(room.tokenList[0]!.link).toBeNull();
  });

  it("asks for exactly one selected token", async () => {
    const { app, room } = await setup();
    await app.linkSelected(app.sheet!);
    expect(app.ui.toast?.msg).toBe("Select a token on the map first.");
    room.select([room.addToken("A"), room.addToken("B")]);
    await app.linkSelected(app.sheet!);
    expect(app.ui.toast?.msg).toBe("Select just one token to link.");
  });

  it("keeps linked tokens' HP in step with the sheet", async () => {
    const { app, room } = await setup();
    room.select([room.addToken("Ilse token")]);
    const sheet = app.sheet!;
    await app.linkSelected(sheet);
    app.changeHp(sheet, "dmg", 5);
    await tick(300);
    expect(room.tokenList[0]!.link?.hp).toEqual(sheet.hp);
  });

  it("says once when Owlbear refuses the token update", async () => {
    const { app, room } = await setup();
    room.select([room.addToken("GM's token")]);
    room.setLink = () => Promise.reject({ error: { name: "PermissionError" } });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await app.linkSelected(app.sheet!);
    expect(app.ui.toast?.msg).toMatch(/^Owlbear didn't let you update this token/);
    warn.mockRestore();
  });

  it("shows the sheet of my linked token when I select it, but not mid-edit or for others' tokens", async () => {
    const { app, room } = await setup();
    const [ilse, maren] = app.store.library.sheets;
    const mine = room.addToken("Maren token");
    room.select([mine]);
    await app.linkSelected(maren!);
    app.store.select(ilse!.id);
    room.select([]);
    room.select([mine]);
    expect(app.sheet?.id).toBe(maren!.id);

    app.store.select(ilse!.id);
    app.ui.edit = true;
    room.select([]);
    room.select([mine]);
    expect(app.sheet?.id).toBe(ilse!.id);
    app.ui.edit = false;

    const theirs = room.addToken("Robin's token", { sheetId: maren!.id, ownerId: "robin", kind: "character", name: "x", hp: { cur: 1, max: 1, temp: 0 } });
    room.select([theirs]);
    expect(app.sheet?.id).toBe(ilse!.id);
  });

  it("unlinks a deleted sheet's tokens and relinks them on undo", async () => {
    const { app, room } = await setup();
    room.select([room.addToken("Ilse token")]);
    const sheet = app.sheet!;
    await app.linkSelected(sheet);
    app.deleteSheet(sheet);
    await tick();
    expect(room.tokenList[0]!.link).toBeNull();
    app.ui.toast!.undo!();
    await tick();
    expect(room.tokenList[0]!.link?.sheetId).toBe(sheet.id);
  });

  it("shares the GM's bar settings through the room", async () => {
    const { app, room } = await setup();
    const bars = { ...DEFAULT_BARS, players: { character: "bar", creature: "none" } } as const;
    app.setBars(bars);
    await tick();
    expect(room.data[BARS_KEY]).toEqual(bars);
  });
});

describe("the background page's log", () => {
  const roll = (n: number) => {
    const d = sampleDrake();
    const breath = d.actions.find((a) => a.name === "Fire Breath")!;
    return { ...entryFrom(intentForItem(d, breath, "action", "normal"), { parts: [[4, 6, 1, 3, 5, 2]] }, { sheet: d, player: "GM", playerId: "gm", vis: "public" }), t: n };
  };

  it("asks for the backlog on start and merges it in time order without duplicates", async () => {
    const { app, room } = await setup();
    expect(room.sent.some((m) => m.channel === CHANNELS.logRequest && m.destination === "LOCAL")).toBe(true);
    const [a, b] = [roll(2), roll(1)];
    room.receive(CHANNELS.logChunk, entriesMessage([a, b]));
    room.receive(CHANNELS.logChunk, entriesMessage([a]));
    expect(app.log.entries.map((e) => e.t)).toEqual([1, 2]);
  });

  it("splits a long log into broadcast-sized chunks", () => {
    const entries = Array.from({ length: 60 }, (_, i) => ({ ...roll(i), desc: "x".repeat(400) }));
    const chunks = chunkEntries(entries, 4000);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.flat()).toHaveLength(60);
    for (const c of chunks) expect(JSON.stringify(c).length).toBeLessThanOrEqual(4000 + c.length);
  });
});
