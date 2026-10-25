// The editor popover and the Codex talk over the page bus. The popover is the Codex's dialog in the middle of the room:
// it edits one entry, or lists the SRD spells or items to add. The Codex alone saves sheets: it sends the popover the sheet and
// what to show, and applies each change the popover sends back.
import * as v from "valibot";
import { EntrySchemas } from "../model/schema";
import type { SrdList } from "../model/srd";
import type { Action, Feature, Item, Sheet, Spell } from "../model/types";

export const EDITOR_POPOVER = "io.vald.codex/editor";
export const EDITOR_URL = "/editor.html";
export const EDITOR_WIDTH = 540;

export type EditKind = "action" | "spell" | "feature" | "item";
export type Editable = Action | Spell | Feature | Item;
/** An SRD list; items picked from it go in inventory category `cat`. */
export type Dialog = { view: "edit"; kind: EditKind; id: string } | { view: "srd"; list: SrdList; cat?: string };

/** Opening heights, near what each needs; the popover then fits itself to its content. */
export const dialogHeight = (d: Dialog) =>
  d.view === "srd" ? 720 : ({ action: 640, spell: 640, feature: 380, item: 480 } satisfies Record<EditKind, number>)[d.kind];
/** One dialog, or the same one again (the same entry, or the same SRD list for the same category). */
export function sameDialog(a: Dialog | null, b: Dialog | null) {
  if (!a || !b || a.view !== b.view) return false;
  if (a.view === "edit") return a.id === (b as typeof a).id;
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
  /** Editor → Codex: done, close me. */
  done: "valdurs-codex/editor-done",
} as const;

export interface OpenMessage {
  sheet: Sheet;
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
export interface DoneMessage {
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
