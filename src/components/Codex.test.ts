import { describe, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import Codex from "./Codex.svelte";
import { app } from "../lib/app.svelte";
import { CURRENT_SCHEMA } from "../lib/model/schema";

function render() {
  // In the page, so clicks reach the window's handler that closes menus.
  const target = document.body.appendChild(document.createElement("div"));
  const view = mount(Codex, { target });
  // A real click lets the page update between listeners, before it bubbles up to the window; a scripted one doesn't.
  const update = () => flushSync();
  document.body.addEventListener("click", update);
  flushSync();
  const button = (text: string) => [...target.querySelectorAll<HTMLButtonElement>("button")].find((b) => b.textContent?.includes(text))!;
  return {
    target,
    button,
    done: () => {
      unmount(view);
      target.remove();
      document.body.removeEventListener("click", update);
    },
  };
}

describe("a new sheet", () => {
  it("asks for a creature's rules, then how to make it, in the switcher, which stays open while it asks", () => {
    app.store.library = { schemaVersion: CURRENT_SCHEMA, sheets: [], activeId: null };
    app.store.create("character", "2014");
    const { target, button, done } = render();
    app.ui.menu = "switcher";
    flushSync();
    button("New creature").click();
    flushSync();
    expect(app.ui.menu).toBe("switcher");
    expect(target.querySelector(".menu-h")?.textContent).toBe("New creature: which rules?");
    button("2024 rules").click();
    flushSync();
    expect(target.querySelector(".menu-h")?.textContent).toBe("New creature: how?");
    button("From scratch").click();
    flushSync();
    expect(app.sheet).toMatchObject({ kind: "creature", rules: "2024" });
    expect(app.store.library.sheets).toHaveLength(2);
    expect(app.ui.menu).toBeNull();
    app.ui.edit = false;
    done();
  });

  it("opens the SRD creature list for a creature from the SRD, with the rules picked", () => {
    app.store.library = { schemaVersion: CURRENT_SCHEMA, sheets: [], activeId: null };
    app.store.create("character", "2014");
    const { button, done } = render();
    app.ui.menu = "switcher";
    flushSync();
    button("New creature").click();
    flushSync();
    button("2014 rules").click();
    flushSync();
    button("From the SRD").click();
    flushSync();
    expect(app.ui.dialog).toEqual({ view: "monsters", rules: "2014" });
    expect(app.ui.menu).toBeNull();
    expect(app.store.library.sheets).toHaveLength(1);
    app.ui.dialog = null;
    done();
  });

  it("offers a character the guided setup, which opens in the dialog with the rules picked", () => {
    app.store.library = { schemaVersion: CURRENT_SCHEMA, sheets: [], activeId: null };
    app.store.create("creature", "2014");
    const { target, button, done } = render();
    app.ui.menu = "switcher";
    flushSync();
    button("New character").click();
    flushSync();
    button("2024 rules").click();
    flushSync();
    expect(target.querySelector(".menu-h")?.textContent).toBe("New character: how?");
    button("Guided setup").click();
    flushSync();
    expect(app.ui.dialog).toEqual({ view: "setup", rules: "2024" });
    expect(app.store.library.sheets).toHaveLength(1);
    app.ui.dialog = null;
    done();
  });

  it("asks for its rules in the empty state", () => {
    app.store.library = { schemaVersion: CURRENT_SCHEMA, sheets: [], activeId: null };
    const { button, done } = render();
    button(app.isGM ? "New creature" : "New character").click();
    flushSync();
    button("2014 rules").click();
    flushSync();
    button("From scratch").click();
    flushSync();
    expect(app.sheet).toMatchObject({ kind: app.isGM ? "creature" : "character", rules: "2014" });
    app.ui.edit = false;
    done();
  });
});
