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
  await app.init(inOwlbear ? obrRoom() : new MockRoom());
  mount(App, { target: document.getElementById("app")!, props: { embedded: true } });
}

// Inside Owlbear Rodeo the SDK talks to the room; opened directly there is no room, so a mock stands in.
if (OBR.isAvailable) OBR.onReady(() => start(true));
else void start(false);
