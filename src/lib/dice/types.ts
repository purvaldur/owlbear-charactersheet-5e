import type { AbilityKey } from "../model/types";
import type { Role } from "../obr/adapter";

export type RollMode = "normal" | "adv" | "dis";
export type Visibility = "public" | "gm";

/** What to roll, before any dice land. Bonuses are already resolved against the sheet. */
export interface RollIntent {
  title: string;
  /** A d20 roll (attack, check, save, death save). */
  d20?: { mod: number; mode: RollMode; label: "to hit" | "check" | "save" | "death save" };
  parts: { n: number; d: number; bonus: number; type: string }[];
  save?: { target: AbilityKey; dc: number };
  desc?: string;
}

/** Raw dice for one intent: the d20s (one, or two with advantage/disadvantage) and each part's dice. */
export interface DiceOutcome {
  d20?: number[];
  parts: number[][];
}

export interface D20Result {
  rolls: number[];
  kept: number;
  nat: number;
  mode: RollMode;
  mod: number;
  total: number;
  label: string;
}
export interface PartResult {
  n: number;
  d: number;
  rolls: number[];
  bonus: number;
  total: number;
  type: string;
}
export interface Reply {
  sheetId: string;
  who: string;
  color: string;
  d20: D20Result;
  pass: boolean;
}

/** One roll card in the table log. Travels over broadcast, so it holds plain data only. */
export interface RollEntry {
  id: string;
  t: number;
  sheetId: string;
  who: string;
  color: string;
  player: string;
  playerId: string;
  /** The roller's role; missing on cards from versions before 2.1.1. */
  role?: Role;
  title: string;
  vis: Visibility;
  d20?: D20Result;
  dmg?: PartResult[];
  save?: { target: AbilityKey; dc: number };
  result?: { pass: boolean; text: string };
  desc?: string;
  showDesc?: boolean;
  replies: Reply[];
  note?: string;
  /** What this roll spent, so its card can offer Undo. */
  spent?: { level: number; left: number };
  used?: { itemId: string; left: number };
}
