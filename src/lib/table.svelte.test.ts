// The table: rolls are shared, saves are answered, Dice+ is used when present and fallen back from when not.
import { describe, expect, it, vi } from "vitest";
import { App } from "./app.svelte";
import { MockRoom } from "./obr/mock";
import { SheetStore } from "./store/sheets.svelte";
import { CHANNELS, fitEntry } from "./log/channel";
import { SOURCE_ID, dicePlusReady, dicePlusSource, rollTarget } from "./dice/dicePlus";
import { sampleDrake, sampleIlse, memoryStorage } from "../dev/fixtures";
import { entryFrom, intentForItem } from "./dice/roll";
import { damage, newAction } from "./model/defaults";


async function setup(role: "PLAYER" | "GM" = "PLAYER") {
  const room = new MockRoom(role === "GM" ? { id: "gm", name: "GM", role } : {});
  const app = new App(new SheetStore(memoryStorage()));
  await app.init(room);
  app.store.addSheets([sampleIlse()]);
  return { app, room };
}

const breathEntry = () => {
  const d = sampleDrake();
  const breath = d.actions.find((a) => a.name === "Fire Breath")!;
  return entryFrom(intentForItem(d, breath, "action", "normal"), { parts: [[4, 6, 1, 3, 5, 2]] }, { sheet: d, player: "GM", playerId: "gm", vis: "public" });
};

describe("starting up", () => {
  it("starts on defaults when Owlbear refuses the player, theme or viewport", async () => {
    const room = new MockRoom();
    const refuse = () => Promise.reject({ error: { name: "MissingDataError" } });
    Object.assign(room, { player: refuse, theme: refuse, viewportWidth: refuse });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const app = new App(new SheetStore(memoryStorage()));
    await app.init(room);
    expect(app.ready).toBe(true);
    expect(app.viewport).toBe(1280);
    expect(app.player.role).toBe("PLAYER");
    expect(warn).toHaveBeenCalledTimes(3);
    warn.mockRestore();
  });
});

describe("the alert popover", () => {
  it("reads sheets and hears rolls, but never saves, asks for the backlog or watches tokens", async () => {
    const storage = memoryStorage();
    const room = new MockRoom();
    const app = new App(new SheetStore(storage));
    await app.init(room, { page: "alert" });
    app.store.create("character");
    room.addToken("Ilse");
    room.receive(CHANNELS.roll, { v: 1, entry: breathEntry() });
    await new Promise((r) => setTimeout(r, 350));
    expect(app.log.entries).toHaveLength(1);
    expect(storage.data).toEqual({});
    expect(app.tokens).toEqual([]);
    expect(room.sent.map((m) => m.channel)).not.toContain(CHANNELS.logRequest);
  });
});

describe("sharing rolls", () => {
  it("adds your roll locally, shares it with the others and toasts the result", async () => {
    const { app, room } = await setup();
    const sheet = app.sheet!;
    await app.rollItem(sheet, sheet.actions[0]!, "action");
    await new Promise((r) => setTimeout(r));
    // Sent to everyone including us (so our background page logs it), but the echo doesn't add a second card.
    expect(app.log.entries).toHaveLength(1);
    const sent = room.sent.find((m) => m.channel === CHANNELS.roll);
    expect(sent?.destination).toBe("ALL");
    expect(app.ui.toast?.msg).toMatch(/^Rapier: \d+ to hit( \((critical|natural 1)\))? · \d+ piercing$/);
  });

  it("toasts a save asked of you but never opens the sidebar", async () => {
    const { app, room } = await setup();
    room.receive(CHANNELS.roll, { v: 1, entry: breathEntry() });
    expect(app.log.entries).toHaveLength(1);
    expect(app.ui.sidebar).toBe(false);
    expect(app.ui.toast?.msg).toBe("Ash Drake: Dexterity save, DC 13");
    expect(app.log.unseen).toBe(1);
  });

  it("answers a save and shares the reply", async () => {
    const { app, room } = await setup();
    room.receive(CHANNELS.roll, { v: 1, entry: breathEntry() });
    const entry = app.log.entries[0]!;
    await app.replySave(entry, app.sheet!);
    expect(entry.replies).toHaveLength(1);
    expect(room.sent.some((m) => m.channel === CHANNELS.reply)).toBe(true);
  });

  it("passes a save on the total alone: a natural 20 can fail and a natural 1 can pass", async () => {
    const { app, room } = await setup();
    const answer = async (nat: number, dc: number) => {
      app.dice = { name: "dice+", roll: async () => ({ d20: [nat], parts: [] }) };
      room.receive(CHANNELS.roll, { v: 1, entry: { ...breathEntry(), save: { target: "dex", dc } } });
      const entry = app.log.entries.at(-1)!;
      await app.replySave(entry, app.sheet!);
      return entry.replies[0]!;
    };
    // Ilse's DEX save is +7.
    expect(await answer(20, 28)).toMatchObject({ pass: false, d20: { total: 27 } });
    expect(await answer(1, 8)).toMatchObject({ pass: true, d20: { total: 8 } });
  });

  it("hides another player's GM-only roll from players but shows it to the GM", async () => {
    const secret = { ...breathEntry(), playerId: "robin", vis: "gm" as const };
    const player = await setup("PLAYER");
    player.room.receive(CHANNELS.roll, { v: 1, entry: secret });
    expect(player.app.log.entries).toHaveLength(0);
    const gm = await setup("GM");
    gm.room.receive(CHANNELS.roll, { v: 1, entry: secret });
    expect(gm.app.log.entries).toHaveLength(1);
  });

  it("ignores malformed messages", async () => {
    const { app, room } = await setup();
    room.receive(CHANNELS.roll, { v: 1, entry: { hello: "world" } });
    room.receive(CHANNELS.roll, { v: 2, entry: breathEntry() });
    expect(app.log.entries).toHaveLength(0);
  });

  it("keeps a card under the broadcast limit", () => {
    const e = { ...breathEntry(), desc: "x".repeat(40_000) };
    expect(JSON.stringify(fitEntry(e)).length).toBeLessThan(15_000);
    // Counted in bytes: 9,000 of these characters are 27,000 bytes.
    const wide = { ...breathEntry(), desc: "龍".repeat(9_000) };
    expect(new TextEncoder().encode(JSON.stringify(fitEntry(wide))).length).toBeLessThan(15_000);
  });
});

describe("Dice+", () => {
  const answering = (room: MockRoom, groups = [{ description: "hit", diceType: "d20", total: 18, dice: [{ value: 18, kept: true }] }, { description: "p0", diceType: "d8", total: 5, dice: [{ value: 5, kept: true }] }]) => {
    room.listen("dice-plus/isReady", (d) => {
      const m = d as { requestId: string; ready?: boolean };
      if (!m.ready) room.receive("dice-plus/isReady", { requestId: m.requestId, ready: true, timestamp: Date.now() });
    });
    room.listen("dice-plus/roll-request", (d) => {
      const m = d as { rollId: string; diceNotation: string };
      room.receive(`${SOURCE_ID}/roll-result`, { rollId: m.rollId, result: { rollId: m.rollId, diceNotation: m.diceNotation, totalValue: 0, groups } });
    });
  };

  it("detects Dice+ and maps its groups back to the roll", async () => {
    const room = new MockRoom();
    answering(room);
    expect(await dicePlusReady(room, 200)).toBe(true);
    const ilse = sampleIlse();
    const intent = intentForItem(ilse, ilse.actions[0]!, "action", "normal");
    const out = await dicePlusSource(room, () => ({ id: "p", name: "Sam", role: "PLAYER" })).roll(intent, { vis: "public" });
    expect(out).toEqual({ d20: [18], parts: [[5]] });
  });

  it("reports not ready when nobody answers", async () => {
    expect(await dicePlusReady(new MockRoom(), 50)).toBe(false);
  });

  it("rolls damage-only actions with Dice+, but leaves rolls without dice to the sheet", async () => {
    const { app, room } = await setup();
    answering(room, [{ description: "p0", diceType: "d6", total: 9, dice: [2, 3, 4].map((value) => ({ value, kept: true })) }]);
    app.dice = dicePlusSource(room, () => app.player, 1000);
    const requests = () => room.sent.filter((m) => m.channel === "dice-plus/roll-request").map((m) => (m.data as { diceNotation: string }).diceNotation);
    const sheet = app.sheet!;

    const sneak = await app.rollItem(sheet, newAction({ name: "Sneak Attack", dmg: [damage(3, 6, "", 0, "piercing")] }), "action");
    expect(requests()).toEqual(["3d6 # p0"]);
    expect(sneak.dmg?.[0]?.rolls).toEqual([2, 3, 4]);

    const presence = await app.rollItem(sheet, newAction({ name: "Frightful Presence", save: { ab: "cha", dc: 16, target: "wis" } }), "action");
    const dodge = await app.rollItem(sheet, newAction({ name: "Uncanny Dodge", desc: "Halve the damage." }), "action");
    expect(requests()).toHaveLength(1);
    expect(presence.save).toEqual({ target: "wis", dc: 16 });
    expect(dodge.showDesc).toBe(true);
    expect(app.log.pending[presence.id]).toBeUndefined();
    expect(app.dice.name).toBe("dice+");
  });

  it("falls back to built-in dice when a Dice+ roll fails", async () => {
    vi.useFakeTimers();
    const { app, room } = await setup();
    app.dice = dicePlusSource(room, () => app.player, 1000);
    const p = app.rollItem(app.sheet!, app.sheet!.actions[0]!, "action");
    await vi.advanceTimersByTimeAsync(1100);
    const entry = await p;
    vi.useRealTimers();
    expect(entry.d20?.rolls.length).toBe(1);
    expect(app.dice.name).toBe("builtin");
    expect(app.log.pending[entry.id]).toBeUndefined();
  });

  it("maps visibility to Dice+ roll targets", () => {
    expect(rollTarget("public", "PLAYER")).toBe("everyone");
    expect(rollTarget("gm", "PLAYER")).toBe("dm");
    expect(rollTarget("gm", "GM")).toBe("self");
  });
});
