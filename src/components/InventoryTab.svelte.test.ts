import { describe, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import InventoryTab from "./InventoryTab.svelte";
import { app } from "../lib/app.svelte";
import { blankSheet, newItem } from "../lib/model/defaults";

function render(items: ReturnType<typeof newItem>[]) {
  const sheet = $state(blankSheet("character"));
  sheet.inventory.items.push(...items);
  const target = document.createElement("div");
  const view = mount(InventoryTab, { target, props: { sheet } });
  flushSync();
  return { sheet, target, done: () => unmount(view) };
}

describe("inventory tab", () => {
  it("shows what items weigh and are worth, each and in all, and a magic item's rarity", () => {
    const { target, done } = render([
      newItem({ name: "Diamond", cost: 300 }),
      newItem({ name: "Potion of healing", wt: 0.5, cost: 50, qty: 3, rarity: "common" }),
      newItem({ name: "Rope", wt: 10 }),
      newItem({ name: "Ring of Protection", rarity: "rare", attune: true }),
    ]);
    expect([...target.querySelectorAll(".row-fx")].map((e) => e.textContent)).toEqual([
      "300 gp each",
      "Common · 0.5 lb, 50 gp each · 1.5 lb, 150 gp",
      "10 lb each",
      "Rare, requires attunement",
    ]);
    expect(target.querySelector(".inv-sum .num")?.textContent).toBe("4 items · 11.5 lb · 450 gp");
    expect(target.querySelectorAll(".row-nm .ell")[3]!.className).toContain("rarity-rare");
    done();
  });

  it("attunes from the row's box, up to three items, and counts them in the pips", () => {
    const { sheet, target, done } = render(
      ["Cloak", "Ring", "Amulet", "Boots"].map((name, i) => newItem({ name, rarity: "uncommon", attune: true, attuned: i < 2 })),
    );
    const boxes = () => [...target.querySelectorAll<HTMLButtonElement>(".attune-box")];
    const pips = () => target.querySelectorAll(".attuned-pips .pip.on").length;
    expect(boxes()).toHaveLength(4);
    expect(pips()).toBe(2);
    boxes()[2]!.click();
    flushSync();
    expect(pips()).toBe(3);
    boxes()[3]!.click();
    flushSync();
    expect(sheet.inventory.items[3]!.attuned).toBe(false);
    expect(app.ui.toast?.msg).toBe("Already attuned to 3 items. End an attunement first.");
    boxes()[0]!.click();
    flushSync();
    expect(pips()).toBe(2);
    done();
  });

  it("adds a new item to a category, straight into the editor", () => {
    const { sheet, target, done } = render([]);
    target.querySelector<HTMLButtonElement>(".add-line")!.click();
    expect(sheet.inventory.items).toHaveLength(1);
    expect(sheet.inventory.items[0]!.cat).toBe("equipment");
    expect(app.ui.dialog).toEqual({ view: "edit", kind: "item", id: sheet.inventory.items[0]!.id });
    app.ui.dialog = null;
    done();
  });

  it("groups items by category, with a lost category's items in the first, and folds a category away", () => {
    const { sheet, target, done } = render([
      newItem({ name: "Rapier", wt: 2, cat: "equipment" }),
      newItem({ name: "Rope", wt: 10 }),
      newItem({ name: "Lantern", wt: 2, cat: "gone" }),
    ]);
    const sections = () => [...target.querySelectorAll(".cat-h")].map((h) => [h.querySelector(".cat-toggle")!.textContent, h.querySelector(".slot-lbl")!.textContent]);
    const names = () => [...target.querySelectorAll(".row-nm")].map((e) => e.textContent);
    expect(sections()).toEqual([["Equipment", "2 items · 4 lb"], ["Backpack", "1 item · 10 lb"]]);
    expect(names()).toEqual(["Rapier", "Lantern", "Rope"]);
    target.querySelector<HTMLButtonElement>(".cat-toggle")!.click();
    flushSync();
    expect(sheet.inventory.categories[0]!.collapsed).toBe(true);
    expect(names()).toEqual(["Rope"]);
    done();
  });
});
