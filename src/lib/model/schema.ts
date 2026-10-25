// Validation for stored and imported data. Lenient where a missing field has an obvious default, strict on shape.
import * as v from "valibot";
import { ABILITIES, ACTIVATIONS, RARITIES, RECHARGES, RULESETS, itemCategories } from "./defaults";

// Nullish, not optional: Svelte binds an emptied number field as null, and a saved null must not lock the library.
const num = (fallback = 0) => v.nullish(v.pipe(v.number(), v.finite()), fallback);
/** Something the sheet rolls or draws one of each of (dice, use pips, slots): a whole number from 0 to 100. */
const count = (fallback: number) => v.pipe(num(fallback), v.transform((n) => Math.min(100, Math.max(0, Math.trunc(n)))));
const str = (fallback = "") => v.optional(v.string(), fallback);
// Lowercased first: spells added from the SRD list used to store some save targets in capitals ("CON").
const abilityKeys = ABILITIES.map(([k]) => k);
const abilityKey = v.pipe(v.string(), v.toLowerCase(), v.picklist(abilityKeys));
const modSource = v.picklist([...abilityKeys, "sc", ""]);
const activation = v.optional(v.picklist(ACTIVATIONS.map(([k]) => k)), "A");
const recharge = v.picklist(RECHARGES.map(([k]) => k));

const DamagePart = v.object({ n: count(1), d: num(6), ab: v.optional(modSource, ""), flat: num(), type: str("slashing") });
const Uses = v.nullable(v.object({ max: count(1), used: num(), recharge: v.optional(recharge, "LR") }));

const Action = v.object({
  id: v.string(),
  name: str("Unnamed"),
  act: activation,
  range: str(),
  hit: v.optional(v.nullable(v.object({ ab: v.optional(modSource, ""), prof: v.optional(v.boolean(), false), flat: num() })), null),
  save: v.optional(v.nullable(v.object({ ab: v.optional(modSource, ""), dc: v.optional(v.nullable(v.number()), null), target: abilityKey })), null),
  dmg: v.optional(v.array(DamagePart), []),
  uses: v.optional(Uses, null),
  desc: str(),
});

const Spell = v.object({
  id: v.string(),
  name: str("Unnamed"),
  level: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(9)), 0),
  act: activation,
  range: str(),
  conc: v.optional(v.boolean(), false),
  ritual: v.optional(v.boolean(), false),
  hit: v.optional(v.boolean(), false),
  save: v.optional(v.nullable(v.object({ target: abilityKey })), null),
  dmg: v.optional(v.array(DamagePart), []),
  desc: str(),
});

const Feature = v.object({ id: v.string(), name: str("Unnamed"), uses: v.optional(Uses, null), desc: str() });
const Item = v.object({
  id: v.string(),
  qty: num(1),
  name: str("Item"),
  wt: num(),
  cost: num(),
  rarity: v.optional(v.picklist(RARITIES.map(([k]) => k)), ""),
  attune: v.optional(v.boolean(), false),
  attuned: v.optional(v.boolean(), false),
  desc: str(),
  cat: str("backpack"),
});
const ItemCategory = v.object({ id: v.string(), name: str("Category"), collapsed: v.optional(v.boolean(), false) });
/** One action, spell, feature or inventory item on its own (from the editor popover). */
export const EntrySchemas = { action: Action, spell: Spell, feature: Feature, item: Item };

const Ability = v.object({ score: num(10), save: v.optional(v.boolean(), false) });

export const SheetSchema = v.object({
  id: v.string(),
  kind: v.optional(v.picklist(["character", "creature"]), "character"),
  // Sheets from before the choice were made with the 2014 SRD list, the only one there was.
  rules: v.optional(v.picklist(RULESETS.map(([k]) => k)), "2014"),
  name: str("Unnamed"),
  subtitle: str(),
  hp: v.object({ cur: num(10), max: num(10), temp: num() }),
  ac: num(10),
  prof: num(2),
  death: v.optional(v.object({ s: num(), f: num() }), { s: 0, f: 0 }),
  abilities: v.object({ str: Ability, dex: Ability, con: Ability, int: Ability, wis: Ability, cha: Ability }),
  skills: v.optional(v.record(v.string(), v.picklist([0, 1, 2])), {}),
  actions: v.optional(v.array(Action), []),
  spellcasting: v.optional(v.nullable(v.object({ ab: abilityKey, atk: num(), dc: num(), shortRest: v.optional(v.boolean(), false) })), null),
  slots: v.optional(v.record(v.string(), v.object({ max: count(0), used: num() })), {}),
  spells: v.optional(v.array(Spell), []),
  features: v.optional(v.array(Feature), []),
  inventory: v.optional(
    v.object({
      coins: v.optional(v.object({ cp: num(), sp: num(), ep: num(), gp: num(), pp: num() }), { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }),
      // Sheets from before categories get the two defaults; their items default into the backpack.
      categories: v.optional(v.pipe(v.array(ItemCategory), v.transform((c) => (c.length ? c : itemCategories()))), itemCategories),
      items: v.optional(v.array(Item), []),
    }),
    () => ({ coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }, categories: itemCategories(), items: [] }),
  ),
  background: v.optional(
    v.object({
      name: str(),
      feature: v.optional(v.object({ name: str(), desc: str() }), { name: "", desc: "" }),
      traits: v.optional(v.string()),
      ideals: v.optional(v.string()),
      bonds: v.optional(v.string()),
      flaws: v.optional(v.string()),
      allies: v.optional(v.string()),
      appearance: v.optional(v.string()),
      backstory: v.optional(v.string()),
    }),
    { name: "", feature: { name: "", desc: "" } },
  ),
  notes: str(),
  color: str("#3d8bfd"),
});

export const CURRENT_SCHEMA = 1;

/** The library's own shape. Its sheets are checked one by one, so one bad sheet doesn't hide the others. */
export const LibrarySchema = v.object({
  schemaVersion: v.literal(CURRENT_SCHEMA),
  sheets: v.array(v.unknown()),
  activeId: v.nullable(v.string()),
});

/** An export file holds one or more sheets. */
export const ExportSchema = v.object({
  format: v.literal("valdurs-codex"),
  schemaVersion: v.number(),
  sheets: v.array(v.unknown()),
});

/** Turns valibot issues into short, field-level messages for the import error. */
export function describeIssues(issues: v.BaseIssue<unknown>[]): string[] {
  return issues.slice(0, 5).map((i) => {
    const path = i.path?.map((p) => p.key).join(".") || "file";
    return `${path}: ${i.message}`;
  });
}
