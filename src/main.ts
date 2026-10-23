import { mount } from "svelte";
import OBR from "@owlbear-rodeo/sdk";
import App from "./App.svelte";
import { app } from "./lib/app.svelte";
import { obrRoom } from "./lib/obr/obr";
import { MockRoom } from "./lib/obr/mock";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";

async function start(inOwlbear: boolean) {
  const target = document.getElementById("app")!;
  try {
    await app.init(inOwlbear ? obrRoom() : new MockRoom());
    mount(App, { target, props: { embedded: true } });
  } catch (e) {
    // The popover is see-through, so a silent failure would look like nothing at all.
    console.error("[Heroic Codex] Could not start:", e);
    target.innerHTML = `<p class="boot-error">The Codex could not start. Close and reopen it, or reload the room.</p>`;
  }
}

// Inside Owlbear Rodeo the SDK talks to the room; opened directly there is no room, so a mock stands in.
if (OBR.isAvailable) OBR.onReady(() => start(true));
else void start(false);
