// Sharing roll cards and save replies with the table over OBR broadcast (messages are capped at 16KB).
import type { Room } from "../obr/adapter";
import type { Reply, RollEntry } from "../dice/types";

export const CHANNELS = { roll: "valdurs-codex/roll", reply: "valdurs-codex/reply" } as const;
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

export function shareRoll(room: Room, entry: RollEntry) {
  return room.send(CHANNELS.roll, { v: VERSION, entry: fitEntry(entry) } satisfies RollMessage, "REMOTE");
}
export function shareReply(room: Room, rollId: string, reply: Reply) {
  return room.send(CHANNELS.reply, { v: VERSION, rollId, reply } satisfies ReplyMessage, "REMOTE");
}

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
