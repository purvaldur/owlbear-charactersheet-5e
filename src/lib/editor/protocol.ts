// The editor popover and the Codex talk over the page bus. The Codex alone saves sheets: it sends the editor the
// sheet and the entry to edit, and applies each change the editor sends back.
import * as v from "valibot";
import { EntrySchemas } from "../model/schema";
import type { Action, Feature, Item, Sheet, Spell } from "../model/types";

export const EDITOR_POPOVER = "io.vald.codex/editor";
export const EDITOR_URL = "/editor.html";
export const EDITOR_WIDTH = 540;

export type EditKind = "action" | "spell" | "feature" | "item";
export type Editable = Action | Spell | Feature | Item;

/** Opening heights, near what each kind needs; the editor then fits itself to its content. */
export const EDITOR_HEIGHT: Record<EditKind, number> = { action: 640, spell: 640, feature: 380, item: 480 };

export const EDITOR = {
  /** Editor → Codex: loaded, send me what to edit. */
  ready: "valdurs-codex/editor-ready",
  /** Codex → editor: the sheet and the entry to edit, again whenever the sheet changes in the Codex. */
  open: "valdurs-codex/editor-open",
  /** Editor → Codex: the entry as it is now. */
  change: "valdurs-codex/editor-change",
  /** Editor → Codex: delete the entry. */
  remove: "valdurs-codex/editor-remove",
  /** Editor → Codex: done editing, close me. */
  done: "valdurs-codex/editor-done",
} as const;

export interface OpenMessage {
  sheet: Sheet;
  kind: EditKind;
  id: string;
  /** A new entry to edit (not the same one again): the editor focuses its name. */
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
