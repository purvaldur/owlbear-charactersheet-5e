import type { AbilityKey, Activation, Recharge, Sheet, SheetKind, ProfLevel, Action, Spell, Feature, Item, DamagePart } from "./types";

export const ABILITIES: readonly [AbilityKey, string, string][] = [
  ["str", "STR", "Strength"],
  ["dex", "DEX", "Dexterity"],
  ["con", "CON", "Constitution"],
  ["int", "INT", "Intelligence"],
  ["wis", "WIS", "Wisdom"],
  ["cha", "CHA", "Charisma"],
];
export const ABILITY = Object.fromEntries(ABILITIES.map(([k, s, l]) => [k, { short: s, long: l }])) as Record<
  AbilityKey,
  { short: string; long: string }
>;

export const SKILLS: readonly [string, string, AbilityKey][] = [
  ["acrobatics", "Acrobatics", "dex"],
  ["animal", "Animal Handling", "wis"],
  ["arcana", "Arcana", "int"],
  ["athletics", "Athletics", "str"],
  ["deception", "Deception", "cha"],
  ["history", "History", "int"],
  ["insight", "Insight", "wis"],
  ["intimidation", "Intimidation", "cha"],
  ["investigation", "Investigation", "int"],
  ["medicine", "Medicine", "wis"],
  ["nature", "Nature", "int"],
  ["perception", "Perception", "wis"],
  ["performance", "Performance", "cha"],
  ["persuasion", "Persuasion", "cha"],
  ["religion", "Religion", "int"],
  ["sleight", "Sleight of Hand", "dex"],
  ["stealth", "Stealth", "dex"],
  ["survival", "Survival", "wis"],
];

export const ACTIVATIONS: readonly [Activation, string][] = [
  ["A", "Action"],
  ["BA", "Bonus action"],
  ["R", "Reaction"],
  ["—", "No action"],
  ["1M", "1 minute"],
  ["10M", "10 minutes"],
  ["1H", "1 hour"],
  ["8H", "8 hours"],
  ["12H", "12 hours"],
  ["24H", "24 hours"],
];

export const DAMAGE_TYPES = [
  "acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing",
  "poison", "psychic", "radiant", "slashing", "thunder", "healing",
] as const;

export const RECHARGES: readonly [Recharge, string][] = [
  ["SR", "Short rest"],
  ["LR", "Long rest"],
  ["5–6", "Recharge 5–6"],
  ["—", "Manual"],
];

export const SPELL_LEVELS = ["Cantrips", "1st level", "2nd level", "3rd level", "4th level", "5th level", "6th level", "7th level", "8th level", "9th level"];

/** Identity colours for new sheets: kept off the red, amber and green hues, which mean game state. */
export const IDENTITY_COLORS = ["#3d8bfd", "#c25bb5", "#2b9fc0", "#8a7cf0", "#d06bd9", "#4f8ff7"];

export const uid = (prefix: string) => `${prefix}${crypto.randomUUID().slice(0, 8)}`;

export const abilities = (scores: number[] = [10, 10, 10, 10, 10, 10], saves: AbilityKey[] = []) =>
  Object.fromEntries(ABILITIES.map(([k], i) => [k, { score: scores[i] ?? 10, save: saves.includes(k) }])) as Sheet["abilities"];

export const skills = (profs: Record<string, ProfLevel> = {}) =>
  Object.fromEntries(SKILLS.map(([k]) => [k, profs[k] ?? 0])) as Record<string, ProfLevel>;

export const damage = (n: number, d: number, ab: DamagePart["ab"] = "", flat = 0, type = "slashing"): DamagePart => ({ n, d, ab, flat, type });

export const newAction = (o: Partial<Action> = {}): Action => ({
  id: uid("a"), name: "New action", act: "A", range: "", hit: null, save: null, dmg: [], uses: null, desc: "", ...o,
});
export const newSpell = (o: Partial<Spell> = {}): Spell => ({
  id: uid("s"), name: "New spell", level: 1, act: "A", range: "", conc: false, ritual: false, hit: false, save: null, dmg: [], desc: "", ...o,
});
export const newFeature = (o: Partial<Feature> = {}): Feature => ({ id: uid("f"), name: "New feature", uses: null, desc: "", ...o });
export const newItem = (name: string, wt = 0, qty = 1): Item => ({ id: uid("i"), qty, name, wt });

export function blankSheet(kind: SheetKind, color = IDENTITY_COLORS[0]!): Sheet {
  return {
    id: uid("sh"),
    kind,
    name: kind === "creature" ? "New creature" : "New character",
    subtitle: "",
    hp: { cur: 10, max: 10, temp: 0 },
    ac: 10,
    prof: 2,
    death: { s: 0, f: 0 },
    abilities: abilities(),
    skills: skills(),
    actions: [],
    spellcasting: null,
    slots: {},
    spells: [],
    features: [],
    inventory: { coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }, items: [] },
    background: { name: "", feature: { name: "", desc: "" } },
    notes: "",
    color,
  };
}

/** A new sheet from the switcher: blank, plus the entries almost every sheet starts with. */
export function starterSheet(kind: SheetKind, color?: string): Sheet {
  const sheet = blankSheet(kind, color);
  if (kind === "character")
    sheet.actions.push(newAction({ name: "Unarmed Strike", range: "Melee · 5 ft", hit: { ab: "str", prof: true, flat: 0 }, dmg: [damage(0, 4, "str", 1, "bludgeoning")] }));
  sheet.features.push(newFeature({ name: "Walking Speed: 30 ft." }));
  return sheet;
}
