// Dev harness for the alert popover: the real Alerts stack on a mock room, fed a save asked of Sam's sheet and an
// ordinary roll. #light switches theme; #player-gm-only shows only the ordinary roll.
import { mount } from "svelte";
import Alerts from "../src/alert/Alerts.svelte";
import { app } from "../src/lib/app.svelte";
import { LIGHT_THEME, MockRoom } from "../src/lib/obr/mock";
import { SheetStore } from "../src/lib/store/sheets.svelte";
import { CURRENT_SCHEMA } from "../src/lib/model/schema";
import { playerSheets, sampleMaren, sampleDrake, memoryStorage } from "../src/dev/fixtures";
import { entryFrom, intentForItem } from "../src/lib/dice/roll";
import "../src/styles/tokens.css";
import "../src/styles/base.css";
import "../src/styles/components.css";
import "./room.css";


const room = new MockRoom({}, location.hash.includes("light") ? LIGHT_THEME : undefined);
app.store = new SheetStore(memoryStorage());

async function boot() {
  await app.init(room, { page: "alert" });
  const sheets = playerSheets();
  app.store.library = { schemaVersion: CURRENT_SCHEMA, sheets, activeId: sheets[0]!.id };
  mount(Alerts, { target: document.getElementById("app")! });
  const m = sampleMaren();
  const bolt = m.spells.find((s) => s.name === "Guiding Bolt")!;
  app.post(entryFrom(intentForItem(m, bolt, "spell", "normal"), { d20: [14], parts: [[5, 2, 6, 3]] }, { sheet: m, player: "Robin", playerId: "robin", vis: "public" }), false);
  const d = sampleDrake();
  const breath = d.actions.find((a) => a.name === "Fire Breath")!;
  app.post(entryFrom(intentForItem(d, breath, "action", "normal"), { parts: [[4, 6, 1, 3, 5, 2]] }, { sheet: d, player: "GM", playerId: "gm", vis: "public" }), false);
}

(globalThis as unknown as { __app: typeof app }).__app = app;
void boot();
