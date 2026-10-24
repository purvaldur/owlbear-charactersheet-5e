// Token context menu entries: link a token to my active sheet, open a linked token's sheet, unlink.
import OBR from "@owlbear-rodeo/sdk";
import type { Role, Room } from "../lib/obr/adapter";
import { orDefault } from "../lib/obr/safe";
import { CHANNELS } from "../lib/log/channel";
import { LINK_KEY, linkFor, parseLink } from "../lib/tokens/link";
import { SheetStore } from "../lib/store/sheets.svelte";

const ID = "io.vald.codex";

export function startMenu(room: Room, viewer: { id: string; role: Role }) {
  const me = viewer.id;
  const mine = { key: ["metadata", LINK_KEY, "ownerId"], value: me };
  const unlinked = { key: ["metadata", LINK_KEY], value: undefined };
  const linked = { key: ["metadata", LINK_KEY], value: undefined, operator: "!=" as const };

  void orDefault(
    OBR.contextMenu.create({
      id: `${ID}/open`,
      icons: [{ icon: "/icons/open.svg", label: "Open sheet in the Codex", filter: { max: 1, every: [mine] } }],
      async onClick(ctx) {
        const link = parseLink(ctx.items[0]?.metadata);
        if (!link) return;
        await orDefault(OBR.action.open(), undefined, "open the Codex");
        // A popover that was never opened picks the sheet up from the selection instead.
        void room.send(CHANNELS.selectSheet, { sheetId: link.sheetId }, "LOCAL");
      },
    }),
    undefined,
    "context menu",
  );

  void orDefault(
    OBR.contextMenu.create({
      id: `${ID}/link`,
      // Character and mount tokens, as everywhere else in the Codex: one entry per layer, since a filter's keys all apply.
      icons: (["CHARACTER", "MOUNT"] as const).map((layer) => ({
        icon: "/icons/link.svg",
        label: "Link to my active Codex sheet",
        filter: { max: 1, permissions: ["UPDATE" as const], every: [{ key: "layer", value: layer }, unlinked] },
      })),
      async onClick(ctx) {
        const sheet = new SheetStore().load().active;
        const token = ctx.items[0];
        if (!token) return;
        if (!sheet) {
          void orDefault(OBR.notification.show("Make a sheet in the Heroic Codex first, then link it.", "INFO"), "", "notification");
          return;
        }
        await orDefault(room.setLink([token.id], linkFor(sheet, me, viewer.role)), undefined, "token link");
      },
    }),
    undefined,
    "context menu",
  );

  void orDefault(
    OBR.contextMenu.create({
      id: `${ID}/unlink`,
      icons: [
        { icon: "/icons/unlink.svg", label: "Unlink from the Codex", filter: { permissions: ["UPDATE"], every: [mine] } },
        { icon: "/icons/unlink.svg", label: "Unlink from the Codex", filter: { roles: ["GM"], every: [linked] } },
      ],
      async onClick(ctx) {
        await orDefault(room.setLink(ctx.items.map((i) => i.id), null), undefined, "token unlink");
      },
    }),
    undefined,
    "context menu",
  );
}
