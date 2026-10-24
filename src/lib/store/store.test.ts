import { describe, expect, it } from "vitest";
import { flushSync } from "svelte";
import { SheetStore, STORAGE_KEY } from "./sheets.svelte";
import { exportJson, importJson } from "./io";
import { partText, rollInfo } from "../rules";
import { blankSheet } from "../model/defaults";
import { memoryStorage } from "../../dev/fixtures";


describe("sheet store", () => {
  it("creates, selects and persists sheets", () => {
    const mem = memoryStorage();
    const store = new SheetStore(mem).load();
    const a = store.create("character");
    const b = store.create("creature");
    expect(store.active?.id).toBe(b.id);
    store.select(a.id);
    expect(store.active?.id).toBe(a.id);
    store.flush();
    const again = new SheetStore(mem).load();
    expect(again.library.sheets.map((s) => s.kind)).toEqual(["character", "creature"]);
    expect(again.active?.id).toBe(a.id);
  });

  it("starts new sheets with Unarmed Strike (characters only) and a walking speed", () => {
    const store = new SheetStore(memoryStorage()).load();
    const pc = store.create("character");
    const npc = store.create("creature");
    expect(pc.actions.map((a) => a.name)).toEqual(["Unarmed Strike"]);
    expect(partText(pc, pc.actions[0]!.dmg[0]!)).toBe("1");
    expect(rollInfo(pc, pc.actions[0]!, "action").hit).toBe(2);
    expect(npc.actions).toEqual([]);
    expect([pc, npc].map((s) => s.features.map((f) => f.name))).toEqual([["Walking Speed: 30 ft."], ["Walking Speed: 30 ft."]]);
  });

  it("saves automatically after changes settle", async () => {
    const mem = memoryStorage();
    const store = new SheetStore(mem).load();
    const stop = store.watch();
    const sh = store.create("character");
    sh.name = "Ilse Varga";
    flushSync();
    await new Promise((r) => setTimeout(r, 350));
    expect(JSON.parse(mem.data[STORAGE_KEY]!).sheets[0].name).toBe("Ilse Varga");
    stop();
  });

  it("flags blocked storage and keeps working in memory", () => {
    const store = new SheetStore(null).load();
    expect(store.storageBlocked).toBe(true);
    store.create("character");
    store.flush();
    expect(store.library.sheets).toHaveLength(1);
  });

  it("does not overwrite stored data it could not read", () => {
    const stored = '{"schemaVersion":99,"sheets":[],"activeId":null}';
    const mem = memoryStorage({ [STORAGE_KEY]: stored });
    const store = new SheetStore(mem).load();
    expect(store.loadErrors.length).toBeGreaterThan(0);
    store.create("character");
    store.flush();
    expect(mem.data[STORAGE_KEY]).toBe(stored);
  });

  it("loads the sheets it can read and keeps a broken one exactly as it was", () => {
    const good = blankSheet("character");
    const broken = { ...blankSheet("creature"), name: "Grog", abilities: "lost" };
    const mem = memoryStorage({ [STORAGE_KEY]: JSON.stringify({ schemaVersion: 1, sheets: [broken, good], activeId: broken.id }) });
    const store = new SheetStore(mem).load();
    expect(store.loadErrors).toEqual([]);
    expect(store.library.sheets.map((s) => s.id)).toEqual([good.id]);
    expect(store.active?.id).toBe(good.id);
    expect(store.unread.map((u) => u.name)).toEqual(["Grog"]);
    expect(store.unread[0]!.errors[0]).toMatch(/^abilities/);
    store.active!.name = "Ilse";
    store.flush();
    const saved = JSON.parse(mem.data[STORAGE_KEY]!);
    expect(saved.sheets.map((s: { name: string }) => s.name)).toEqual(["Ilse", "Grog"]);
    expect(saved.sheets[1]).toEqual(broken);
  });

  it("removes and restores a sheet for undo", () => {
    const store = new SheetStore(memoryStorage()).load();
    const a = store.create("character");
    store.create("creature");
    const removed = store.remove(a.id)!;
    expect(store.library.sheets).toHaveLength(1);
    store.restore(removed.sheet, removed.index);
    expect(store.library.sheets[0]!.id).toBe(a.id);
  });
});

describe("export and import", () => {
  it("round-trips sheets and gives colliding ids a fresh one", () => {
    const store = new SheetStore(memoryStorage()).load();
    const a = store.create("character");
    const res = importJson(exportJson([a]));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    store.addSheets(res.sheets);
    expect(store.library.sheets).toHaveLength(2);
    expect(store.library.sheets[1]!.id).not.toBe(a.id);
  });
  it("imports the sheets a file has that read, and names the ones that don't", () => {
    const good = blankSheet("character");
    const file = JSON.stringify({ format: "valdurs-codex", schemaVersion: 1, sheets: [good, { name: "Grog" }] });
    const res = importJson(file);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.sheets.map((s) => s.id)).toEqual([good.id]);
    expect(res.unread.map((u) => u.name)).toEqual(["Grog"]);
    const none = importJson(JSON.stringify({ format: "valdurs-codex", schemaVersion: 1, sheets: [{ name: "Grog" }] }));
    expect(none.ok).toBe(false);
    if (!none.ok) expect(none.errors[0]).toMatch(/^Grog: /);
  });
  it("explains a file that is not a Codex file", () => {
    expect(importJson("{nope")).toMatchObject({ ok: false });
    const res = importJson(JSON.stringify({ hello: "world" }));
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors[0]).toBe("This is not a Codex sheet file.");
  });
});
