// Export and import of sheet files (.codex.json). The file is the backup and the way to move between devices.
import * as v from "valibot";
import { parseSheets, type UnreadSheet } from "../model/migrate";
import { CURRENT_SCHEMA, ExportSchema, describeIssues } from "../model/schema";
import type { Sheet } from "../model/types";

export function exportJson(sheets: Sheet[]): string {
  return JSON.stringify({ format: "valdurs-codex", schemaVersion: CURRENT_SCHEMA, exportedAt: new Date().toISOString(), sheets }, null, 2);
}

export const exportFileName = (sheets: Sheet[]) =>
  `${sheets.length === 1 ? sheets[0]!.name.replace(/[^\w-]+/g, "-").toLowerCase() || "sheet" : "codex-sheets"}.codex.json`;

export function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** A file imports the sheets it can read; `unread` names any it couldn't. Only a file with none to read fails. */
export type ImportResult = { ok: true; sheets: Sheet[]; unread: UnreadSheet[] } | { ok: false; errors: string[] };

export function importJson(text: string): ImportResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, errors: ["This file is not valid JSON. Pick a .codex.json file exported from the Codex."] };
  }
  const file = v.safeParse(ExportSchema, raw);
  if (!file.success) return { ok: false, errors: ["This is not a Codex sheet file.", ...describeIssues(file.issues)] };
  if (file.output.schemaVersion > CURRENT_SCHEMA) return { ok: false, errors: ["This file was saved by a newer version of the Codex."] };
  const { sheets, unread } = parseSheets(file.output.sheets);
  if (sheets.length) return { ok: true, sheets, unread };
  return { ok: false, errors: unread.length ? unread.flatMap((u) => u.errors.map((e) => `${u.name}: ${e}`)) : ["This file has no sheets in it."] };
}
