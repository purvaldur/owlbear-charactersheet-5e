// Application state and the things a user does at the table. Components read from `app` and call its methods.
import { ABILITY, SPELL_LEVELS, newAction, newFeature, newSpell } from "./model/defaults";
import type { AbilityKey, Action, Feature, Sheet, Spell } from "./model/types";
import { applyDamage, applyHeal, deathSave, rest as restRules, saveMod } from "./rules";
import { builtinDice, type DiceSource } from "./dice/source";
import { dicePlusReady, dicePlusSource } from "./dice/dicePlus";
import * as channel from "./log/channel";
import {
  entryFrom, intentForCheck, intentForDeathSave, intentForDice, intentForItem, intentForSave, intentForSkill,
  needsCritDice, summary, type Roller,
} from "./dice/roll";
import { d20Result } from "./dice/roller";
import type { DiceOutcome, RollEntry, RollIntent } from "./dice/types";
import type { Room, RoomPlayer } from "./obr/adapter";
import { applyTheme } from "./obr/theme";
import { RollLog } from "./log/log.svelte";
import { SheetStore } from "./store/sheets.svelte";
import { UiState } from "./ui/ui.svelte";

const BASE_WIDTH = 500;
const WIDE_WIDTH = 780;
const SIDEBAR_WIDTH = 340;
const ordShort = (l: number) => (l === 0 ? "Cantrip" : SPELL_LEVELS[l]!.replace(" level", "-level"));

export class App {
  room!: Room;
  player = $state<RoomPlayer>({ id: "", name: "", role: "PLAYER" });
  store: SheetStore;
  ui = new UiState();
  log = new RollLog();
  dice: DiceSource = builtinDice();
  private builtin = builtinDice();
  ready = $state(false);
  /** Room viewport width; under 900px the sidebar overlays the sheet instead of widening the popover. */
  viewport = $state(1280);
  private cleanups: (() => void)[] = [];

  constructor(store = new SheetStore()) {
    this.store = store;
  }

  get sheet(): Sheet | null {
    return this.store.active;
  }
  get isGM() {
    return this.player.role === "GM";
  }

  async init(room: Room) {
    this.room = room;
    this.store.load();
    this.cleanups.push(this.store.watch());
    const [player, theme] = await Promise.all([room.player(), room.theme()]);
    this.player = player;
    this.viewport = await room.viewportWidth();
    applyTheme(theme);
    this.cleanups.push(
      room.onPlayerChange((p) => (this.player = p)),
      room.onThemeChange(applyTheme),
      channel.listen(room, { roll: (e) => this.receive(e), reply: (id, r) => this.log.reply(id, r) }),
      room.onOpenChange((open) => {
        if (open) void this.detectDice();
      }),
    );
    this.ready = true;
    void this.detectDice();
  }

  /** Uses Dice+ when the room has it; checked at start and whenever the popover opens. */
  async detectDice() {
    const ready = await dicePlusReady(this.room);
    this.dice = ready ? dicePlusSource(this.room, () => this.player) : this.builtin;
  }

  /** A roll card from another player. Never opens the sidebar; a save asked of the active sheet gets a toast. */
  receive(entry: RollEntry) {
    const visible = entry.vis !== "gm" || this.isGM || entry.playerId === this.player.id;
    if (!visible) return;
    this.log.add(entry, this.ui.sidebar);
    const sheet = this.sheet;
    if (!this.ui.sidebar && entry.save && sheet && sheet.id !== entry.sheetId) {
      this.ui.showToast({
        msg: `${entry.who}: ${ABILITY[entry.save.target].long} save, DC ${entry.save.dc}`,
        action: { label: "Show", run: () => this.openSidebar() },
      });
    }
  }

  destroy() {
    this.cleanups.forEach((c) => c());
    this.cleanups = [];
  }

  get overlaySidebar() {
    return this.viewport < 900;
  }
  /** Popover width: 500, or 780 wide, plus the sidebar when it sits beside the sheet. */
  get popoverWidth() {
    return (this.ui.wide ? WIDE_WIDTH : BASE_WIDTH) + (this.ui.sidebar && !this.overlaySidebar ? SIDEBAR_WIDTH : 0);
  }

  // ---------- Rolling ----------
  /** Rolls with Dice+ when available; any Dice+ failure falls back to built-in dice without bothering the user. */
  private async roll(intent: RollIntent, opts: { vis: RollEntry["vis"]; critOnly?: boolean }): Promise<DiceOutcome> {
    if (this.dice.name === "dice+") {
      try {
        return await this.dice.roll(intent, opts);
      } catch (e) {
        console.warn("[Heroic Codex] Dice+ roll failed, using built-in dice:", (e as Error).message);
        this.dice = this.builtin;
      }
    }
    return this.builtin.roll(intent, opts);
  }

  private async rollIntent(intent: RollIntent, sheet: Roller["sheet"], extra: Partial<RollEntry> = {}, opts: { resetMode?: boolean } = {}) {
    const by = { sheet, player: this.player.name || (this.isGM ? "GM" : "Player"), playerId: this.player.id, vis: this.ui.vis };
    if (opts.resetMode !== false) this.ui.mode = "normal";
    const id = crypto.randomUUID();
    // While Dice+ tumbles its 3D dice, the card shows a pending state.
    const placeholder = this.dice.name === "dice+";
    if (placeholder) {
      this.log.pending[id] = true;
      this.log.add({ ...entryFrom(intent, { d20: intent.d20 ? [1] : undefined, parts: intent.parts.map(() => []) }, by, id), ...extra }, this.ui.sidebar);
    }
    let outcome = await this.roll(intent, { vis: by.vis });
    if (needsCritDice(intent, outcome)) {
      const crit = await this.roll(intent, { vis: by.vis, critOnly: true });
      outcome = { ...outcome, parts: outcome.parts.map((dice, i) => [...dice, ...(crit.parts[i] ?? [])]) };
    }
    const final: RollEntry = { ...entryFrom(intent, outcome, by, id), ...extra };
    if (placeholder) {
      const existing = this.log.entries.find((e) => e.id === id);
      if (existing) Object.assign(existing, final, { replies: existing.replies });
      delete this.log.pending[id];
    } else this.log.add(final, this.ui.sidebar);
    void channel.shareRoll(this.room, final);
    this.announce(final);
    return final;
  }

  /** Your own result surfaces as a toast while the sidebar is closed. */
  private announce(entry: RollEntry) {
    if (this.ui.sidebar || !(entry.d20 || entry.dmg?.length)) return;
    this.ui.showToast({ msg: summary(entry), action: { label: "Show", run: () => this.openSidebar() } });
  }

  /** Adds a card made elsewhere (dev harness, tests) as if it arrived from the table. */
  post(entry: RollEntry, mine: boolean) {
    if (mine) {
      this.log.add(entry, this.ui.sidebar);
      void channel.shareRoll(this.room, entry);
      this.announce(entry);
    } else this.receive(entry);
  }

  rollItem(sheet: Sheet, it: Action | Spell, kind: "action" | "spell", e?: MouseEvent | KeyboardEvent) {
    const intent = intentForItem(sheet, it, kind, this.ui.modeFrom(e));
    const extra: Partial<RollEntry> = {};
    if (kind === "spell" && (it as Spell).level > 0) {
      const level = (it as Spell).level;
      const slot = sheet.slots[level];
      if (slot && slot.used < slot.max) {
        slot.used++;
        extra.spent = { level, left: slot.max - slot.used };
      } else extra.note = `No ${ordShort(level)} slot left. Nothing was spent.`;
    }
    const uses = (it as Action).uses;
    if (kind === "action" && uses) {
      if (uses.used < uses.max) {
        uses.used++;
        extra.used = { itemId: it.id, left: uses.max - uses.used };
      } else extra.note = "No uses left. Rolled anyway.";
    }
    return this.rollIntent(intent, sheet, extra);
  }

  rollCheck = (sheet: Sheet, ab: AbilityKey, e?: MouseEvent) => this.rollIntent(intentForCheck(sheet, ab, this.ui.modeFrom(e)), sheet);
  rollSave = (sheet: Sheet, ab: AbilityKey, e?: MouseEvent) => this.rollIntent(intentForSave(sheet, ab, this.ui.modeFrom(e)), sheet);
  rollSkill = (sheet: Sheet, key: string, e?: MouseEvent) => this.rollIntent(intentForSkill(sheet, key, this.ui.modeFrom(e)), sheet);
  rollDice = (sheet: Roller["sheet"], n: number, d: number, flat = 0) => this.rollIntent(intentForDice(n, d, flat), sheet, {}, { resetMode: false });

  async rollDeathSave(sheet: Sheet) {
    const outcome = await this.roll(intentForDeathSave(), { vis: this.ui.vis });
    const nat = outcome.d20?.[0] ?? 1;
    const res = deathSave(sheet.death, nat);
    sheet.death = res.death;
    if (res.revived) sheet.hp.cur = 1;
    const by = { sheet, player: this.player.name, playerId: this.player.id, vis: this.ui.vis };
    const entry = { ...entryFrom(intentForDeathSave(), outcome, by), result: { pass: res.pass, text: res.text } };
    this.post(entry, true);
  }

  /** A target answers a save from the roll card; the result shows under the card as pass or fail. */
  async replySave(entry: RollEntry, sheet: Sheet, e?: MouseEvent) {
    if (!entry.save) return;
    const mode = this.ui.modeFrom(e);
    const intent = intentForSave(sheet, entry.save.target, mode);
    const outcome = await this.roll(intent, { vis: this.ui.vis });
    const d20 = d20Result(outcome.d20 ?? [1], mode, saveMod(sheet, entry.save.target), "save");
    this.ui.mode = "normal";
    const reply = { sheetId: sheet.id, who: sheet.name, color: sheet.color, d20, pass: d20.nat === 20 || (d20.nat !== 1 && d20.total >= entry.save.dc) };
    this.log.reply(entry.id, reply);
    void channel.shareReply(this.room, entry.id, reply);
  }

  shareFeature(sheet: Sheet, f: Feature) {
    const by = { sheet, player: this.player.name, playerId: this.player.id, vis: this.ui.vis };
    const entry = { ...entryFrom({ title: f.name, parts: [], desc: f.desc }, { parts: [] }, by), showDesc: true };
    this.log.add(entry, this.ui.sidebar);
    void channel.shareRoll(this.room, entry);
  }

  undoSpend(entry: RollEntry) {
    const sheet = this.store.library.sheets.find((s) => s.id === entry.sheetId);
    if (!sheet) return;
    if (entry.spent) {
      const slot = sheet.slots[entry.spent.level];
      if (slot) slot.used = Math.max(0, slot.used - 1);
      entry.spent = undefined;
      entry.note = "Slot returned";
    }
    if (entry.used) {
      const it = [...sheet.actions, ...sheet.features].find((x) => x.id === entry.used!.itemId);
      if (it?.uses) it.uses.used = Math.max(0, it.uses.used - 1);
      entry.used = undefined;
      entry.note = "Use returned";
    }
  }

  // ---------- Building a sheet ----------
  private listFor(sheet: Sheet, kind: "action" | "spell" | "feature") {
    return (kind === "spell" ? sheet.spells : kind === "feature" ? sheet.features : sheet.actions) as (Action | Spell | Feature)[];
  }

  addItem(sheet: Sheet, kind: "action" | "spell" | "feature", level = 1) {
    const it = kind === "spell" ? newSpell({ level }) : kind === "feature" ? newFeature() : newAction();
    this.listFor(sheet, kind).push(it);
    this.ui.editing = { kind, id: it.id };
    this.ui.focusEditor = true;
  }

  deleteItem(sheet: Sheet, kind: "action" | "spell" | "feature", id: string) {
    const list = this.listFor(sheet, kind);
    const index = list.findIndex((x) => x.id === id);
    if (index < 0) return;
    const [gone] = list.splice(index, 1);
    this.ui.editing = null;
    this.ui.showToast({ msg: `Deleted ${gone!.name}`, undo: () => list.splice(index, 0, gone!) });
  }

  /** Takes the sheet back to no spellcasting, spells and slots included; Undo restores all three. */
  removeSpellcasting(sheet: Sheet) {
    const { spellcasting, slots, spells } = sheet;
    sheet.spellcasting = null;
    sheet.slots = {};
    sheet.spells = [];
    this.ui.editing = null;
    const n = spells.length;
    this.ui.showToast({
      msg: n ? `Removed spellcasting and ${n} spell${n > 1 ? "s" : ""}` : "Removed spellcasting",
      undo: () => Object.assign(sheet, { spellcasting, slots, spells }),
    });
  }

  // ---------- Hit points and rests ----------
  changeHp(sheet: Sheet, op: "dmg" | "heal", n: number) {
    const before = { ...sheet.hp };
    const beforeDeath = { ...sheet.death };
    if (op === "dmg") sheet.hp = applyDamage(sheet.hp, n);
    else {
      if (sheet.hp.cur === 0) sheet.death = { s: 0, f: 0 };
      sheet.hp = applyHeal(sheet.hp, n);
    }
    this.ui.showToast({
      msg: op === "dmg" ? `${sheet.name} took ${n} damage` : `${sheet.name} healed ${n}`,
      undo: () => {
        sheet.hp = before;
        sheet.death = beforeDeath;
      },
    });
  }

  rest(sheet: Sheet, kind: "SR" | "LR") {
    const snapshot = $state.snapshot(sheet);
    restRules(sheet, kind);
    this.ui.showToast({
      msg: kind === "LR" ? "Long rest: HP, spell slots and uses restored" : "Short rest: short-rest uses restored",
      undo: () => Object.assign(sheet, snapshot),
    });
  }

  // ---------- Sidebar ----------
  openSidebar() {
    if (!this.ui.sidebar) this.ui.sidebarAnim = true;
    this.ui.sidebar = true;
    this.ui.toast = null;
    this.log.seen();
  }
  toggleSidebar() {
    if (this.ui.sidebar) this.ui.sidebar = false;
    else this.openSidebar();
  }

  saveLabel(entry: RollEntry, sheet: Sheet) {
    const t = entry.save!.target;
    return this.isGM ? `Roll ${ABILITY[t].short} save for ${sheet.name}` : `Roll your ${ABILITY[t].long} save`;
  }
}

export const app = new App();
