// The SRD lists as the SRD list in the dialog popover loads them (public/srd, written by scripts/build-srd.mjs from
// scripts/data), and turning an entry into a sheet's own. Each list holds entries in the sheet's shapes, less the id,
// plus what the list filters by.
import { newItem, newSpell } from "./defaults";
import type { Item, Rules, Spell } from "./types";

export type SrdList = "spells" | "items";
/** `classes` ("Wizard", "Cleric") and `school` ("Evocation") are for the list's filters. */
export type SrdSpell = Omit<Spell, "id"> & { classes: string[]; school: string };
/** `type` is the SRD's own category ("Weapon", "Adventuring Gear", "Wondrous Item"), for the list's filters. Items
 * have no inventory category: they go in the one the list was opened from. */
export type SrdItem = Omit<Item, "id" | "cat"> & { type: string };

export const srdUrl = (list: SrdList, rules: Rules) => `${import.meta.env.BASE_URL}srd/${list}-${rules}.json`;

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
