import OBR from "@owlbear-rodeo/sdk";
import type { Room, RoomPlayer } from "./adapter";

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
    send: (channel, data, destination = "ALL") => OBR.broadcast.sendMessage(channel, data, { destination }),
    listen: (channel, cb) => OBR.broadcast.onMessage(channel, (e) => cb(e.data)),
    async setSize(width, height) {
      await OBR.action.setWidth(width);
      if (height) await OBR.action.setHeight(height);
    },
    viewportWidth: () => OBR.viewport.getWidth(),
    setBadge: (text) => OBR.action.setBadgeText(text),
    isOpen: () => OBR.action.isOpen(),
    onOpenChange: (cb) => OBR.action.onOpenChange(cb),
  };
}
