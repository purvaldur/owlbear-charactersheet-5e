// The SRD lists as the SRD list in the dialog popover loads them (public/srd, written by scripts/build-srd.mjs from
// scripts/data), and turning an entry into a sheet's own. Each list holds entries in the sheet's shapes, less the id,
// plus what the list filters by.
import { newAction, newFeature, newItem, newSpell, uid } from "./defaults";
import type { Action, Feature, Item, Rules, Sheet, Spell } from "./types";

export type SrdList = "spells" | "items" | "monsters";
/** `classes` ("Wizard", "Cleric") and `school` ("Evocation") are for the list's filters. */
export type SrdSpell = Omit<Spell, "id"> & { classes: string[]; school: string };
/** `type` is the SRD's own category ("Weapon", "Adventuring Gear", "Wondrous Item"), for the list's filters. Items
 * have no inventory category: they go in the one the list was opened from. */
export type SrdItem = Omit<Item, "id" | "cat"> & { type: string };

/**
 * A creature sheet less its ids and colour, plus `cr`, `type` ("Dragon") and `size` ("Huge") for the list's filters.
 * Open5e's stat blocks are converted by scripts/open5e/monsters.mjs.
 */
export type SrdMonster = Omit<Sheet, "id" | "color" | "actions" | "spells" | "features"> & {
  cr: number;
  type: string;
  size: string;
  actions: Omit<Action, "id">[];
  spells: Omit<Spell, "id">[];
  features: Omit<Feature, "id">[];
};

/** Where an SRD list loads from; "setup" is the guided setup's species, classes, backgrounds and feats. */
export const srdUrl = (list: SrdList | "setup", rules: Rules) => `${import.meta.env.BASE_URL}srd/${list}-${rules}.json`;

// Copies (by JSON, as the list may be reactive state), so two sheets given the same entry never share its damage parts.
const copy = <T>(x: T): T => JSON.parse(JSON.stringify(x));

export function spellFromSrd(s: SrdSpell): Spell {
  const { classes: _, school: __, ...spell } = copy(s);
  return newSpell(spell);
}

export function itemFromSrd(s: SrdItem, cat: string): Item {
  const { type: _, ...item } = copy(s);
  return newItem({ ...item, cat });
}

/** A creature from the list as a sheet of its own, everything on it with a fresh id. */
export function sheetFromSrdMonster(m: SrdMonster, color: string): Sheet {
  const { cr: _, type: __, size: ___, ...rest } = copy(m);
  return {
    ...rest,
    id: uid("sh"),
    color,
    actions: rest.actions.map((a) => newAction(a)),
    spells: rest.spells.map((s) => newSpell(s)),
    features: rest.features.map((f) => newFeature(f)),
  };
}
