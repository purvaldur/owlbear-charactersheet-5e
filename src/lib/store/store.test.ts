import { describe, expect, it } from "vitest";
import { flushSync } from "svelte";
import { SheetStore, STORAGE_KEY, type KeyValueStore } from "./sheets.svelte";
import { exportJson, importJson } from "./io";

const memory = (seed: Record<string, string> = {}): KeyValueStore & { data: Record<string, string> } => ({
  data: { ...seed },
  getItem(k) {
    return this.data[k] ?? null;
  },
  setItem(k, v) {
    this.data[k] = v;
  },
});

describe("sheet store", () => {
  it("creates, selects and persists sheets", () => {
    const mem = memory();
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

  it("saves automatically after changes settle", async () => {
    const mem = memory();
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
    const mem = memory({ [STORAGE_KEY]: '{"schemaVersion":1,"sheets":[{"id":1}],"activeId":null}' });
    const store = new SheetStore(mem).load();
    expect(store.loadErrors.length).toBeGreaterThan(0);
    store.create("character");
    store.flush();
    expect(mem.data[STORAGE_KEY]).toContain('"id":1');
  });

  it("removes and restores a sheet for undo", () => {
    const store = new SheetStore(memory()).load();
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
    const store = new SheetStore(memory()).load();
    const a = store.create("character");
    const res = importJson(exportJson([a]));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    store.addSheets(res.sheets);
    expect(store.library.sheets).toHaveLength(2);
    expect(store.library.sheets[1]!.id).not.toBe(a.id);
  });
  it("explains a file that is not a Codex file", () => {
    expect(importJson("{nope")).toMatchObject({ ok: false });
    const res = importJson(JSON.stringify({ hello: "world" }));
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors[0]).toBe("This is not a Codex sheet file.");
  });
});
