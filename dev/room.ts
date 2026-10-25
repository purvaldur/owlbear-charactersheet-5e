// Dev harness: mounts the real Codex inside a simulated room (mock OBR, in-memory sheets seeded with fixtures).
// Bare #tokens joined by "-" open presets for screenshots, e.g. #gm-wide-sidebar.
import { mount, flushSync } from "svelte";
import Codex from "../src/components/Codex.svelte";
import { app } from "../src/lib/app.svelte";
import { DARK_THEME, LIGHT_THEME, MockRoom } from "../src/lib/obr/mock";
import { SheetStore } from "../src/lib/store/sheets.svelte";
import { CURRENT_SCHEMA } from "../src/lib/model/schema";
import { gmSheets, playerSheets, sampleMaren, sampleDrake, memoryStorage } from "../src/dev/fixtures";
import { entryFrom, intentForItem } from "../src/lib/dice/roll";
import { damage as dmg, newAction as act, newSpell as spl } from "../src/lib/model/defaults";
import { linkFor } from "../src/lib/tokens/link";
import { browserPages } from "../src/lib/obr/pages";
import { EDITOR_POPOVER } from "../src/lib/editor/protocol";
import "../src/styles/tokens.css";
import "../src/styles/base.css";
import "../src/styles/components.css";
import "./room.css";

const libraryFor = (role: "PLAYER" | "GM") => {
  const sheets = role === "GM" ? gmSheets() : playerSheets();
  return { schemaVersion: CURRENT_SCHEMA, sheets, activeId: sheets[0]!.id };
};

const room = new MockRoom();
// The editor popover runs in an iframe of its own, as in Owlbear, and reaches the Codex over the real page bus.
room.pages = browserPages();
app.store = new SheetStore(memoryStorage());
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

/** Shows the editor popover as Owlbear would: the real editor page, in the middle of the room. */
function showPopovers(open: MockRoom["popovers"]) {
  const p = open[EDITOR_POPOVER];
  const frame = document.getElementById("editor-frame");
  if (!p) return frame?.remove();
  if (frame) return;
  const el = document.createElement("iframe");
  el.id = "editor-frame";
  el.className = "dialog-frame";
  el.src = `${p.url}?theme=${document.documentElement.dataset.mode ?? "dark"}`;
  el.style.width = `${p.width}px`;
  el.style.height = `${p.height}px`;
  $("room").append(el);
}

function incoming(kind: string) {
  if (kind === "breath") {
    const d = sampleDrake();
    const breath = d.actions.find((a) => a.name === "Fire Breath")!;
    const intent = intentForItem(d, breath, "action", "normal");
    const en = entryFrom(intent, { parts: [[4, 6, 1, 3, 5, 2]] }, { sheet: d, player: "GM", playerId: "gm", vis: "public" });
    app.post(en, false);
  } else if (kind === "bolt") {
    const m = sampleMaren();
    const bolt = m.spells.find((s) => s.name === "Guiding Bolt")!;
    const intent = intentForItem(m, bolt, "spell", "normal");
    app.post(entryFrom(intent, { d20: [14], parts: [[5, 2, 6, 3]] }, { sheet: m, player: "Robin", playerId: "robin", vis: "public" }), false);
  }
}

async function boot() {
  room.onPopovers(showPopovers);
  await app.init(room);
  app.store.library = libraryFor("PLAYER");
  incoming("bolt");
  incoming("breath");
  mount(Codex, { target: $("app"), props: { embedded: false } });

  $<HTMLSelectElement>("p-role").onchange = (e) => {
    const role = (e.currentTarget as HTMLSelectElement).value as "PLAYER" | "GM";
    room.setPlayer(role === "GM" ? { id: "gm", name: "GM", role } : { id: "player-sam", name: "Sam", role });
    app.store.library = libraryFor(role);
    app.ui.edit = false;
    app.ui.dialog = null;
  };
  $<HTMLSelectElement>("p-theme").onchange = (e) => room.setTheme((e.currentTarget as HTMLSelectElement).value === "light" ? LIGHT_THEME : DARK_THEME);
  $<HTMLSelectElement>("p-incoming").onchange = (e) => {
    const el = e.currentTarget as HTMLSelectElement;
    if (el.value) incoming(el.value);
    el.value = "";
  };
  $<HTMLSelectElement>("p-state").onchange = (e) => {
    const el = e.currentTarget as HTMLSelectElement;
    if (el.value === "firstrun") app.store.library = { schemaVersion: CURRENT_SCHEMA, sheets: [], activeId: null };
    if (el.value === "down" && app.sheet) {
      app.sheet.hp.cur = 0;
      app.sheet.hp.temp = 0;
      app.sheet.death = { s: 1, f: 1 };
    }
    if (el.value === "reset") location.reload();
    el.value = "";
  };
  $<HTMLButtonElement>("p-toggle").onclick = (e) => {
    const open = $("p-ctl").classList.toggle("open");
    (e.currentTarget as HTMLElement).setAttribute("aria-expanded", String(open));
  };

  const presets: Record<string, () => void> = {
    gm: () => {
      room.setPlayer({ id: "gm", name: "GM", role: "GM" });
      app.store.library = libraryFor("GM");
    },
    light: () => room.setTheme(LIGHT_THEME),
    wide: () => (app.ui.wide = true),
    sidebar: () => app.openSidebar(),
    edit: () => (app.ui.edit = true),
    editor: () => {
      app.ui.edit = true;
      app.ui.dialog = { view: "edit", kind: "action", id: app.sheet!.actions[0]!.id };
    },
    spells: () => (app.ui.tab = "spells"),
    inventory: () => (app.ui.tab = "inventory"),
    background: () => (app.ui.tab = "background"),
    notes: () => (app.ui.tab = "notes"),
    picker: () => {
      app.ui.edit = true;
      app.ui.tab = "spells";
      app.ui.dialog = { view: "srd", list: "spells" };
    },
    itempicker: () => {
      app.ui.tab = "inventory";
      app.ui.dialog = { view: "srd", list: "items", cat: "backpack" };
    },
    monsters: () => (app.ui.dialog = { view: "monsters", rules: "2024" }),
    setup: () => (app.ui.dialog = { view: "setup" }),
    firstrun: () => (app.store.library = { schemaVersion: CURRENT_SCHEMA, sheets: [], activeId: null }),
    hp0: () => {
      const s = app.sheet!;
      s.hp.cur = 0;
      s.hp.temp = 0;
      s.death = { s: 1, f: 1 };
    },
    hppanel: () => (app.ui.menu = "hp"),
    more: () => (app.ui.menu = "more"),
    switcher: () => (app.ui.menu = "switcher"),
    storage: () => (app.store.storageBlocked = true),
    // A token linked to the active sheet and one that isn't, the loose one selected (for "Link to selected token").
    tokens: () => {
      room.addToken("Ilse", linkFor(app.sheet!, app.player.id, app.player.role));
      room.select([room.addToken("Goblin")]);
    },
    bars: () => {
      room.setPlayer({ id: "gm", name: "GM", role: "GM" });
      app.store.library = libraryFor("GM");
      app.ui.menu = "bars";
    },
    // Edge cases: overlong names, a long action list, spells up to 9th level, long descriptions.
    stress: () => {
      const sh = app.sheet!;
      sh.name = "Bartholomew Fizzlewick-Thornbury the Unexpectedly Persistent";
      sh.subtitle = "Rock Gnome Wizard 17 / Rogue 3 (Arcane Trickster), Sage of the Lantern Street Guild";
      for (let i = 0; i < 30; i++) sh.actions.push(act({ name: `Extremely long-named improvised weapon attack number ${i + 1}`, range: "Melee or thrown 20/60 ft · finesse, light, versatile (1d10)", hit: { ab: "dex", prof: true, flat: 2 }, dmg: [dmg(2, 6, "dex", 1, "slashing"), dmg(1, 4, "", 0, "necrotic")] }));
      sh.spellcasting = sh.spellcasting ?? { ab: "int", atk: 0, dc: 0, shortRest: false };
      for (let l = 1; l <= 9; l++) {
        sh.slots[l] = { max: l < 4 ? 4 : l < 6 ? 3 : 1, used: 0 };
        sh.spells.push(spl({ name: `A spell of level ${l} with a really quite long name`, level: l, range: "Self (60-foot cone)", conc: l % 2 === 0, ritual: l === 3, save: { target: "wis" }, dmg: [dmg(l + 2, 8, "", 0, "psychic")] }));
      }
      sh.features[0]!.desc = "Long description. ".repeat(60);
    },
  };
  for (const k of location.hash.slice(1).split("-").filter(Boolean)) presets[k]?.();
  flushSync();
}

(globalThis as unknown as { __app: typeof app; __room: MockRoom }).__app = app;
(globalThis as unknown as { __room: MockRoom }).__room = room;
void boot();
