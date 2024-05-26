import OBR from "@owlbear-rodeo/sdk";

const ID = "valdur.heroic-codex";

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        icon: "/icon.svg",
        label: "Link token to sheet",
        filter: {
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick(context) {

    },
  });
}