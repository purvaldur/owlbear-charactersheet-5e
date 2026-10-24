// The Codex's background page. Owlbear loads it when you join a room and keeps it until you leave, whether or not
// the Codex is open. It keeps the table's rolls for the popover, counts them on the action badge while the Codex is
// closed, raises the alert popover, draws token HP bars for this viewer and adds the token context menu.
import OBR from "@owlbear-rodeo/sdk";
import { obrRoom } from "../lib/obr/obr";
import { orDefault } from "../lib/obr/safe";
import * as channel from "../lib/log/channel";
import type { RollEntry } from "../lib/dice/types";
import type { Role } from "../lib/obr/adapter";
import { startBars } from "./bars";
import { startMenu } from "./menu";

const ALERT_ID = channel.ALERT_POPOVER;
const ALERT_WIDTH = 360;
const ALERT_MARGIN = 16;
const MAX_ENTRIES = 200;

async function start() {
  const room = obrRoom();
  const viewer: { id: string; role: Role } = { id: OBR.player.id, role: await orDefault(OBR.player.getRole(), "PLAYER", "role") };
  const log: RollEntry[] = [];
  let open = await orDefault(OBR.action.isOpen(), false, "action state");
  let unseen = 0;
  let alertOpen = false;
  /** Rolls that arrived since the alert popover opened, for it to pick up once it has loaded. */
  let queue: RollEntry[] = [];

  const bars = startBars(viewer);
  startMenu(room, viewer.id);

  OBR.player.onChange((p) => {
    viewer.role = p.role;
    bars.setRole(p.role);
  });

  const setBadge = (text?: string) => void orDefault(OBR.action.setBadgeText(text), undefined, "badge");

  async function openAlert() {
    if (alertOpen) return;
    alertOpen = true;
    const [w, h] = await Promise.all([orDefault(OBR.viewport.getWidth(), 1280, "viewport width"), orDefault(OBR.viewport.getHeight(), 800, "viewport height")]);
    await orDefault(
      OBR.popover.open({
        id: ALERT_ID,
        url: "/alert.html",
        width: ALERT_WIDTH,
        height: 160,
        anchorReference: "POSITION",
        anchorPosition: { left: w - ALERT_MARGIN, top: h - ALERT_MARGIN },
        anchorOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
        transformOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
        hidePaper: true,
        disableClickAway: true,
      }),
      undefined,
      "alert popover",
    );
  }
  function closeAlert() {
    queue = [];
    if (!alertOpen) return;
    alertOpen = false;
    void orDefault(OBR.popover.close(ALERT_ID), undefined, "alert popover close");
  }

  channel.listen(room, {
    roll(e) {
      if (!channel.canSee(e, viewer.role, viewer.id) || log.some((x) => x.id === e.id)) return;
      log.push(e);
      if (log.length > MAX_ENTRIES) log.splice(0, log.length - MAX_ENTRIES);
      if (open || e.playerId === viewer.id) return;
      unseen++;
      setBadge(String(unseen));
      queue.push(e);
      void openAlert();
    },
    reply(rollId, r) {
      const en = log.find((e) => e.id === rollId);
      if (en && !en.replies.some((x) => x.sheetId === r.sheetId)) en.replies.push(r);
    },
  });

  room.listen(channel.CHANNELS.logRequest, () => {
    for (const chunk of channel.chunkEntries(log)) void room.send(channel.CHANNELS.logChunk, channel.entriesMessage(chunk), "LOCAL");
  });
  room.listen(channel.CHANNELS.alertRequest, () => void room.send(channel.CHANNELS.alertQueue, channel.entriesMessage(queue), "LOCAL"));
  room.listen(channel.CHANNELS.alertEmpty, (d) => {
    // Close only if nothing arrived that the alert hasn't seen yet; otherwise it is about to show it.
    const shown = new Set((d as { shown?: string[] })?.shown ?? []);
    if (queue.every((e) => shown.has(e.id))) closeAlert();
  });

  OBR.action.onOpenChange((o) => {
    open = o;
    if (!o) return;
    unseen = 0;
    setBadge(undefined);
    closeAlert();
  });
}

if (OBR.isAvailable) OBR.onReady(() => void start().catch((e) => console.error("[Heroic Codex] Background page could not start:", e)));
