import { afterEach, describe, expect, it, vi } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import SrdPicker from "./SrdPicker.svelte";
import { blankSheet, newItem, newSpell } from "../lib/model/defaults";
import type { SrdItem, SrdList, SrdSpell } from "../lib/model/srd";
import type { Item, Spell } from "../lib/model/types";

const tick = () => new Promise((r) => setTimeout(r, 0));
const item = (o: Partial<SrdItem>): SrdItem => {
  const { id: _, cat: __, ...it } = newItem(o);
  return { type: "Adventuring Gear", ...it, ...o };
};
const spell = (o: Partial<SrdSpell>): SrdSpell => {
  const { id: _, ...s } = newSpell(o);
  return { classes: [], school: "Evocation", ...s, ...o };
};
const ITEMS = [
  item({ name: "Rope", wt: 5, cost: 1 }),
  item({ name: "Longsword", type: "Weapon", wt: 3, cost: 15 }),
  item({ name: "Bag of Holding", type: "Wondrous Item", rarity: "uncommon" }),
];
const SPELLS = [
  spell({ name: "Bless", level: 1, classes: ["Cleric", "Paladin"], school: "Enchantment" }),
  spell({ name: "Fire Bolt", level: 0, classes: ["Sorcerer", "Wizard"] }),
  spell({ name: "Cure Wounds", level: 1, classes: ["Bard", "Cleric"], school: "Abjuration" }),
];

async function render(list: SrdList, data: unknown[], cat = "") {
  const fetch = vi.fn(async (_url: string) => ({ json: async () => data }));
  vi.stubGlobal("fetch", fetch);
  const sheet = blankSheet("character", undefined, "2014");
  sheet.inventory.items.push(newItem({ name: "Rope" }));
  const added: (Spell | Item)[][] = [];
  const target = document.createElement("div");
  const view = mount(SrdPicker, {
    target,
    props: { sheet, list, cat, size: { max: () => 800, set: () => {} }, onadd: (e) => added.push(e), onclose: () => {} },
  });
  flushSync();
  await tick();
  flushSync();
  const names = () => [...target.querySelectorAll(".row-nm")].map((e) => e.textContent?.replace(/\s+/g, " ").trim());
  const chip = (label: string) => [...target.querySelectorAll<HTMLButtonElement>(".lvl-chips button")].find((b) => b.textContent === label)!;
  const select = (label: string, value: string) => {
    const el = target.querySelector<HTMLSelectElement>(`select[aria-label="${label}"]`)!;
    el.value = value;
    el.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
  };
  return { fetch, target, added, names, chip, select, done: () => unmount(view) };
}

afterEach(() => vi.unstubAllGlobals());

describe("the SRD item list", () => {
  it("loads the items for the sheet's rules, filters them by kind, and adds the ones ticked to its category", async () => {
    const { fetch, target, added, names, chip, done } = await render("items", ITEMS, "equipment");
    expect(fetch.mock.calls[0]![0]).toMatch(/srd\/items-2014\.json$/);
    expect(target.querySelector("h2")?.textContent).toBe("Add to Equipment from SRD list");
    expect(target.querySelector(".ed-who")?.textContent).toContain("2014 rules (SRD 5.1)");
    expect(names()).toEqual(["Bag of Holding", "Longsword", "Rope In inventory"]);
    chip("Weapons").click();
    flushSync();
    expect(names()).toEqual(["Longsword"]);
    chip("Magic items").click();
    flushSync();
    expect(names()).toEqual(["Bag of Holding"]);
    chip("All").click();
    flushSync();
    // An item the inventory already has can be picked again, as the base for another.
    const boxes = [...target.querySelectorAll<HTMLInputElement>(".pick input")];
    expect(boxes.every((b) => !b.disabled)).toBe(true);
    // happy-dom doesn't send change on a checkbox's click.
    for (const b of [boxes[1]!, boxes[2]!]) {
      b.checked = true;
      b.dispatchEvent(new Event("change", { bubbles: true }));
    }
    flushSync();
    target.querySelector<HTMLButtonElement>(".ed-f .primary")!.click();
    expect(added[0]!.map((i) => [i.name, (i as Item).cat])).toEqual([["Longsword", "equipment"], ["Rope", "equipment"]]);
    expect(added[0]![0]).toMatchObject({ wt: 3, cost: 15 });
    expect(Object.keys(added[0]![0]!)).not.toContain("type");
    done();
  });
});

describe("the SRD spell list", () => {
  it("filters by level, class and school together", async () => {
    const { target, names, chip, select, done } = await render("spells", SPELLS);
    expect(names()).toEqual(["Fire Bolt", "Bless", "Cure Wounds"]);
    expect([...target.querySelectorAll('select[aria-label="Filter by class"] option')].map((o) => o.textContent)).toEqual(
      ["All classes", "Bard", "Cleric", "Paladin", "Sorcerer", "Wizard"],
    );
    select("Filter by class", "Cleric");
    expect(names()).toEqual(["Bless", "Cure Wounds"]);
    select("Filter by school", "Abjuration");
    expect(names()).toEqual(["Cure Wounds"]);
    select("Filter by school", "");
    chip("Cantrips").click();
    flushSync();
    expect(names()).toEqual([]);
    expect(target.querySelector(".log-empty")?.textContent).toContain("another name or filter");
    done();
  });
});
