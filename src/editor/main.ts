import { mount } from "svelte";
import OBR from "@owlbear-rodeo/sdk";
import EditorPage from "./EditorPage.svelte";
import { obrRoom } from "../lib/obr/obr";
import { DARK_THEME, LIGHT_THEME, MockRoom } from "../lib/obr/mock";
import { browserPages } from "../lib/obr/pages";
import { applyTheme } from "../lib/obr/theme";
import { orDefault } from "../lib/obr/safe";
import type { Room } from "../lib/obr/adapter";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";

// The editor popover never touches storage: the Codex sends it the sheet and saves what comes back.
async function start(room: Room) {
  const target = document.getElementById("app")!;
  try {
    applyTheme(await orDefault(room.theme(), DARK_THEME, "theme"));
    room.onThemeChange(applyTheme);
    mount(EditorPage, { target, props: { room } });
  } catch (e) {
    console.error("[Heroic Codex] Editor popover could not start:", e);
  }
}

if (OBR.isAvailable) OBR.onReady(() => start(obrRoom()));
else {
  // In the dev harness's iframe: a mock room in the harness's theme, on the same page bus as the harness.
  const room = new MockRoom({}, new URLSearchParams(location.search).get("theme") === "light" ? LIGHT_THEME : DARK_THEME);
  room.pages = browserPages();
  room.viewportHeight = async () => window.parent.innerHeight;
  room.setPopoverHeight = async (_id, height) => {
    // The frame element belongs to the harness's window, so `instanceof HTMLElement` from here would be false.
    const frame = window.frameElement as HTMLElement | null;
    if (frame) frame.style.height = `${height}px`;
  };
  void start(room);
}
