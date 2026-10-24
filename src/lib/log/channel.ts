// Sharing roll cards and save replies with the table over OBR broadcast (messages are capped at 16KB).
// Rolls and replies go to everyone including this client, so the background page hears our own rolls too; the
// LOCAL channels connect this client's own pages (popover, background, alert) to each other.
import type { Role, Room } from "../obr/adapter";
import type { Reply, RollEntry } from "../dice/types";

/** Our alert popover, opened by the background page over the map. */
export const ALERT_POPOVER = "io.vald.codex/alert";

export const CHANNELS = {
  roll: "valdurs-codex/roll",
  reply: "valdurs-codex/reply",
  /** Popover → background: send me the log you kept. Background → popover: one chunk of it. */
  logRequest: "valdurs-codex/log-request",
  logChunk: "valdurs-codex/log-chunk",
  /** Alert → background: send me the rolls waiting for me. Background → alert: here they are. */
  alertRequest: "valdurs-codex/alert-request",
  alertQueue: "valdurs-codex/alert-queue",
  /** Alert → background: nothing left to show, close me. */
  alertEmpty: "valdurs-codex/alert-empty",
  /** Background → popover: show this sheet (from the token context menu). */
  selectSheet: "valdurs-codex/select-sheet",
} as const;
const VERSION = 1;
const MAX_BYTES = 15_000;

interface RollMessage {
  v: number;
  entry: RollEntry;
}
interface ReplyMessage {
  v: number;
  rollId: string;
  reply: Reply;
}

/** Keeps a card under the broadcast limit by shortening its description. */
export function fitEntry(entry: RollEntry): RollEntry {
  let e = entry;
  while (JSON.stringify({ v: VERSION, entry: e }).length > MAX_BYTES && e.desc) {
    e = { ...e, desc: e.desc.length > 200 ? `${e.desc.slice(0, Math.floor(e.desc.length / 2))}…` : undefined };
  }
  return e;
}

const isEntry = (x: unknown): x is RollEntry => {
  const e = x as RollEntry;
  return !!e && typeof e.id === "string" && typeof e.title === "string" && typeof e.who === "string" && Array.isArray(e.replies);
};

/** GM-only entries are shown to the GM and to whoever rolled them. Broadcast is honest-table privacy, not security. */
export const canSee = (e: RollEntry, role: Role, playerId: string) => e.vis !== "gm" || role === "GM" || e.playerId === playerId;

export function shareRoll(room: Room, entry: RollEntry) {
  return room.send(CHANNELS.roll, { v: VERSION, entry: fitEntry(entry) } satisfies RollMessage, "ALL");
}
export function shareReply(room: Room, rollId: string, reply: Reply) {
  return room.send(CHANNELS.reply, { v: VERSION, rollId, reply } satisfies ReplyMessage, "ALL");
}

/** Splits entries into groups that each fit one broadcast, oldest first. */
export function chunkEntries(entries: RollEntry[], maxBytes = MAX_BYTES): RollEntry[][] {
  const chunks: RollEntry[][] = [];
  let cur: RollEntry[] = [];
  let size = 0;
  for (const raw of entries) {
    const e = fitEntry(raw);
    const n = JSON.stringify(e).length + 1;
    if (cur.length && size + n > maxBytes) {
      chunks.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(e);
    size += n;
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}

/** Entries handed between this client's own pages, checked like anything else that arrives over broadcast. */
export function entriesFrom(data: unknown): RollEntry[] {
  const m = data as { v?: number; entries?: unknown[] };
  return m?.v === VERSION && Array.isArray(m.entries) ? m.entries.filter(isEntry) : [];
}
export const entriesMessage = (entries: RollEntry[]) => ({ v: VERSION, entries });

export function listen(room: Room, handlers: { roll: (e: RollEntry) => void; reply: (rollId: string, r: Reply) => void }) {
  const stopRoll = room.listen(CHANNELS.roll, (data) => {
    const m = data as RollMessage;
    if (m?.v === VERSION && isEntry(m.entry)) handlers.roll(m.entry);
  });
  const stopReply = room.listen(CHANNELS.reply, (data) => {
    const m = data as ReplyMessage;
    if (m?.v === VERSION && typeof m.rollId === "string" && m.reply) handlers.reply(m.rollId, m.reply);
  });
  return () => {
    stopRoll();
    stopReply();
  };
}
