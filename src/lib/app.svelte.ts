// Application state and the things a user does at the table. Components read from `app` and call its methods.
import { ABILITY, ATTUNEMENT_SLOTS, newAction, newFeature, newItem, newSpell, uid } from "./model/defaults";
import type { AbilityKey, Action, Item, Rules, Sheet, SheetKind, Spell } from "./model/types";
import type { SrdList } from "./model/srd";
import { applyDamage, applyHeal, deathSave, itemsIn, rest as restRules } from "./rules";
import { builtinDice, type DiceSource } from "./dice/source";
import { dicePlusReady, dicePlusSource } from "./dice/dicePlus";
import * as channel from "./log/channel";
import {
  entryFrom, hasDice, intentForCheck, intentForDeathSave, intentForDice, intentForItem, intentForSave, intentForSkill,
  needsCritDice, summary, type Roller,
} from "./dice/roll";
import { d20Result } from "./dice/roller";
import type { DiceOutcome, RollEntry, RollIntent } from "./dice/types";
import type { Room, RoomPlayer } from "./obr/adapter";
import { applyTheme } from "./obr/theme";
import { orDefault } from "./obr/safe";
import { DARK_THEME } from "./obr/mock";
import { RollLog } from "./log/log.svelte";
import { SheetStore } from "./store/sheets.svelte";
import { BARS_KEY, DEFAULT_BARS, linkFor, parseBars, staleLinks, type BarSettings, type Token, type TokenLink } from "./tokens/link";
import { UiState } from "./ui/ui.svelte";
import { levelLabel } from "./ui/text";
import {
  EDITOR, EDITOR_POPOVER, EDITOR_URL, EDITOR_WIDTH, dialogHeight, entries, parseEntry, sameDialog,
  type AddSrdMessage, type ChangeMessage, type DoneMessage, type EditKind, type EntryMessage, type OpenMessage,
} from "./editor/protocol";

const BASE_WIDTH = 500;
const WIDE_WIDTH = 780;
const SIDEBAR_WIDTH = 340;
const LINK_SYNC_DELAY = 250;

export class App {
  room!: Room;
  player = $state<RoomPlayer>({ id: "", name: "", role: "PLAYER" });
  store: SheetStore;
  ui = new UiState();
  log = new RollLog();
  private builtin = builtinDice();
  dice: DiceSource = this.builtin;
  ready = $state(false);
  /** Room viewport width; under 900px the sidebar overlays the sheet instead of widening the popover. */
  viewport = $state(1280);
  /** Tokens in the open scene, with their links; empty when no scene is open. */
  tokens = $state<Token[]>([]);
  /** The GM's choice of what token HP bars show, shared with the room. */
  bars = $state<BarSettings>(DEFAULT_BARS);
  private cleanups: (() => void)[] = [];
  private lastSelection = "";
  private linkRefused = false;

  constructor(store = new SheetStore()) {
    this.store = store;
  }

  get sheet(): Sheet | null {
    return this.store.active;
  }
  get isGM() {
    return this.player.role === "GM";
  }

  /**
   * The Codex popover runs everything. The alert popover (`page: "alert"`) only reads sheets, to answer saves: it never
   * saves them, so two pages can't save over each other, and it leaves the backlog, token links, the map selection,
   * HP bar settings and the Codex popover's opening to the Codex.
   */
  async init(room: Room, { page = "codex" }: { page?: "codex" | "alert" } = {}) {
    const codex = page === "codex";
    this.room = room;
    this.store.load();
    if (codex) this.cleanups.push(this.store.watch(), this.syncLinks());
    // Owlbear can refuse any of these (the viewport, for one, before a scene is open); the sheet starts anyway on defaults.
    const [player, theme, viewport] = await Promise.all([
      orDefault(room.player(), this.player, "player"),
      orDefault(room.theme(), DARK_THEME, "theme"),
      orDefault(room.viewportWidth(), this.viewport, "viewport width"),
    ]);
    this.player = player;
    this.viewport = viewport;
    applyTheme(theme);
    this.cleanups.push(
      room.onPlayerChange((p) => (this.player = p)),
      room.onThemeChange(applyTheme),
      channel.listen(room, { roll: (e) => this.receive(e), reply: (id, r) => this.log.reply(id, r) }),
    );
    this.ready = true;
    void this.detectDice();
    if (codex) this.startCodex(room);
  }

  /** The Codex popover's part of starting: the backlog, token links and the map selection, HP bar settings, the editor. */
  private startCodex(room: Room) {
    let liveTokens = false;
    this.cleanups.push(
      this.syncEditor(room),
      room.listen(channel.CHANNELS.logChunk, (d) => this.log.merge(channel.entriesFrom(d).filter((e) => this.canSee(e)), this.ui.sidebar)),
      room.listen(channel.CHANNELS.selectSheet, (d) => this.showSheet((d as { sheetId?: string })?.sheetId)),
      room.onTokens((t) => {
        liveTokens = true;
        this.tokens = t;
      }),
      room.onSelection((ids) => this.followSelection(ids)),
      room.onRoomData((d) => (this.bars = parseBars(d))),
      room.onOpenChange((open) => {
        if (!open) {
          // Putting the Codex away puts its dialog away too.
          this.ui.dialog = null;
          return;
        }
        void this.detectDice();
        void orDefault(room.viewportWidth(), this.viewport, "viewport width").then((w) => (this.viewport = w));
      }),
    );
    void room.send(channel.CHANNELS.logRequest, {}, "LOCAL");
    void orDefault(room.roomData(), {}, "room data").then((d) => (this.bars = parseBars(d)));
    void orDefault(room.tokens(), [], "tokens").then(async (t) => {
      // A live update that arrived while this was in flight is newer; keep it.
      if (!liveTokens) this.tokens = t;
      this.followSelection(await orDefault(room.selection(), [], "selection"));
    });
  }

  private canSee(e: RollEntry) {
    return channel.canSee(e, this.player.role, this.player.id);
  }

  /** Uses Dice+ when the room has it; checked at start and whenever the popover opens. */
  async detectDice() {
    const ready = await dicePlusReady(this.room);
    this.dice = ready ? dicePlusSource(this.room, () => this.player) : this.builtin;
  }

  /** A roll card from another player. Never opens the sidebar; a save asked of the active sheet gets a toast. */
  receive(entry: RollEntry) {
    if (!this.canSee(entry)) return;
    // Our own rolls come back too (they are sent to everyone, our background page included); the log skips known ones.
    if (entry.playerId === this.player.id) return this.log.add(entry, true);
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
  /** Whether this roll goes to Dice+: only when it has dice, since Dice+ refuses an empty notation. */
  private usesDicePlus(intent: RollIntent) {
    return this.dice.name === "dice+" && hasDice(intent);
  }

  /** Rolls with Dice+ when available; any Dice+ failure falls back to built-in dice without bothering the user. */
  private async roll(intent: RollIntent, opts: { vis: RollEntry["vis"]; critOnly?: boolean }): Promise<DiceOutcome> {
    if (this.usesDicePlus(intent)) {
      try {
        return await this.dice.roll(intent, opts);
      } catch (e) {
        console.warn("[Heroic Codex] Dice+ roll failed, using built-in dice:", (e as Error).message);
        this.dice = this.builtin;
      }
    }
    return this.builtin.roll(intent, opts);
  }

  /** Who a card is from: this sheet, rolled by me with the current visibility. */
  private roller(sheet: Roller["sheet"]): Roller {
    return { sheet, player: this.player.name || (this.isGM ? "GM" : "Player"), playerId: this.player.id, role: this.player.role, vis: this.ui.vis };
  }

  private async rollIntent(intent: RollIntent, sheet: Roller["sheet"], extra: Partial<RollEntry> = {}, opts: { resetMode?: boolean } = {}) {
    const by = this.roller(sheet);
    if (opts.resetMode !== false) this.ui.mode = "normal";
    const id = crypto.randomUUID();
    // While Dice+ tumbles its 3D dice, the card shows a pending state.
    const placeholder = this.usesDicePlus(intent);
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
      } else extra.note = `No ${levelLabel(level)} slot left. Nothing was spent.`;
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
    const entry = { ...entryFrom(intentForDeathSave(), outcome, this.roller(sheet)), result: { pass: res.pass, text: res.text } };
    this.post(entry, true);
  }

  /**
   * A target answers a save from the roll card; the result shows under the card as pass or fail. A save passes when
   * the total meets the DC: unlike an attack, a natural 20 or 1 decides nothing on its own.
   */
  async replySave(entry: RollEntry, sheet: Sheet, e?: MouseEvent) {
    if (!entry.save) return;
    const mode = this.ui.modeFrom(e);
    const intent = intentForSave(sheet, entry.save.target, mode);
    const outcome = await this.roll(intent, { vis: this.ui.vis });
    const d20 = d20Result(outcome.d20 ?? [1], mode, intent.d20!.mod, "save");
    this.ui.mode = "normal";
    const reply = { sheetId: sheet.id, who: sheet.name, color: sheet.color, d20, pass: d20.total >= entry.save.dc };
    this.log.reply(entry.id, reply);
    void channel.shareReply(this.room, entry.id, reply);
  }

  /** Posts an action, spell, feature or item to the table log as a card that shows its description; nothing is rolled. */
  shareEntry(sheet: Sheet, { title, sub, desc }: { title: string; sub?: string; desc: string }) {
    const entry: RollEntry = { ...entryFrom({ title, parts: [], desc }, { parts: [] }, this.roller(sheet)), sub: sub || undefined, showDesc: true };
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
  /** A new action, spell, feature or inventory item (in category `cat`), opened in the editor. */
  addItem(sheet: Sheet, kind: EditKind, cat = "backpack") {
    const it = kind === "spell" ? newSpell() : kind === "feature" ? newFeature() : kind === "item" ? newItem({ cat }) : newAction();
    entries(sheet, kind).push(it);
    this.ui.dialog = { view: "edit", kind, id: it.id };
  }

  addCategory(sheet: Sheet) {
    sheet.inventory.categories.push({ id: uid("c"), name: "New category", collapsed: false });
  }

  /** Deletes an inventory category; its items move to the first one left. A sheet keeps at least one. Undo restores both. */
  removeCategory(sheet: Sheet, id: string) {
    const inv = sheet.inventory;
    const index = inv.categories.findIndex((c) => c.id === id);
    if (index < 0 || inv.categories.length < 2) return;
    const moved = itemsIn(inv, id);
    const [gone] = inv.categories.splice(index, 1);
    const home = inv.categories[0]!;
    for (const it of moved) it.cat = home.id;
    const n = moved.length;
    this.ui.showToast({
      msg: n ? `Deleted ${gone!.name}; ${n} item${n > 1 ? "s" : ""} moved to ${home.name}` : `Deleted ${gone!.name}`,
      undo: () => {
        inv.categories.splice(index, 0, gone!);
        for (const it of moved) it.cat = id;
      },
    });
  }

  /** Attunes to a magic item, or ends it; a character can be attuned to three at most. */
  toggleAttuned(sheet: Sheet, item: Item) {
    if (!item.attuned && sheet.inventory.items.filter((i) => i.attuned).length >= ATTUNEMENT_SLOTS) {
      this.ui.showToast({ msg: `Already attuned to ${ATTUNEMENT_SLOTS} items. End an attunement first.` });
      return;
    }
    item.attuned = !item.attuned;
  }

  deleteItem(sheet: Sheet, kind: EditKind, id: string) {
    const list = entries(sheet, kind);
    const index = list.findIndex((x) => x.id === id);
    if (index < 0) return;
    const [gone] = list.splice(index, 1);
    if (this.ui.editing?.id === id) this.ui.dialog = null;
    this.ui.showToast({ msg: `${kind === "item" ? "Removed" : "Deleted"} ${gone!.name}`, undo: () => list.splice(index, 0, gone!) });
  }

  // ---------- The dialog popover ----------
  /**
   * Keeps the popover in the middle of the room in step with `ui.dialog`: opens it, points it at another entry or the
   * SRD list, closes it. The popover sends each change here and this page saves it, so only one page ever writes the
   * sheets. When the sheet changes here (a use spent, Undo, a score that moves the to-hit), the popover gets it again;
   * its own changes don't echo.
   */
  private syncEditor(room: Room) {
    let open = false;
    let target: UiState["dialog"] = null;
    /** The sheet as the popover has it, and the last of its changes applied here. */
    let synced = "";
    let ack = 0;
    const send = (focus: boolean) => {
      const dialog = this.ui.dialog;
      if (!dialog || !this.sheet) return;
      synced = JSON.stringify(this.sheet);
      room.pages.send(EDITOR.open, { sheet: JSON.parse(synced), dialog: $state.snapshot(dialog), focus, ack } satisfies OpenMessage);
    };
    const close = () => {
      open = false;
      void orDefault(room.closePopover(EDITOR_POPOVER), undefined, "editor close");
    };
    const mine = (m: { sheetId?: string; kind?: string } | null) => !!m && m.sheetId === this.sheet?.id && m.kind === this.ui.editing?.kind;

    const stopSync = $effect.root(() => {
      $effect(() => {
        const dialog = this.ui.dialog;
        const sheet = this.sheet;
        if (!dialog || !sheet) {
          target = null;
          if (open) close();
          return;
        }
        const json = JSON.stringify(sheet);
        if (dialog === target && json === synced) return;
        const focus = dialog !== target;
        target = dialog;
        if (!open) {
          // A new popover page counts its changes from zero.
          open = true;
          ack = 0;
          void orDefault(room.openDialog(EDITOR_POPOVER, EDITOR_URL, EDITOR_WIDTH, dialogHeight(dialog)), undefined, "editor popover");
        }
        send(focus);
      });
    });
    const stops = [
      stopSync,
      // A freshly loaded popover asks what to show; one left over with nothing to show is closed.
      room.pages.listen(EDITOR.ready, () => (this.ui.dialog ? send(true) : close())),
      room.pages.listen(EDITOR.change, (d) => {
        const m = d as ChangeMessage;
        if (!mine(m) || m.item?.id !== this.ui.editing?.id) return;
        const item = parseEntry(m.kind, m.item);
        const list = entries(this.sheet!, m.kind);
        const i = list.findIndex((x) => x.id === item?.id);
        if (!item || i < 0) return;
        list[i] = item;
        ack = m.seq;
        synced = JSON.stringify(this.sheet);
      }),
      room.pages.listen(EDITOR.remove, (d) => {
        const m = d as EntryMessage;
        if (mine(m)) this.deleteItem(this.sheet!, m.kind, m.id);
      }),
      room.pages.listen(EDITOR.addSrd, (d) => {
        const m = d as AddSrdMessage;
        const dialog = this.ui.dialog;
        if (m?.sheetId !== this.sheet?.id || dialog?.view !== "srd" || dialog.list !== m.list || !Array.isArray(m.entries)) return;
        const kind = m.list === "spells" ? "spell" : "item";
        this.addSrd(this.sheet!, m.list, m.entries.map((e) => parseEntry(kind, e) as Spell | Item | null).filter((e) => !!e));
      }),
      room.pages.listen(EDITOR.done, (d) => {
        const m = d as DoneMessage;
        if (m?.sheetId === this.sheet?.id && sameDialog(m.dialog, this.ui.dialog)) this.ui.dialog = null;
      }),
    ];
    return () => stops.forEach((s) => s());
  }

  /**
   * Spells or items picked from the SRD list; the list closes once they are in. An item the inventory already has is
   * added again, as a row of its own: it may be the base for a homebrew version.
   */
  addSrd(sheet: Sheet, list: SrdList, picked: (Spell | Item)[]) {
    if (list === "spells") sheet.spells.push(...(picked as Spell[]));
    else sheet.inventory.items.push(...(picked as Item[]));
    if (this.ui.dialog?.view === "srd") this.ui.dialog = null;
    const n = picked.length;
    const noun = list === "spells" ? "spell" : "item";
    if (n) this.ui.showToast({ msg: `Added ${n} ${noun}${n > 1 ? "s" : ""} from the SRD list` });
  }

  /** Takes the sheet back to no spellcasting, spells and slots included; Undo restores all three. */
  removeSpellcasting(sheet: Sheet) {
    const { spellcasting, slots, spells } = sheet;
    sheet.spellcasting = null;
    sheet.slots = {};
    sheet.spells = [];
    this.ui.dialog = null;
    const n = spells.length;
    this.ui.showToast({
      msg: n ? `Removed spellcasting and ${n} spell${n > 1 ? "s" : ""}` : "Removed spellcasting",
      undo: () => Object.assign(sheet, { spellcasting, slots, spells }),
    });
  }

  // ---------- Sheets ----------
  /** A new sheet from the switcher or the empty state, following the rules picked for it, opened in Edit on Main. */
  newSheet(kind: SheetKind, rules: Rules) {
    this.store.create(kind, rules);
    this.ui.menu = null;
    this.ui.newKind = null;
    this.ui.edit = true;
    this.ui.tab = "main";
  }

  /** Deletes a sheet and unlinks its tokens, so they stop showing its HP; Undo brings back both. */
  deleteSheet(sheet: Sheet) {
    const removed = this.store.remove(sheet.id);
    if (!removed) return;
    const linked = this.linkedTokens(sheet).map((t) => ({ id: t.id, link: t.link! }));
    if (linked.length) void this.writeLinks(linked.map((t) => t.id), null);
    this.ui.edit = false;
    this.ui.dialog = null;
    this.ui.showToast({
      msg: `Deleted ${removed.sheet.name}`,
      undo: () => {
        this.store.restore(removed.sheet, removed.index);
        for (const t of linked) void this.writeLinks([t.id], t.link);
      },
    });
  }

  // ---------- Token links ----------
  /** My tokens linked to this sheet. */
  linkedTokens(sheet: Sheet) {
    return this.tokens.filter((t) => t.link?.sheetId === sheet.id && t.link.ownerId === this.player.id);
  }

  /** Links the one token selected on the map to this sheet. */
  async linkSelected(sheet: Sheet) {
    const ids = await orDefault(this.room.selection(), [], "selection");
    const picked = this.tokens.filter((t) => ids.includes(t.id));
    if (picked.length !== 1) {
      this.ui.showToast({ msg: picked.length ? "Select just one token to link." : "Select a token on the map first." });
      return;
    }
    const token = picked[0]!;
    const before = token.link;
    if (!(await this.writeLinks([token.id], linkFor(sheet, this.player.id, this.player.role)))) return;
    this.ui.showToast({ msg: `Linked ${token.name || "the token"} to ${sheet.name}`, undo: () => void this.writeLinks([token.id], before) });
  }

  async unlinkSheet(sheet: Sheet) {
    const linked = this.linkedTokens(sheet).map((t) => ({ id: t.id, link: t.link! }));
    if (!linked.length || !(await this.writeLinks(linked.map((t) => t.id), null))) return;
    const n = linked.length;
    this.ui.showToast({
      msg: `Unlinked ${n} token${n > 1 ? "s" : ""} from ${sheet.name}`,
      undo: () => linked.forEach((t) => void this.writeLinks([t.id], t.link)),
    });
  }

  /** Writes links; Owlbear refuses when players may not edit tokens, which is worth saying once. */
  private async writeLinks(ids: string[], link: TokenLink | null) {
    try {
      // Links read back from state are proxies, which can't cross postMessage; send plain copies.
      await this.room.setLink(ids, link && $state.snapshot(link));
      return true;
    } catch (e) {
      console.warn("[Heroic Codex] Owlbear refused the token update:", JSON.stringify(e));
      if (!this.linkRefused) this.ui.showToast({ msg: "Owlbear didn't let you update this token. Ask the GM to allow players to edit their tokens." });
      this.linkRefused = true;
      return false;
    }
  }

  /**
   * Keeps linked tokens' HP (and name, kind and role) in step with the sheet, so every HP bar follows along. Each change
   * is written once, in one call per sheet: tokens change all the time (any token moving), and a write that is on its
   * way or was refused must not go out again with every one of those changes.
   */
  private syncLinks() {
    let timer: ReturnType<typeof setTimeout> | undefined;
    /** Token id → the link last written to it, while the token still shows something else. */
    const sent = new Map<string, string>();
    return $effect.root(() => {
      $effect(() => {
        const stale = staleLinks(this.tokens, this.store.library.sheets, this.player.id, this.player.role);
        clearTimeout(timer);
        const staleIds = new Set(stale.map((s) => s.id));
        for (const id of sent.keys()) if (!staleIds.has(id)) sent.delete(id);
        const due = stale.filter((s) => sent.get(s.id) !== JSON.stringify(s.link));
        if (!due.length) return;
        timer = setTimeout(() => {
          const bySheet = new Map<string, { ids: string[]; link: TokenLink }>();
          for (const { id, link } of due) {
            sent.set(id, JSON.stringify(link));
            const group = bySheet.get(link.sheetId);
            if (group) group.ids.push(id);
            else bySheet.set(link.sheetId, { ids: [id], link });
          }
          for (const { ids, link } of bySheet.values()) void this.writeLinks(ids, link);
        }, LINK_SYNC_DELAY);
      });
    });
  }

  /** Selecting one of my linked tokens on the map shows its sheet, unless I'm in the middle of editing. */
  private followSelection(ids: string[]) {
    const key = ids.join(",");
    if (key === this.lastSelection) return;
    this.lastSelection = key;
    if (ids.length !== 1) return;
    const link = this.tokens.find((t) => t.id === ids[0])?.link;
    if (link?.ownerId === this.player.id) this.showSheet(link.sheetId);
  }

  private showSheet(sheetId: string | undefined) {
    if (!sheetId || this.ui.edit || this.ui.dialog || sheetId === this.store.library.activeId) return;
    if (!this.store.library.sheets.some((s) => s.id === sheetId)) return;
    this.store.select(sheetId);
    this.ui.menu = null;
  }

  setBars(bars: BarSettings) {
    this.bars = bars;
    void orDefault(this.room.setRoomData({ [BARS_KEY]: $state.snapshot(bars) }), undefined, "HP bar settings");
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
      msg: kind === "LR"
        ? "Long rest: HP, spell slots and uses restored"
        : `Short rest: short-rest uses${sheet.spellcasting?.shortRest ? " and spell slots" : ""} restored`,
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
