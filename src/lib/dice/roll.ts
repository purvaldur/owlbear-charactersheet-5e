// Builds roll intents from a sheet, and turns rolled dice into a roll card. Side effects (slots, uses) live in the store.
import { ABILITY, SKILLS } from "../model/defaults";
import type { AbilityKey, Action, Sheet, Spell } from "../model/types";
import { abMod, damageTypes, partBonus, rollInfo, saveMod, skillMod } from "../rules";
import { d20Result, isCrit, partResults } from "./roller";
import type { DiceOutcome, RollEntry, RollIntent, RollMode, Visibility } from "./types";
import type { Role } from "../obr/adapter";

/** A row is one roll target: to-hit, damage and the save DC all come from one click. */
export function intentForItem(sh: Sheet, it: Action | Spell, kind: "action" | "spell", mode: RollMode): RollIntent {
  const info = rollInfo(sh, it, kind);
  return {
    title: it.name,
    d20: info.hit != null ? { mod: info.hit, mode, label: "to hit" } : undefined,
    parts: info.dmg.map((p) => ({ n: p.n, d: p.d, bonus: partBonus(sh, p), type: p.type })),
    save: info.dc != null && info.target ? { target: info.target, dc: info.dc } : undefined,
    desc: it.desc || undefined,
  };
}

export const intentForCheck = (sh: Sheet, ab: AbilityKey, mode: RollMode): RollIntent => ({
  title: `${ABILITY[ab].long} check`,
  d20: { mod: abMod(sh, ab), mode, label: "check" },
  parts: [],
});

export const intentForSave = (sh: Sheet, ab: AbilityKey, mode: RollMode): RollIntent => ({
  title: `${ABILITY[ab].long} save`,
  d20: { mod: saveMod(sh, ab), mode, label: "save" },
  parts: [],
});

export function intentForSkill(sh: Sheet, key: string, mode: RollMode): RollIntent {
  const name = SKILLS.find((s) => s[0] === key)?.[1] ?? key;
  return { title: name, d20: { mod: skillMod(sh, key), mode, label: "check" }, parts: [] };
}

/** Death saves are flat d20s: no modifier, no advantage. */
export const intentForDeathSave = (): RollIntent => ({ title: "Death save", d20: { mod: 0, mode: "normal", label: "death save" }, parts: [] });

export const intentForDice = (n: number, d: number, flat = 0): RollIntent => ({
  title: `${n}d${d}${flat ? (flat > 0 ? "+" : "") + flat : ""}`,
  parts: [{ n, d, bonus: flat, type: "" }],
});

export interface Roller {
  sheet: Pick<Sheet, "id" | "name" | "color">;
  player: string;
  playerId: string;
  role?: Role;
  vis: Visibility;
}

/** Whether an intent has any dice to roll; a save-only or empty action has none, and Dice+ refuses an empty notation. */
export const hasDice = (intent: RollIntent) => !!intent.d20 || intent.parts.some((p) => p.n > 0);

/** Whether an intent's to-hit came up a natural 20, so the follow-up crit dice should be rolled. */
export const needsCritDice = (intent: RollIntent, outcome: DiceOutcome) =>
  intent.parts.some((p) => p.n > 0) && isCrit(outcome.d20, intent.d20?.mode, intent.d20?.label);

export function entryFrom(intent: RollIntent, outcome: DiceOutcome, by: Roller, id: string = crypto.randomUUID()): RollEntry {
  const d20 = intent.d20 && outcome.d20 ? d20Result(outcome.d20, intent.d20.mode, intent.d20.mod, intent.d20.label) : undefined;
  const dmg = intent.parts.length ? partResults(intent, outcome.parts) : undefined;
  const nothingRolled = !d20 && !dmg && !intent.save;
  return {
    id,
    t: Date.now(),
    sheetId: by.sheet.id,
    who: by.sheet.name,
    color: by.sheet.color,
    player: by.player,
    playerId: by.playerId,
    role: by.role,
    title: intent.title,
    vis: by.vis,
    d20,
    dmg,
    save: intent.save,
    desc: intent.desc,
    showDesc: nothingRolled || undefined,
    replies: [],
  };
}

/** Plain-text summary for toasts: "Rapier: 20 to hit · 10 piercing". */
export function summary(en: RollEntry): string {
  const bits: string[] = [];
  if (en.d20) {
    const flag = en.d20.label === "to hit" && en.d20.nat === 20 ? " (critical)" : en.d20.nat === 1 ? " (natural 1)" : "";
    bits.push(`${en.d20.total} ${en.d20.label}${flag}`);
  }
  if (en.dmg?.length) {
    const total = en.dmg.reduce((s, p) => s + p.total, 0);
    const types = damageTypes(en.dmg);
    bits.push(`${total} ${types.length === 1 ? types[0] : "damage"}`);
  }
  if (en.save) bits.push(`${ABILITY[en.save.target].short} save DC ${en.save.dc}`);
  if (en.result) bits.push(en.result.text);
  return bits.length ? `${en.title}: ${bits.join(" · ")}` : en.title;
}
