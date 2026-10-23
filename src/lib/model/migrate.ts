// Loading stored data: migrate older shapes forward, then validate. Each schema bump adds one step here.
import * as v from "valibot";
import { CURRENT_SCHEMA, LibrarySchema, SheetSchema, describeIssues } from "./schema";
import type { Library, Sheet } from "./types";

type Step = (data: Record<string, unknown>) => Record<string, unknown>;
/** steps[n] upgrades schema n to n + 1. Empty while there is only version 1. */
const steps: Record<number, Step> = {};

export function migrate(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") throw new Error("Not a Codex library");
  let data = raw as Record<string, unknown>;
  let version = typeof data.schemaVersion === "number" ? data.schemaVersion : 1;
  if (version > CURRENT_SCHEMA) throw new Error(`Saved with a newer version of the Codex (schema ${version})`);
  while (version < CURRENT_SCHEMA) {
    const step = steps[version];
    if (!step) throw new Error(`No migration from schema ${version}`);
    data = step(data);
    version++;
  }
  return { ...data, schemaVersion: CURRENT_SCHEMA };
}

export type LoadResult = { ok: true; library: Library } | { ok: false; errors: string[] };

export function loadLibrary(raw: unknown): LoadResult {
  try {
    const parsed = v.safeParse(LibrarySchema, migrate(raw));
    return parsed.success ? { ok: true, library: parsed.output as Library } : { ok: false, errors: describeIssues(parsed.issues) };
  } catch (e) {
    return { ok: false, errors: [(e as Error).message] };
  }
}

export function parseSheet(raw: unknown): { ok: true; sheet: Sheet } | { ok: false; errors: string[] } {
  const parsed = v.safeParse(SheetSchema, raw);
  return parsed.success ? { ok: true, sheet: parsed.output as Sheet } : { ok: false, errors: describeIssues(parsed.issues) };
}
