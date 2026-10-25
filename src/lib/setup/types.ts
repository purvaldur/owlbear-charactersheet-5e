// The guided setup's SRD data (public/srd/setup-*.json, from scripts/open5e/setup.mjs) and what the user picks in it.
import type { AbilityKey, Action, Rules } from "../model/types";

/** skill, expertise (from skills already proficient), tool, language, ability (+1 each), proficiency (skill or tool),
 * feat (by name) or option (one of `options`). */
export type ChoiceKind = "skill" | "expertise" | "tool" | "language" | "ability" | "proficiency" | "feat" | "option";
export type Caster = "full" | "half" | "half2024" | "pact";

/** An action a grant adds (a dragonborn's breath weapon): dice that grow with level, uses that equal proficiency. */
export type SetupAction = Omit<Action, "id"> & { scale?: [level: number, dice: number][]; usesPerProf?: boolean };

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
  /** A list to pick from, "any" (every skill, tool or language), "proficient" (expertise) or "options". */
  from: string[] | "any" | "proficient" | "options";
  /** The class level it comes at. */
  level?: number;
  options?: Option[];
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

/** Everything the guided setup asks; null is a step left blank. */
export interface SetupPicks {
  name: string;
  species: string | null;
  subspecies: string | null;
  class: string | null;
  level: number;
  subclass: string | null;
  background: string | null;
  /** The name of a background the SRD doesn't have, when `background` is null. */
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
