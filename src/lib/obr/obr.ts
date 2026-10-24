import OBR, { type Item } from "@owlbear-rodeo/sdk";
import type { Room, RoomPlayer } from "./adapter";
import { LINK_KEY, parseLink, type Token } from "../tokens/link";
import { orDefault } from "./safe";
import { browserPages } from "./pages";

/** The items the Codex treats as tokens: characters and mounts. */
export const isToken = (it: Item) => it.layer === "CHARACTER" || it.layer === "MOUNT";
const toToken = (it: Item): Token => ({ id: it.id, name: it.name, link: parseLink(it.metadata) });

const toPlayer = (p: { id: string; name: string; role: "GM" | "PLAYER" }): RoomPlayer => ({ id: p.id, name: p.name, role: p.role });

/** Room backed by the real Owlbear Rodeo SDK. Only valid after OBR.onReady. */
export function obrRoom(): Room {
  return {
    inOwlbear: true,
    async player() {
      const [name, role] = await Promise.all([OBR.player.getName(), OBR.player.getRole()]);
      return { id: OBR.player.id, name, role };
    },
    onPlayerChange: (cb) => OBR.player.onChange((p) => cb(toPlayer(p))),
    theme: () => OBR.theme.getTheme(),
    onThemeChange: (cb) => OBR.theme.onChange(cb),
    // Every send is fire-and-forget (replies and timeouts handle the rest), so a refusal is logged, never thrown.
    send: (channel, data, destination = "ALL") => orDefault(OBR.broadcast.sendMessage(channel, data, { destination }), undefined, `broadcast on ${channel}`),
    listen: (channel, cb) => OBR.broadcast.onMessage(channel, (e) => cb(e.data)),
    async setSize(width, height) {
      await OBR.action.setWidth(width);
      if (height) await OBR.action.setHeight(height);
    },
    viewportWidth: () => OBR.viewport.getWidth(),
    viewportHeight: () => OBR.viewport.getHeight(),
    setBadge: (text) => OBR.action.setBadgeText(text),
    isOpen: () => OBR.action.isOpen(),
    onOpenChange: (cb) => OBR.action.onOpenChange(cb),
    openAction: () => OBR.action.open(),
    setPopoverHeight: (id, height) => OBR.popover.setHeight(id, height),
    async openDialog(id, url, width, height) {
      const [w, h] = await Promise.all([orDefault(OBR.viewport.getWidth(), 1280, "viewport width"), orDefault(OBR.viewport.getHeight(), 800, "viewport height")]);
      await OBR.popover.open({
        id,
        url,
        width,
        height: Math.min(height, h - 32),
        anchorReference: "POSITION",
        anchorPosition: { left: w / 2, top: h / 2 },
        anchorOrigin: { horizontal: "CENTER", vertical: "CENTER" },
        transformOrigin: { horizontal: "CENTER", vertical: "CENTER" },
        // It stays open while you work on the sheet behind it; Done, Escape or leaving Edit closes it.
        disableClickAway: true,
      });
    },
    closePopover: (id) => OBR.popover.close(id),
    pages: browserPages(),

    tokens: async () => (await OBR.scene.items.getItems(isToken)).map(toToken),
    onTokens(cb) {
      const stopItems = OBR.scene.items.onChange((items) => cb(items.filter(isToken).map(toToken)));
      const stopReady = OBR.scene.onReadyChange((ready) => {
        if (!ready) cb([]);
        else OBR.scene.items.getItems(isToken).then((items) => cb(items.map(toToken)), () => cb([]));
      });
      return () => {
        stopItems();
        stopReady();
      };
    },
    setLink: (ids, link) =>
      OBR.scene.items.updateItems(ids, (items) => {
        for (const it of items) {
          if (link) it.metadata[LINK_KEY] = link;
          else delete it.metadata[LINK_KEY];
        }
      }),
    selection: async () => (await OBR.player.getSelection()) ?? [],
    onSelection: (cb) => OBR.player.onChange((p) => cb(p.selection ?? [])),
    roomData: () => OBR.room.getMetadata(),
    setRoomData: (patch) => OBR.room.setMetadata(patch),
    onRoomData: (cb) => OBR.room.onMetadataChange(cb),
  };
}
