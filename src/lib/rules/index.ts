// The arithmetic the sheet can derive. The Codex is freeform, with no class or level engine. Pure functions only.
import { ABILITY, SKILLS } from "../model/defaults";
import type { AbilityKey, Action, DamagePart, Feature, ModSource, Sheet, Spell } from "../model/types";

export const mod = (score: number) => Math.floor(((Number.isFinite(score) ? score : 10) - 10) / 2);
export const signed = (n: number) => (n < 0 ? "−" : "+") + Math.abs(n);

export const prof = (sh: Sheet) => sh.prof || 0;

export function abMod(sh: Sheet, k: ModSource): number {
  if (k === "sc") return sh.spellcasting ? mod(sh.abilities[sh.spellcasting.ab].score) : 0;
  return k ? mod(sh.abilities[k].score) : 0;
}

export const saveMod = (sh: Sheet, k: AbilityKey) => abMod(sh, k) + (sh.abilities[k].save ? prof(sh) : 0);

export function skillAbility(key: string): AbilityKey {
  const s = SKILLS.find((x) => x[0] === key);
  if (!s) throw new Error(`Unknown skill ${key}`);
  return s[2];
}
export const skillMod = (sh: Sheet, key: string) => abMod(sh, skillAbility(key)) + prof(sh) * (sh.skills[key] ?? 0);
export const passive = (sh: Sheet, key: string) => 10 + skillMod(sh, key);

export const spellAttack = (sh: Sheet) => abMod(sh, "sc") + prof(sh) + (sh.spellcasting?.atk ?? 0);
export const spellDC = (sh: Sheet) => 8 + abMod(sh, "sc") + prof(sh) + (sh.spellcasting?.dc ?? 0);

export const partBonus = (sh: Sheet, p: DamagePart) => abMod(sh, p.ab) + (p.flat || 0);
/** "1d8+4", or just the bonus when the part has no dice. */
export function partText(sh: Sheet, p: DamagePart): string {
  const b = partBonus(sh, p);
  if (!p.n) return String(b);
  return `${p.n}d${p.d}${b ? (b > 0 ? "+" : "−") + Math.abs(b) : ""}`;
}
export const isHealing = (parts: { type: string }[]) => parts.length > 0 && parts.every((p) => p.type === "healing");
/** The distinct damage types of some parts, untyped ones left out. */
export const damageTypes = (parts: { type: string }[]) => [...new Set(parts.map((p) => p.type).filter(Boolean))];

export type ItemKind = "action" | "spell" | "feature";
export interface RollInfo {
  hit: number | null;
  dc: number | null;
  target?: AbilityKey;
  dmg: DamagePart[];
}

/** Everything a roll of this item needs: to-hit bonus, save DC and target, damage parts. */
export function rollInfo(sh: Sheet, it: Action | Spell | Feature, kind: ItemKind): RollInfo {
  if (kind === "feature") return { hit: null, dc: null, dmg: [] };
  if (kind === "spell") {
    const s = it as Spell;
    return {
      hit: s.hit && sh.spellcasting ? spellAttack(sh) : null,
      dc: s.save && sh.spellcasting ? spellDC(sh) : null,
      target: s.save?.target,
      dmg: s.dmg,
    };
  }
  const a = it as Action;
  return {
    hit: a.hit ? abMod(sh, a.hit.ab) + (a.hit.prof ? prof(sh) : 0) + (a.hit.flat || 0) : null,
    dc: a.save ? (a.save.dc ? a.save.dc : 8 + prof(sh) + abMod(sh, a.save.ab)) : null,
    target: a.save?.target,
    dmg: a.dmg,
  };
}

/** The effects line under a row's name, as segments: numbers are lifted, the range travels as one unit. */
export interface EffectSegment {
  strong: string;
  rest: string;
}
export function effects(sh: Sheet, it: Action | Spell, kind: "action" | "spell"): { fx: EffectSegment[]; range: string } {
  const i = rollInfo(sh, it, kind);
  const fx: EffectSegment[] = [];
  if (i.hit != null) fx.push({ strong: signed(i.hit), rest: "to hit" });
  if (i.dmg.length) {
    fx.push({ strong: i.dmg.map((p) => partText(sh, p)).join(" + "), rest: isHealing(i.dmg) ? "healing" : damageTypes(i.dmg).join(" and ") });
  }
  if (i.dc != null && i.target) fx.push({ strong: `DC ${i.dc}`, rest: ABILITY[i.target].short });
  const spell = kind === "spell" ? (it as Spell) : null;
  const range = [...(it.range ? [it.range] : []), spell?.conc ? "concentration" : "", spell?.ritual ? "ritual" : ""]
    .filter(Boolean)
    .join(" · ");
  return { fx, range };
}

// ---------- Hit points ----------
export interface Hp {
  cur: number;
  max: number;
  temp: number;
}
/** Damage spends temp HP first; healing never exceeds max. Returns a new value. */
export function applyDamage(hp: Hp, n: number): Hp {
  const fromTemp = Math.min(hp.temp, n);
  return { ...hp, temp: hp.temp - fromTemp, cur: Math.max(0, hp.cur - (n - fromTemp)) };
}
export const applyHeal = (hp: Hp, n: number): Hp => ({ ...hp, cur: Math.min(hp.max, hp.cur + n) });

/** "7" or "-7" is damage, "+7" is healing (the HP panel's Enter behaviour). */
export function parseHpDelta(v: string): { n: number; op: "dmg" | "heal" } {
  const t = String(v).trim();
  return { n: Math.abs(parseInt(t, 10)) || 0, op: t.startsWith("+") ? "heal" : "dmg" };
}

export function hpHint(hp: Hp, op: "dmg" | "heal", n: number): string {
  if (!n) return "Enter takes damage. Start with + to heal. Temp HP absorbs damage first.";
  if (op === "dmg") {
    const after = applyDamage(hp, n);
    const absorbed = hp.temp - after.temp;
    return `Enter: ${n} damage, ${hp.cur} → ${after.cur}${absorbed ? ` (temp absorbs ${absorbed})` : ""}`;
  }
  return `Enter: heal ${n}, ${hp.cur} → ${applyHeal(hp, n).cur}`;
}

export const hpState = (hp: Hp) => {
  const pct = hp.max ? (hp.cur / hp.max) * 100 : 0;
  return pct <= 25 ? "low" : pct <= 50 ? "mid" : "ok";
};

// ---------- Death saves ----------
export interface DeathResult {
  death: { s: number; f: number };
  revived: boolean;
  pass: boolean;
  text: string;
}
export function deathSave(death: { s: number; f: number }, roll: number): DeathResult {
  let { s, f } = death;
  let revived = false;
  let pass: boolean;
  let text: string;
  if (roll === 20) {
    revived = true;
    s = 0;
    f = 0;
    pass = true;
    text = "Natural 20: back up with 1 HP";
  } else if (roll === 1) {
    f = Math.min(3, f + 2);
    pass = false;
    text = "Natural 1: two failures";
  } else if (roll >= 10) {
    s = Math.min(3, s + 1);
    pass = true;
    text = "Success";
  } else {
    f = Math.min(3, f + 1);
    pass = false;
    text = "Failure";
  }
  if (!revived && s >= 3) text += ". Stable";
  if (f >= 3) text += ". Dead";
  return { death: { s, f }, revived, pass, text };
}

// ---------- Rests ----------
/** Restores uses that recharge on this rest; a long rest also restores HP, slots and death saves. Mutates the sheet. */
export function rest(sh: Sheet, kind: "SR" | "LR"): void {
  const restores = (r: string) => r === "SR" || (kind === "LR" && r === "LR");
  for (const it of [...sh.actions, ...sh.features]) if (it.uses && restores(it.uses.recharge)) it.uses.used = 0;
  if (kind === "LR") {
    for (const s of Object.values(sh.slots)) s.used = 0;
    sh.hp.cur = sh.hp.max;
    sh.hp.temp = 0;
    sh.death = { s: 0, f: 0 };
  }
}
