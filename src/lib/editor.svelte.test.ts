// The editor popover: the Codex opens it, sends it the sheet, saves the changes it sends back and closes it.
import { describe, expect, it } from "vitest";
import { App } from "./app.svelte";
import { MockRoom } from "./obr/mock";
import { SheetStore } from "./store/sheets.svelte";
import { EDITOR, EDITOR_POPOVER, type ChangeMessage, type OpenMessage } from "./editor/protocol";
import { sampleIlse, memoryStorage } from "../dev/fixtures";
import type { Action } from "./model/types";

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function setup() {
  const room = new MockRoom();
  const app = new App(new SheetStore(memoryStorage()));
  app.store.addSheets([sampleIlse()]);
  await app.init(room);
  await tick();
  // What the editor page hears from the Codex.
  const opened: OpenMessage[] = [];
  room.pages.listen(EDITOR.open, (d) => opened.push(d as OpenMessage));
  return { app, room, sheet: app.sheet!, opened };
}

describe("the editor popover", () => {
  it("opens on a new action with the sheet, saves its changes without echoing them, and closes on Done", async () => {
    const { app, room, sheet, opened } = await setup();
    app.addItem(sheet, "action");
    await tick();
    const id = sheet.actions.at(-1)!.id;
    expect(room.popovers[EDITOR_POPOVER]).toMatchObject({ url: "/editor.html" });
    expect(opened).toHaveLength(1);
    expect(opened[0]).toMatchObject({ kind: "action", id, focus: true, ack: 0 });
    expect(opened[0]!.sheet.name).toBe(sheet.name);

    const item = { ...(opened[0]!.sheet.actions.at(-1) as Action), name: "Longsword", range: "Melee · 5 ft" };
    room.pages.send(EDITOR.change, { sheetId: sheet.id, kind: "action", item, seq: 1 } satisfies ChangeMessage);
    await tick();
    expect(sheet.actions.at(-1)).toMatchObject({ id, name: "Longsword", range: "Melee · 5 ft" });
    expect(opened).toHaveLength(1);

    room.pages.send(EDITOR.done, { sheetId: sheet.id, kind: "action", id });
    await tick();
    expect(app.ui.editing).toBeNull();
    expect(room.popovers[EDITOR_POPOVER]).toBeUndefined();
  });

  it("sends the sheet again when it changes in the Codex, acknowledging the editor's last change", async () => {
    const { app, room, sheet, opened } = await setup();
    const action = sheet.actions[0]!;
    app.ui.toggleEditor("action", action.id);
    await tick();
    room.pages.send(EDITOR.change, { sheetId: sheet.id, kind: "action", item: { ...$state.snapshot(action), name: "Renamed" }, seq: 3 });
    await tick();
    sheet.prof = 4;
    await tick();
    expect(opened).toHaveLength(2);
    expect(opened[1]).toMatchObject({ id: action.id, focus: false, ack: 3 });
    expect(opened[1]!.sheet.prof).toBe(4);
    expect(opened[1]!.sheet.actions[0]!.name).toBe("Renamed");
  });

  it("starts counting the editor's changes again when it opens anew", async () => {
    const { app, room, sheet, opened } = await setup();
    const action = sheet.actions[0]!;
    app.ui.toggleEditor("action", action.id);
    await tick();
    room.pages.send(EDITOR.change, { sheetId: sheet.id, kind: "action", item: $state.snapshot(action), seq: 9 });
    room.pages.send(EDITOR.done, { sheetId: sheet.id, kind: "action", id: action.id });
    await tick();
    app.ui.toggleEditor("action", action.id);
    await tick();
    expect(opened.at(-1)).toMatchObject({ focus: true, ack: 0 });
  });

  it("points the open editor at another entry instead of opening a second one", async () => {
    const { app, room, sheet, opened } = await setup();
    app.ui.toggleEditor("feature", sheet.features[0]!.id);
    await tick();
    app.ui.toggleEditor("item", sheet.inventory.items[0]!.id);
    await tick();
    expect(Object.keys(room.popovers)).toEqual([EDITOR_POPOVER]);
    expect(opened.map((m) => [m.kind, m.focus])).toEqual([["feature", true], ["item", true]]);
  });

  it("ignores a change that doesn't read as an entry, or is for another one", async () => {
    const { app, room, sheet } = await setup();
    const [first, second] = sheet.actions;
    app.ui.toggleEditor("action", first!.id);
    await tick();
    room.pages.send(EDITOR.change, { sheetId: sheet.id, kind: "action", item: { id: first!.id, dmg: "lots" }, seq: 1 });
    room.pages.send(EDITOR.change, { sheetId: sheet.id, kind: "action", item: { ...$state.snapshot(second!), name: "Not me" }, seq: 2 });
    await tick();
    expect(sheet.actions[0]!.dmg).toEqual(first!.dmg);
    expect(sheet.actions[1]!.name).not.toBe("Not me");
  });

  it("deletes the entry from the editor, with Undo, and closes it", async () => {
    const { app, room, sheet } = await setup();
    const item = sheet.inventory.items[0]!;
    const count = sheet.inventory.items.length;
    app.ui.toggleEditor("item", item.id);
    await tick();
    room.pages.send(EDITOR.remove, { sheetId: sheet.id, kind: "item", id: item.id });
    await tick();
    expect(sheet.inventory.items).toHaveLength(count - 1);
    expect(app.ui.toast?.msg).toBe(`Removed ${item.name}`);
    expect(room.popovers[EDITOR_POPOVER]).toBeUndefined();
    app.ui.toast!.undo!();
    expect(sheet.inventory.items[0]!.id).toBe(item.id);
  });

  it("closes when the Codex is put away, and closes a leftover editor with nothing to edit", async () => {
    const { app, room, sheet } = await setup();
    app.ui.toggleEditor("feature", sheet.features[0]!.id);
    await tick();
    room.setOpen(false);
    await tick();
    expect(app.ui.editing).toBeNull();
    expect(room.popovers[EDITOR_POPOVER]).toBeUndefined();

    await room.openDialog(EDITOR_POPOVER, "/editor.html", 540, 400);
    room.pages.send(EDITOR.ready, {});
    await tick();
    expect(room.popovers[EDITOR_POPOVER]).toBeUndefined();
  });
});

describe("inventory categories", () => {
  it("moves a deleted category's items to the first one left, keeps the last one, and undoes it", async () => {
    const { app, sheet } = await setup();
    const inv = sheet.inventory;
    const worn = inv.items.filter((i) => i.cat === "equipment").map((i) => i.id);
    app.removeCategory(sheet, "equipment");
    expect(inv.categories.map((c) => c.id)).toEqual(["backpack"]);
    expect(worn.every((id) => inv.items.find((i) => i.id === id)!.cat === "backpack")).toBe(true);
    expect(app.ui.toast?.msg).toBe(`Deleted Equipment; ${worn.length} items moved to Backpack`);
    app.removeCategory(sheet, "backpack");
    expect(inv.categories).toHaveLength(1);
    app.ui.toast!.undo!();
    expect(inv.categories.map((c) => c.id)).toEqual(["equipment", "backpack"]);
    expect(worn.every((id) => inv.items.find((i) => i.id === id)!.cat === "equipment")).toBe(true);
  });
});
