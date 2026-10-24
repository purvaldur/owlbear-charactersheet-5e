import { describe, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import EditorPage from "./EditorPage.svelte";
import { MockRoom } from "../lib/obr/mock";
import { EDITOR, type ChangeMessage, type OpenMessage } from "../lib/editor/protocol";
import { sampleIlse } from "../dev/fixtures";

const tick = () => new Promise((r) => setTimeout(r, 0));

async function render() {
  const room = new MockRoom();
  const changes: ChangeMessage[] = [];
  let ready = 0;
  room.pages.listen(EDITOR.change, (d) => changes.push(d as ChangeMessage));
  room.pages.listen(EDITOR.ready, () => ready++);
  const target = document.createElement("div");
  const view = mount(EditorPage, { target, props: { room } });
  flushSync();
  await tick();
  const sheet = sampleIlse();
  const open = (m: Partial<OpenMessage>) => room.pages.send(EDITOR.open, { sheet, kind: "action", id: sheet.actions[0]!.id, focus: true, ack: 0, ...m });
  return { room, target, changes, sheet, open, ready: () => ready, done: () => unmount(view) };
}

const nameField = (target: HTMLElement) => target.querySelector<HTMLInputElement>(".item-ed input")!;

describe("the editor page", () => {
  it("asks for its entry, shows it, and sends each edit with a rising number", async () => {
    const { target, changes, sheet, open, ready, done } = await render();
    expect(ready()).toBe(1);
    open({});
    await tick();
    flushSync();
    expect(nameField(target).value).toBe(sheet.actions[0]!.name);
    expect(changes).toHaveLength(0);
    nameField(target).value = "Rapier +1";
    nameField(target).dispatchEvent(new Event("input"));
    flushSync();
    await tick();
    expect(changes).toEqual([expect.objectContaining({ sheetId: sheet.id, kind: "action", seq: 1, item: expect.objectContaining({ name: "Rapier +1" }) })]);
    done();
  });

  it("ignores a sheet sent before its latest change landed", async () => {
    const { target, open, done } = await render();
    open({});
    await tick();
    flushSync();
    nameField(target).value = "Mine";
    nameField(target).dispatchEvent(new Event("input"));
    flushSync();
    open({ focus: false, ack: 0 });
    await tick();
    flushSync();
    expect(nameField(target).value).toBe("Mine");
    done();
  });
});
