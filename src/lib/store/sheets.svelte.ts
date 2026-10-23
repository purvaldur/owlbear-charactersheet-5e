// The user's sheets, kept in this browser (PRODUCT.md: local storage plus file export for release 1).
import { IDENTITY_COLORS, blankSheet } from "../model/defaults";
import { loadLibrary } from "../model/migrate";
import { CURRENT_SCHEMA } from "../model/schema";
import type { Library, Sheet, SheetKind } from "../model/types";

export const STORAGE_KEY = "valdurs-codex/v2";
const SAVE_DELAY = 300;

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export class SheetStore {
  library = $state<Library>({ schemaVersion: CURRENT_SCHEMA, sheets: [], activeId: null });
  /** True when the browser refuses storage; the sheet shows a banner and offers Export. */
  storageBlocked = $state(false);
  /** Set when stored data could not be read; the original text is kept untouched in storage. */
  loadErrors = $state<string[]>([]);
  active = $derived(this.library.sheets.find((s) => s.id === this.library.activeId) ?? this.library.sheets[0] ?? null);

  private timer: ReturnType<typeof setTimeout> | undefined;
  private storage: KeyValueStore | null;
  private stopWatching: (() => void) | undefined;

  constructor(storage?: KeyValueStore | null) {
    this.storage = storage === undefined ? safeLocalStorage() : storage;
    if (!this.storage) this.storageBlocked = true;
  }

  load() {
    let raw: string | null = null;
    try {
      raw = this.storage?.getItem(STORAGE_KEY) ?? null;
    } catch {
      this.storageBlocked = true;
    }
    if (raw) {
      const res = loadLibrary(safeJson(raw));
      if (res.ok) this.library = res.library;
      else this.loadErrors = res.errors;
    }
    return this;
  }

  /** Saves after changes settle. Call once from a component or $effect.root. */
  watch() {
    this.stopWatching?.();
    this.stopWatching = $effect.root(() => {
      $effect(() => {
        const json = JSON.stringify(this.library);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.write(json), SAVE_DELAY);
      });
    });
    return this.stopWatching;
  }

  flush() {
    clearTimeout(this.timer);
    this.write(JSON.stringify(this.library));
  }

  private write(json: string) {
    // Never overwrite data we failed to read: the user can still export or fix it.
    if (this.loadErrors.length || !this.storage) return;
    try {
      this.storage.setItem(STORAGE_KEY, json);
      this.storageBlocked = false;
    } catch {
      this.storageBlocked = true;
    }
  }

  select(id: string) {
    if (this.library.sheets.some((s) => s.id === id)) this.library.activeId = id;
  }

  create(kind: SheetKind): Sheet {
    const color = IDENTITY_COLORS[this.library.sheets.length % IDENTITY_COLORS.length]!;
    const sheet = blankSheet(kind, color);
    this.library.sheets.push(sheet);
    this.library.activeId = sheet.id;
    return sheet;
  }

  /** Adds imported sheets, giving any that collide with an existing id a fresh one. */
  addSheets(sheets: Sheet[]) {
    const ids = new Set(this.library.sheets.map((s) => s.id));
    for (const s of sheets) {
      const copy = { ...s, id: ids.has(s.id) ? `${s.id}-${crypto.randomUUID().slice(0, 4)}` : s.id };
      ids.add(copy.id);
      this.library.sheets.push(copy);
    }
    if (sheets.length) this.library.activeId = this.library.sheets[this.library.sheets.length - 1]!.id;
  }

  remove(id: string): { sheet: Sheet; index: number } | null {
    const index = this.library.sheets.findIndex((s) => s.id === id);
    if (index < 0) return null;
    const [sheet] = this.library.sheets.splice(index, 1);
    if (this.library.activeId === id) this.library.activeId = this.library.sheets[0]?.id ?? null;
    return { sheet: sheet!, index };
  }

  restore(sheet: Sheet, index: number) {
    this.library.sheets.splice(index, 0, sheet);
    this.library.activeId = sheet.id;
  }
}

function safeLocalStorage(): KeyValueStore | null {
  try {
    const ls = globalThis.localStorage;
    const probe = "valdurs-codex/probe";
    ls.setItem(probe, "1");
    ls.removeItem(probe);
    return ls;
  } catch {
    return null;
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
