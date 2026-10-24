// Draws token HP bars for this viewer as local items (only this client sees them), so each player gets the mode the
// GM chose for their role. Bars are attached to their token and follow it; they are rebuilt only when what they show,
// or the token's size, changes.
import OBR, { buildShape, buildText, type Image, type Item } from "@owlbear-rodeo/sdk";
import type { Role } from "../lib/obr/adapter";
import { orDefault } from "../lib/obr/safe";
import { isToken } from "../lib/obr/obr";
import { parseBars, parseLink, type BarSettings } from "../lib/tokens/link";
import { BAR_COLORS as COLORS, BAR_EDGE_OPACITY, BAR_TRACK_OPACITY, barModel, barShapes, footprint, modeFor, type Rect } from "../lib/tokens/hpBar";

interface Drawn {
  sig: string;
  ids: string[];
}

export function startBars(viewer: { id: string; role: Role }) {
  let settings: BarSettings = parseBars(undefined);
  const drawn = new Map<string, Drawn>();
  let latest: Item[] = [];
  let running = false;
  let again = false;

  // Each part gets its own z-index, bottom to top: items sharing one are stacked in no fixed order, which let the
  // translucent track land over the fill or the label.
  const Z = { track: 10, fill: 11, temp: 12, tick: 13, label: 14 };
  const attach = (token: Item, z: number) => (b: ReturnType<typeof buildShape> | ReturnType<typeof buildText>) =>
    b.attachedTo(token.id).layer("ATTACHMENT").locked(true).disableHit(true).visible(token.visible)
      .disableAttachmentBehavior(["ROTATION", "SCALE", "LOCKED", "COPY"]).disableAutoZIndex(true).zIndex(z);

  const rect = (token: Item, z: number, r: Rect, color: string, opacity = 1, stroke = 0) =>
    attach(token, z)(buildShape().shapeType("RECTANGLE").width(r.w).height(r.h).position({ x: r.x, y: r.y })
      .fillColor(color).fillOpacity(opacity).strokeColor(COLORS.edge).strokeOpacity(stroke ? BAR_EDGE_OPACITY : 0).strokeWidth(stroke)).build();

  async function itemsFor(token: Item, sceneDpi: number): Promise<Item[]> {
    const link = parseLink(token.metadata)!;
    const model = barModel(link.hp, modeFor(link, viewer, settings), settings.step);
    if (!model) return [];
    // Sized from the token itself, not its bounding box, which grows and shrinks as the token rotates.
    const box = footprint(await OBR.scene.items.getItemBounds([token.id]), token as Image, sceneDpi);
    const s = barShapes(model, box);
    const out: Item[] = [rect(token, Z.track, s.track, COLORS.track, BAR_TRACK_OPACITY, s.stroke)];
    if (s.fill) out.push(rect(token, Z.fill, s.fill, COLORS[model.state]));
    if (s.temp) out.push(rect(token, Z.temp, s.temp, COLORS.temp));
    for (const t of s.ticks) out.push(rect(token, Z.tick, t, COLORS.track, 0.85));
    if (s.label) {
      out.push(
        attach(token, Z.label)(buildText().textType("PLAIN").plainText(s.label.text).width(s.label.w).height(s.label.h)
          .position({ x: s.label.x, y: s.label.y }).padding(0).fontSize(s.label.size).fontWeight(700).fontFamily("Roboto")
          .lineHeight(1).textAlign("CENTER").textAlignVertical("MIDDLE").fillColor("#ffffff")
          .strokeColor(COLORS.edge).strokeOpacity(0.85).strokeWidth(s.label.size * 0.14)).build(),
      );
    }
    return out;
  }

  /** What a token's bar depends on: the link's HP, this viewer's mode and step, and the token's size. */
  function signature(token: Item, sceneDpi: number) {
    const link = parseLink(token.metadata);
    if (!link) return null;
    const img = token as Image;
    const mode = modeFor(link, viewer, settings);
    return JSON.stringify([link.hp, mode, mode === "steps" && settings.step, token.scale, token.rotation, img.image?.width, img.image?.height, img.grid?.dpi, sceneDpi, token.visible]);
  }

  async function render() {
    if (running) {
      again = true;
      return;
    }
    running = true;
    try {
      const seen = new Set<string>();
      const toDelete: string[] = [];
      const toAdd: Item[] = [];
      const sceneDpi = await orDefault(OBR.scene.grid.getDpi(), 150, "grid size");
      for (const token of latest) {
        const sig = signature(token, sceneDpi);
        if (!sig) continue;
        seen.add(token.id);
        const prev = drawn.get(token.id);
        if (prev?.sig === sig) continue;
        if (prev) toDelete.push(...prev.ids);
        const items = await orDefault(itemsFor(token, sceneDpi), [], "token bounds");
        drawn.set(token.id, { sig, ids: items.map((i) => i.id) });
        toAdd.push(...items);
      }
      for (const [id, d] of drawn) {
        if (seen.has(id)) continue;
        toDelete.push(...d.ids);
        drawn.delete(id);
      }
      if (toDelete.length) await orDefault(OBR.scene.local.deleteItems(toDelete), undefined, "bar removal");
      if (toAdd.length) await orDefault(OBR.scene.local.addItems(toAdd), undefined, "bar drawing");
    } finally {
      running = false;
      if (again) {
        again = false;
        void render();
      }
    }
  }

  function update(items: Item[]) {
    latest = items.filter(isToken);
    void render();
  }
  /** Everything changes at once (role or settings): drop the cache so every bar is redrawn. */
  function redrawAll() {
    for (const d of drawn.values()) d.sig = "";
    void render();
  }

  async function load() {
    if (!(await orDefault(OBR.scene.isReady(), false, "scene state"))) return;
    update(await orDefault(OBR.scene.items.getItems(isToken), [], "tokens"));
  }

  void orDefault(OBR.room.getMetadata(), {}, "room data").then((m) => {
    settings = parseBars(m);
    void load();
  });
  OBR.room.onMetadataChange((m) => {
    const next = parseBars(m);
    if (JSON.stringify(next) === JSON.stringify(settings)) return;
    settings = next;
    redrawAll();
  });
  OBR.scene.items.onChange(update);
  // A new grid size rescales every token; the signatures carry it, so a render redraws them.
  OBR.scene.grid.onChange(() => void render());
  OBR.scene.onReadyChange((ready) => {
    // Local items belong to the scene; a new scene starts with none drawn.
    drawn.clear();
    latest = [];
    if (ready) void load();
  });

  return {
    /** The viewer's role changed (they read it from the object they passed in). */
    redraw: redrawAll,
  };
}

