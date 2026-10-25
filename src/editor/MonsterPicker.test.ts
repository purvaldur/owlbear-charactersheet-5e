import { afterEach, describe, expect, it, vi } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import MonsterPicker from "./MonsterPicker.svelte";
import { blankSheet, newAction } from "../lib/model/defaults";
import type { SrdMonster } from "../lib/model/srd";
import type { Sheet } from "../lib/model/types";

const tick = () => new Promise((r) => setTimeout(r, 0));
function monster(name: string, cr: number, type: string): SrdMonster {
  const { id: _, color: __, ...sheet } = blankSheet("creature", undefined, "2024");
  const { id: ___, ...bite } = newAction({ name: "Bite" });
  return { ...sheet, name, cr, type, size: "Medium", subtitle: `CR ${cr} · Medium ${type.toLowerCase()}`, actions: [bite], spells: [], features: [] };
}
const MONSTERS = [monster("Wolf", 0.25, "Beast"), monster("Adult Red Dragon", 17, "Dragon"), monster("Ogre", 2, "Giant")];

async function render() {
  const fetch = vi.fn(async (_url: string) => ({ json: async () => MONSTERS }));
  vi.stubGlobal("fetch", fetch);
  const made: Sheet[] = [];
  const target = document.createElement("div");
  const view = mount(MonsterPicker, { target, props: { rules: "2024", size: { max: () => 800, set: () => {} }, oncreate: (s) => made.push(s), onclose: () => {} } });
  flushSync();
  await tick();
  flushSync();
  const names = () => [...target.querySelectorAll(".row-nm")].map((e) => e.textContent);
  const chip = (label: string) => [...target.querySelectorAll<HTMLButtonElement>(".lvl-chips button")].find((b) => b.textContent === label)!;
  return { fetch, target, made, names, chip, done: () => unmount(view) };
}

afterEach(() => vi.unstubAllGlobals());

describe("the SRD creature list", () => {
  it("lists the rules' creatures by challenge rating, filters them, and makes a sheet of the one picked", async () => {
    const { fetch, target, made, names, chip, done } = await render();
    expect(fetch.mock.calls[0]![0]).toMatch(/srd\/monsters-2024\.json$/);
    expect(names()).toEqual(["Wolf", "Ogre", "Adult Red Dragon"]);
    chip("CR 17+").click();
    flushSync();
    expect(names()).toEqual(["Adult Red Dragon"]);
    chip("All").click();
    const type = target.querySelector<HTMLSelectElement>('select[aria-label="Filter by type"]')!;
    type.value = "Giant";
    type.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
    expect(names()).toEqual(["Ogre"]);

    const create = target.querySelector<HTMLButtonElement>(".ed-f .primary")!;
    expect(create.disabled).toBe(true);
    const radio = target.querySelector<HTMLInputElement>(".pick input")!;
    radio.checked = true;
    radio.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
    create.click();
    expect(made).toHaveLength(1);
    expect(made[0]).toMatchObject({ name: "Ogre", kind: "creature", rules: "2024" });
    expect(made[0]!.id).toBeTruthy();
    expect(made[0]!.actions[0]!.id).toBeTruthy();
    expect(Object.keys(made[0]!)).not.toContain("cr");
    done();
  });
});
