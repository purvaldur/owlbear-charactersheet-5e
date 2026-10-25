// The guided setup's SRD data (public/srd/setup-*.json, from scripts/open5e/setup.mjs) and what the user picks in it.
import type { AbilityKey, Action, Recharge, Rules } from "../model/types";

/** skill, expertise (from skills already proficient), tool, language, ability (+1 each), proficiency (skill or tool),
 * feat (by name), option (one of `options`), spell (from the SRD spell list, by `spell`), or casting (the spellcasting
 * ability for spells a feat or species gives). */
export type ChoiceKind = "skill" | "expertise" | "tool" | "language" | "ability" | "proficiency" | "feat" | "option" | "spell" | "casting";
export type Caster = "full" | "half" | "half2024" | "pact";

/**
 * Limited uses as the setup works them out for the character's level: a fixed `max`, one by level (`byLevel`), so many
 * per level (`perLevel`: Lay on Hands' pool), the proficiency bonus, or an ability's modifier (plus `bonus`), at least 1.
 */
export interface UsesSpec {
  recharge: Recharge;
  /** A different recharge from a level on (Bardic Inspiration on a short rest from 5). */
  rechargeByLevel?: [level: number, recharge: Recharge][];
  max?: number;
  byLevel?: [level: number, max: number][];
  perLevel?: number;
  perProf?: boolean;
  ability?: AbilityKey;
  bonus?: number;
}

/**
 * An action a grant or class feature adds (a breath weapon, Second Wind): dice that grow in number (`scale`) or size
 * (`dieScale`) with level, the level added to the damage (`flatLevel`), and uses worked out for the level.
 */
export type SetupAction = Omit<Action, "id" | "uses"> & {
  uses: UsesSpec | null;
  scale?: [level: number, dice: number][];
  dieScale?: [level: number, die: number][];
  flatLevel?: boolean;
};

/** What a class feature brings beyond its text: limited uses, actions. */
export interface FeatureExtra {
  uses?: UsesSpec;
  actions?: SetupAction[];
}

export interface Grant {
  skills?: string[];
  saves?: AbilityKey[];
  armor?: string[];
  weapons?: string[];
  tools?: string[];
  languages?: string[];
  speed?: number;
  hpPerLevel?: number;
  abilities?: Partial<Record<AbilityKey, number>>;
  actions?: SetupAction[];
  /** Spells it gives, by name, each from a character level (a tiefling's Darkness at 5). */
  spells?: [name: string, level: number][];
  /** The spellcasting ability for those spells, when nothing chooses it and the class has none. */
  casting?: AbilityKey;
  /** Armor Class without armor (Unarmored Defense): `base` plus the `add` abilities' modifiers, and whether a shield adds. */
  unarmored?: { base: number; add: AbilityKey[]; shield: boolean };
}

export interface SetupFeature {
  name: string;
  desc: string;
  /** The class level it comes at; species and background features have none. */
  level?: number;
}

export interface Option {
  name: string;
  desc: string;
  grants?: Grant;
  choices?: Choice[];
  features?: SetupFeature[];
}

export interface Choice {
  id: string;
  label: string;
  kind: ChoiceKind;
  count: number;
  /** A list to pick from, "any" (every skill, tool or language), "proficient" (expertise), "options" or "spells". */
  from: string[] | "any" | "proficient" | "options" | "spells";
  /** The class level it comes at. */
  level?: number;
  options?: Option[];
  /** For a spell choice: the spell level, and the class list it comes from. */
  spell?: { level: number; list: string };
  /** An option choice a feat answers in its own name: "Magic Initiate (Cleric)" has picked Cleric. */
  fixedBy?: "parenthetical";
  /** An option choice whose pick needs no feature of its own (the feat's feature says it). */
  noFeature?: boolean;
}

export interface SetupEntry {
  name: string;
  desc: string;
  features: SetupFeature[];
  grants: Grant;
  choices: Choice[];
}

export interface EquipmentItem {
  name: string;
  qty: number;
  /** The SRD item it is, by name, or null for one the SRD doesn't list ("any simple weapon"). */
  srd: string | null;
}
/** One choice of starting equipment: (a) or (b), or A, B or C. A group with one option is given as it is. */
export interface EquipmentGroup {
  options: { label: string; items: EquipmentItem[]; gp: number }[];
}

export interface SetupSpecies extends SetupEntry {
  subspecies: SetupEntry[];
}
export interface SetupClass extends SetupEntry {
  hitDie: number;
  caster: Caster | null;
  castingAbility: AbilityKey | null;
  subclassLevel: number;
  equipment: EquipmentGroup[];
  subclasses: SetupEntry[];
  /** Uses and actions for its features, by feature name. */
  featureExtras?: Record<string, FeatureExtra>;
}
export interface SetupBackground extends SetupEntry {
  /** 2024: the three abilities its increases go to (+2 and +1, or +1 to each). */
  abilityChoice?: AbilityKey[];
  /** 2024: the feat it grants ("Magic Initiate (Cleric)"). */
  feat?: string;
  equipment: EquipmentGroup[];
}
export interface SetupFeat {
  name: string;
  type: string;
  desc: string;
  choices: Choice[];
}

export interface SrdSetup {
  rules: Rules;
  /** The languages a "language of your choice" picks from, and the tools (vehicles included) a tool choice does. */
  languages: string[];
  tools: string[];
  /** What every character gets or chooses (2024: Common and two more languages). */
  general: { grants: Grant; choices: Choice[] };
  species: SetupSpecies[];
  classes: SetupClass[];
  backgrounds: SetupBackground[];
  feats: SetupFeat[];
}

export type ScoreMethod = "array" | "pointbuy" | "manual";

/** Everything the guided setup asks; null is a step left as Custom, named (or not) by its `custom…` field. */
export interface SetupPicks {
  name: string;
  rules: Rules;
  species: string | null;
  subspecies: string | null;
  class: string | null;
  level: number;
  subclass: string | null;
  background: string | null;
  /** Names for what the SRD doesn't have, used when the step is Custom. */
  customSpecies: string;
  customClass: string;
  customSubclass: string;
  customBackground: string;
  method: ScoreMethod;
  /** Scores before any increases. */
  scores: Record<AbilityKey, number>;
  /** 2024: the background's increases, +2/+1 or +1/+1/+1. */
  increases: Partial<Record<AbilityKey, number>>;
  /** Picks for each choice, by its key (see `activeChoices`): skill names, tools, languages, abilities or an option name. */
  choices: Record<string, string[]>;
  /** The option picked in each equipment group, by "class/0", "background/1" and so on. */
  equipment: Record<string, number>;
}
