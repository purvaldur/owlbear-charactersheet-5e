// The table's roll log, as this client sees it. Entries arrive from this client and over broadcast.
import type { Role } from "../obr/adapter";
import type { Reply, RollEntry } from "../dice/types";
import { canSee } from "./channel";

const MAX_ENTRIES = 200;

export class RollLog {
  entries = $state<RollEntry[]>([]);
  unseen = $state(0);
  /** Briefly true after an arrival while the sidebar is closed; drives the toggle's flash. */
  flash = $state(false);
  pending = $state<Record<string, boolean>>({});
  private flashTimer: ReturnType<typeof setTimeout> | undefined;

  add(entry: RollEntry, sidebarOpen: boolean) {
    if (this.entries.some((e) => e.id === entry.id)) return;
    this.entries.push(entry);
    if (this.entries.length > MAX_ENTRIES) this.entries.splice(0, this.entries.length - MAX_ENTRIES);
    if (!sidebarOpen) {
      this.unseen++;
      this.flash = true;
      clearTimeout(this.flashTimer);
      this.flashTimer = setTimeout(() => (this.flash = false), 1400);
    }
  }

  reply(rollId: string, reply: Reply) {
    const en = this.entries.find((e) => e.id === rollId);
    if (!en || en.replies.some((r) => r.sheetId === reply.sheetId)) return;
    en.replies.push(reply);
  }

  seen() {
    this.unseen = 0;
  }

  visible(role: Role, playerId: string) {
    return this.entries.filter((e) => canSee(e, role, playerId));
  }

  /** Adds entries handed over from another page of this client: new ones in time order, replies merged into known ones. */
  merge(entries: RollEntry[], sidebarOpen: boolean) {
    for (const e of [...entries].sort((a, b) => a.t - b.t)) {
      if (this.entries.some((x) => x.id === e.id)) e.replies.forEach((r) => this.reply(e.id, r));
      else this.add(e, sidebarOpen);
    }
    this.entries.sort((a, b) => a.t - b.t);
  }
}
