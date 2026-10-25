// Character data. A sheet stores choices only; every derived number (modifiers, saves, DCs) is computed by lib/rules.
export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";
/** Ability modifier added to a roll: one of the six, the sheet's spellcasting ability ("sc"), or none (""). */
export type ModSource = AbilityKey | "sc" | "";
export type Activation = "A" | "BA" | "R" | "—" | "1M" | "10M" | "1H" | "8H" | "12H" | "24H";
export type Recharge = "SR" | "LR" | "5–6" | "—";
/** 0 = not proficient, 1 = proficient, 2 = expertise. */
export type ProfLevel = 0 | 1 | 2;
export type SheetKind = "character" | "creature";
/** The edition a sheet follows; it picks which SRD lists the sheet adds spells and items from. */
export type Rules = "2014" | "2024";
/** A magic item's rarity; "" is an item that isn't magic. */
export type Rarity = "" | "common" | "uncommon" | "rare" | "very rare" | "legendary" | "artifact";

export interface Ability {
  score: number;
  save: boolean;
}

export interface DamagePart {
  n: number;
  d: number;
  ab: ModSource;
  flat: number;
  type: string;
}

export interface Uses {
  max: number;
  used: number;
  recharge: Recharge;
}

export interface Action {
  id: string;
  name: string;
  act: Activation;
  range: string;
  hit: { ab: ModSource; prof: boolean; flat: number } | null;
  /** DC is computed from `ab` unless `dc` overrides it. */
  save: { ab: ModSource; dc: number | null; target: AbilityKey } | null;
  dmg: DamagePart[];
  uses: Uses | null;
  desc: string;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  act: Activation;
  range: string;
  conc: boolean;
  ritual: boolean;
  hit: boolean;
  save: { target: AbilityKey } | null;
  dmg: DamagePart[];
  desc: string;
}

export interface Feature {
  id: string;
  name: string;
  uses: Uses | null;
  desc: string;
}

export interface Item {
  id: string;
  qty: number;
  name: string;
  wt: number;
  /** Value of one, in gold pieces (loot, valuables, costly spell components). */
  cost: number;
  rarity: Rarity;
  /** Requires attunement (magic items only); `attuned` is whether the character is attuned to it now. */
  attune: boolean;
  attuned: boolean;
  desc: string;
  /** The id of the inventory category it sits in; one that no longer exists means the first category. */
  cat: string;
}

/** A group in the inventory ("Equipment", "Backpack"); `collapsed` is kept with the sheet. */
export interface ItemCategory {
  id: string;
  name: string;
  collapsed: boolean;
}

export interface Background {
  name: string;
  feature: { name: string; desc: string };
  traits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  allies?: string;
  appearance?: string;
  backstory?: string;
}

export interface Sheet {
  id: string;
  kind: SheetKind;
  rules: Rules;
  name: string;
  subtitle: string;
  hp: { cur: number; max: number; temp: number };
  ac: number;
  prof: number;
  death: { s: number; f: number };
  abilities: Record<AbilityKey, Ability>;
  skills: Record<string, ProfLevel>;
  actions: Action[];
  /** `shortRest`: spell slots also come back on a short rest (a warlock's Pact Magic). */
  spellcasting: { ab: AbilityKey; atk: number; dc: number; shortRest: boolean } | null;
  slots: Record<string, { max: number; used: number }>;
  spells: Spell[];
  features: Feature[];
  inventory: { coins: { cp: number; sp: number; ep: number; gp: number; pp: number }; categories: ItemCategory[]; items: Item[] };
  background: Background;
  notes: string;
  /** Identity colour for avatars on roll cards; kept off the semantic hues. */
  color: string;
}

export interface Library {
  schemaVersion: number;
  sheets: Sheet[];
  activeId: string | null;
}
