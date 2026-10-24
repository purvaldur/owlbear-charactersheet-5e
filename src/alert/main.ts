import { mount } from "svelte";
import OBR from "@owlbear-rodeo/sdk";
import Alerts from "./Alerts.svelte";
import { app } from "../lib/app.svelte";
import { obrRoom } from "../lib/obr/obr";
import { MockRoom } from "../lib/obr/mock";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";

// The alert popover only reads sheets (to answer saves) and never saves them, so it can't overwrite the Codex's changes.
async function start(inOwlbear: boolean) {
  const target = document.getElementById("app")!;
  try {
    await app.init(inOwlbear ? obrRoom() : new MockRoom(), { persist: false, backlog: false });
    mount(Alerts, { target });
  } catch (e) {
    console.error("[Heroic Codex] Alert popover could not start:", e);
  }
}

if (OBR.isAvailable) OBR.onReady(() => start(true));
else void start(false);
