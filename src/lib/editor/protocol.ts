// The editor popover and the Codex talk over the page bus. The popover is the Codex's dialog in the middle of the room:
// it edits one entry, lists the SRD spells or items to add, lists the SRD creatures to make a sheet from, or walks
// through the guided setup of a new character. The Codex alone saves sheets: it sends the popover the sheet and what
// to show, and applies each change the popover sends back.
import * as v from "valibot";
import { EntrySchemas } from "../model/schema";
import type { SrdList } from "../model/srd";
import type { Action, Feature, Item, Rules, Sheet, Spell } from "../model/types";

export const EDITOR_POPOVER = "io.vald.codex/editor";
export const EDITOR_URL = "/editor.html";
export const EDITOR_WIDTH = 540;

export type EditKind = "action" | "spell" | "feature" | "item";
export type Editable = Action | Spell | Feature | Item;
/**
 * An entry to edit; an SRD list, whose items go in inventory category `cat`; the SRD creatures for a new sheet; or the
 * guided setup of a new character. The last two need no sheet open.
 */
export type Dialog =
  | { view: "edit"; kind: EditKind; id: string }
  | { view: "srd"; list: Exclude<SrdList, "monsters">; cat?: string }
  | { view: "monsters"; rules: Rules }
  | { view: "setup"; rules: Rules };

/** Whether a dialog works on the open sheet (and closes without one), or makes a new one. */
export const onSheet = (d: Dialog) => d.view === "edit" || d.view === "srd";

/** Opening heights, near what each needs; the popover then fits itself to its content. */
export const dialogHeight = (d: Dialog) =>
  d.view === "edit" ? ({ action: 640, spell: 640, feature: 380, item: 480 } satisfies Record<EditKind, number>)[d.kind] : 720;
/** One dialog, or the same one again (the same entry, or the same SRD list for the same category). */
export function sameDialog(a: Dialog | null, b: Dialog | null) {
  if (!a || !b || a.view !== b.view) return false;
  if (a.view === "edit") return a.id === (b as typeof a).id;
  if (a.view === "monsters" || a.view === "setup") return a.rules === (b as typeof a).rules;
  return a.list === (b as typeof a).list && a.cat === (b as typeof a).cat;
}

export const EDITOR = {
  /** Editor → Codex: loaded, send me what to edit. */
  ready: "valdurs-codex/editor-ready",
  /** Codex → editor: the sheet and the entry to edit, again whenever the sheet changes in the Codex. */
  open: "valdurs-codex/editor-open",
  /** Editor → Codex: the entry as it is now. */
  change: "valdurs-codex/editor-change",
  /** Editor → Codex: delete the entry. */
  remove: "valdurs-codex/editor-remove",
  /** Editor → Codex: add these spells or items from the SRD list. */
  addSrd: "valdurs-codex/editor-add-srd",
  /** Editor → Codex: add this new sheet (a creature from the SRD list, a character from the guided setup) and show it. */
  createSheet: "valdurs-codex/editor-create-sheet",
  /** Editor → Codex: done, close me. */
  done: "valdurs-codex/editor-done",
} as const;

export interface OpenMessage {
  /** The open sheet; null for a dialog that makes a new one, opened with no sheet yet. */
  sheet: Sheet | null;
  dialog: Dialog;
  /** Something new to show (not the same again): the popover focuses its first field. */
  focus: boolean;
  /** The last change the Codex applied. A sheet sent before the editor's latest change landed is out of date. */
  ack: number;
}
export interface ChangeMessage {
  sheetId: string;
  kind: EditKind;
  item: Editable;
  seq: number;
}
export interface EntryMessage {
  sheetId: string;
  kind: EditKind;
  id: string;
}
export interface AddSrdMessage {
  sheetId: string;
  list: SrdList;
  entries: (Spell | Item)[];
}
export interface CreateSheetMessage {
  sheet: Sheet;
}
export interface DoneMessage {
  /** The open sheet's id; "" when there is none. */
  sheetId: string;
  dialog: Dialog;
}

export function entries(sheet: Sheet, kind: EditKind): Editable[] {
  if (kind === "item") return sheet.inventory.items;
  return kind === "spell" ? sheet.spells : kind === "feature" ? sheet.features : sheet.actions;
}

export const findEntry = (sheet: Sheet, kind: EditKind, id: string) => entries(sheet, kind).find((x) => x.id === id) ?? null;

/** An entry from the editor, checked like stored data before it goes into a sheet. */
export function parseEntry(kind: EditKind, raw: unknown): Editable | null {
  const res = v.safeParse(EntrySchemas[kind], raw);
  return res.success ? (res.output as Editable) : null;
}
