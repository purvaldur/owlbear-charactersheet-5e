import { afterEach, describe, expect, it, vi } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Setup from "./Setup.svelte";
import type { Sheet } from "../../lib/model/types";

// From the project root: under happy-dom, import.meta.url isn't a file URL.
const data = (name: string) => JSON.parse(readFileSync(join(process.cwd(), "scripts/data", name), "utf8"));
const tick = () => new Promise((r) => setTimeout(r, 0));

async function render() {
  const file = (url: string) => `${url.match(/(setup|items|spells)-(\d{4})/)!.slice(1).join("_")}.json`;
  const fetch = vi.fn(async (url: string) => ({ json: async () => data(file(url)) }));
  vi.stubGlobal("fetch", fetch);
  const made: Sheet[] = [];
  const target = document.createElement("div");
  const view = mount(Setup, { target, props: { rules: "2024", size: { max: () => 800, set: () => {} }, oncreate: (s) => made.push(s), onclose: () => {} } });
  flushSync();
  for (let i = 0; i < 5; i++) await tick();
  flushSync();
  const step = () => target.querySelector(".setup-steps [aria-current]")?.textContent;
  const steps = () => [...target.querySelectorAll(".setup-steps button")].map((b) => b.textContent);
  const choose = (name: string) => {
    const label = [...target.querySelectorAll(".pick")].find((l) => l.querySelector(".row-nm")?.textContent === name)!;
    const input = label.querySelector("input")!;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
  };
  const check = (text: string) => {
    const input = [...target.querySelectorAll<HTMLLabelElement>(".setup-checks .check")].find((l) => l.textContent === text)!.querySelector("input")!;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
  };
  const next = () => {
    target.querySelector<HTMLButtonElement>(".ed-f .primary")!.click();
    flushSync();
  };
  return { fetch, target, made, step, steps, choose, check, next, done: () => unmount(view) };
}

afterEach(() => vi.unstubAllGlobals());

describe("the guided setup", () => {
  it("walks species, class, background, abilities, choices and equipment to a finished character", async () => {
    const { fetch, target, made, step, steps, choose, check, next, done } = await render();
    expect(fetch.mock.calls.map((c) => c[0])).toEqual([expect.stringMatching(/setup-2024\.json$/), expect.stringMatching(/items-2024\.json$/), expect.stringMatching(/spells-2024\.json$/)]);
    expect(step()).toBe("1. Core");
    const name = target.querySelector<HTMLInputElement>(".setup-b .fld input")!;
    name.value = "Hale";
    name.dispatchEvent(new Event("input", { bubbles: true }));
    flushSync();
    next();
    expect(step()).toBe("2. Species");
    choose("Human");
    next();
    expect(step()).toBe("3. Class");
    choose("Fighter");
    const level = target.querySelector<HTMLInputElement>(".setup-level input")!;
    level.value = "3";
    level.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
    // Fighters choose a subclass at 3, so the step appears.
    expect(steps()).toContain("4. Subclass");
    next();
    choose("Champion");
    next();
    expect(step()).toBe("5. Background");
    choose("Soldier");
    next();
    expect(step()).toBe("6. Abilities");
    next();
    expect(step()).toBe("7. Choices");
    // Two Fighter skills: the third can't be ticked. Athletics is the Soldier's already.
    const group = [...target.querySelectorAll(".section-h")].find((h) => h.textContent?.startsWith("Fighter: Skill"))!.nextElementSibling!;
    const box = (text: string) => [...group.querySelectorAll<HTMLLabelElement>(".check")].find((l) => l.textContent === text)!.querySelector("input")!;
    expect(box("Athletics").disabled).toBe(true);
    for (const s of ["Perception", "Survival"]) {
      const b = box(s);
      b.checked = true;
      b.dispatchEvent(new Event("change", { bubbles: true }));
      flushSync();
    }
    expect(box("History").disabled).toBe(true);
    // Perception, picked for the Fighter, can't be picked again for the human's Skillful.
    const skillful = [...target.querySelectorAll(".section-h")].find((h) => h.textContent?.startsWith("Human: Skillful"))!.nextElementSibling!;
    const perception = [...skillful.querySelectorAll<HTMLLabelElement>(".check")].find((l) => l.textContent === "Perception")!;
    expect(perception.querySelector("input")!.disabled).toBe(true);
    expect(perception.title).toBe("Picked in another choice");
    check("Dice set");
    next();
    expect(step()).toBe("8. Equipment");
    next();
    expect(step()).toBe("9. Review");
    expect(target.querySelector(".setup-review")?.textContent).toContain("Human Champion Fighter 3");
    next();
    expect(made).toHaveLength(1);
    expect(made[0]).toMatchObject({ name: "Hale", kind: "character", rules: "2024", subtitle: "Human Champion Fighter 3" });
    expect(made[0]!.skills).toMatchObject({ athletics: 1, intimidation: 1, perception: 1, survival: 1 });
    expect(made[0]!.proficiencies.tools).toContain("Dice set");
    done();
  });

  it("can leave every step Custom and still make a character, named or not", async () => {
    const { target, made, step, next, done } = await render();
    next();
    expect(step()).toBe("2. Species");
    const custom = target.querySelector<HTMLInputElement>(".setup-custom input")!;
    custom.value = "Owlfolk";
    custom.dispatchEvent(new Event("input", { bubbles: true }));
    flushSync();
    for (let i = 0; i < 10 && !step()?.endsWith("Review"); i++) next();
    next();
    expect(made[0]).toMatchObject({ subtitle: "Owlfolk, Custom Class 1", name: "New character" });
    done();
  });

  it("asks Magic Initiate's list, then its spells and spellcasting ability, and gives the spells", async () => {
    const { target, made, step, choose, check, next, done } = await render();
    next();
    choose("Human");
    for (let i = 0; i < 6 && step() !== "6. Choices"; i++) next();
    expect(step()).toBe("6. Choices");
    check("Magic Initiate");
    choose("Wizard");
    const heads = () => [...target.querySelectorAll(".section-h")].map((h) => h.textContent);
    expect(heads().some((h) => h?.startsWith("Wizard: Magic Initiate: Wizard cantrips"))).toBe(true);
    check("Fire Bolt");
    check("Light");
    check("Magic Missile");
    check("Intelligence");
    for (let i = 0; i < 4 && !step()?.endsWith("Review"); i++) next();
    expect(target.querySelector(".setup-review")?.textContent).toContain("Fire Bolt, Light, Magic Missile");
    next();
    expect(made[0]!.spells.map((s) => s.name)).toEqual(["Fire Bolt", "Light", "Magic Missile"]);
    expect(made[0]!.spellcasting?.ab).toBe("int");
    done();
  });

  it("starts a class's choices over when the class changes, so nothing is stuck", async () => {
    const { target, step, choose, done } = await render();
    const go = (name: string) => {
      [...target.querySelectorAll<HTMLButtonElement>(".setup-steps button")].find((b) => b.textContent?.endsWith(name))!.click();
      flushSync();
    };
    go("Class");
    choose("Rogue");
    go("Choices");
    const skills = () => [...target.querySelectorAll(".section-h")].find((h) => /^(Rogue|Fighter): Skill/.test(h.textContent ?? ""))!;
    const tick = (text: string) => {
      const input = [...skills().nextElementSibling!.querySelectorAll<HTMLLabelElement>(".check")].find((l) => l.textContent === text)!.querySelector("input")!;
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      flushSync();
    };
    for (const s of ["Deception", "Stealth", "Sleight of Hand", "Investigation"]) tick(s);
    expect(skills().textContent).toContain("4 of 4");
    go("Class");
    choose("Fighter");
    go("Choices");
    expect(step()).toMatch(/Choices$/);
    expect(skills().textContent).toContain("Fighter: Skill proficiencies");
    expect(skills().textContent).toContain("0 of 2");
    const boxes = [...skills().nextElementSibling!.querySelectorAll<HTMLInputElement>("input")];
    expect(boxes.filter((b) => !b.disabled).length).toBeGreaterThan(2);
    done();
  });

  it("asks the rules on its first screen, and loads that edition's SRD", async () => {
    const { target, fetch, done } = await render();
    const r2014 = [...target.querySelectorAll(".pick")].find((l) => l.querySelector(".row-nm")?.textContent === "2014 rules")!.querySelector("input")!;
    r2014.checked = true;
    r2014.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
    for (let i = 0; i < 5; i++) await tick();
    expect(fetch.mock.calls.map((c) => c[0]).slice(-3)).toEqual([expect.stringMatching(/setup-2014\.json$/), expect.stringMatching(/items-2014\.json$/), expect.stringMatching(/spells-2014\.json$/)]);
    expect(target.querySelector(".ed-who")?.textContent).toContain("2014 rules (SRD 5.1)");
    done();
  });
});
