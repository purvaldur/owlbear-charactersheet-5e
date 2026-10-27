// The guided setup's picks as a character sheet. Pure: the setup popover shows what this would make and sends the result.
// The sheet keeps no class or level to act on later; everything here becomes ordinary sheet data.
import { ABILITIES, SKILLS, damage, newAction, newFeature, newItem, starterSheet } from "../model/defaults";
import { itemFromSrd, spellFromSrd, type SrdItem, type SrdSpell } from "../model/srd";
import type { AbilityKey, Item, Sheet } from "../model/types";
import { mod } from "../rules";
import { profByLevel, slotsFor } from "./tables";
import type { Choice, Grant, SetupAction, SetupClass, SetupEntry, SetupPicks, SetupSpecies, SrdSetup, UsesSpec } from "./types";

/** A choice as the setup asks it: `key` keeps picks apart (two "Skill proficiencies" from different steps). */
export interface ActiveChoice {
  key: string;
  choice: Choice;
  /** Where it comes from, for its heading: "Dwarf", "Fighter", "Background". */
  source: string;
  /** Answered already, so not asked: the Cleric list of a background's "Magic Initiate (Cleric)". */
  given?: string[];
  /** What counts as picked: its given answer, or the user's picks that this choice still allows, at most `count`. */
  picked: string[];
}

/** What's picked for a choice (see ActiveChoice.picked). */
export const pickedIn = (_p: SetupPicks, a: ActiveChoice) => a.picked;

/** Whether a feat says it can be taken more than once (Skilled; Magic Initiate, with another spell list). */
const repeatable = (setup: SrdSetup, name: string) => /more than once/i.test(findFeat(setup, name)?.desc ?? "");
const featBase = (name: string) => name.replace(/\s*\(.*\)$/, "");

/**
 * Why a value can't be picked for a choice, or null when it can: a feat the background gives already (unless it can be
 * taken again), or a Magic Initiate spell list the background's Magic Initiate has.
 */
export function blocked(setup: SrdSetup, p: SetupPicks, choice: Choice, value: string): string | null {
  const bgFeat = chosen(setup, p).background?.feat;
  if (choice.kind === "feat" && bgFeat && featBase(bgFeat) === value && !repeatable(setup, value)) return "Your background gives this feat already";
  if (choice.fixedBy === "parenthetical" && bgFeat?.match(/\((.+)\)$/)?.[1] === value) return "Your background's feat has this list already";
  return null;
}

export interface Chosen {
  species: SetupSpecies | null;
  subspecies: SetupEntry | null;
  klass: SetupClass | null;
  subclass: SetupEntry | null;
  background: SrdSetup["backgrounds"][number] | null;
}

export function chosen(setup: SrdSetup, p: SetupPicks): Chosen {
  const species = setup.species.find((s) => s.name === p.species) ?? null;
  const klass = setup.classes.find((c) => c.name === p.class) ?? null;
  return {
    species,
    subspecies: species?.subspecies.find((s) => s.name === p.subspecies) ?? null,
    klass,
    // A subclass picked for a higher level is dropped when the level goes below its class's subclass level.
    subclass: klass && p.level >= klass.subclassLevel ? (klass.subclasses.find((s) => s.name === p.subclass) ?? null) : null,
    background: setup.backgrounds.find((b) => b.name === p.background) ?? null,
  };
}

/** A feat by the name a background gives it ("Magic Initiate (Cleric)" is Magic Initiate). */
export const findFeat = (setup: SrdSetup, name: string) => setup.feats.find((f) => f.name === name.replace(/\s*\(.*\)$/, "")) ?? null;

/**
 * Every choice the picks so far ask for, in the order the setup shows them: the general ones (2024 languages), species,
 * class and subclass (those that come by the chosen level), background, the feats picked or given, and any choices
 * inside an option picked.
 */
export function activeChoices(setup: SrdSetup, p: SetupPicks): ActiveChoice[] {
  const c = chosen(setup, p);
  const out: ActiveChoice[] = [];
  /** `named` is the feat as given ("Magic Initiate (Cleric)"), which can answer one of its choices. */
  const add = (prefix: string, source: string, choices: Choice[], named = "") => {
    for (const choice of choices) {
      if (choice.level && choice.level > p.level) continue;
      const key = `${prefix}/${choice.id}`;
      const fixed = choice.fixedBy === "parenthetical" ? named.match(/\((.+)\)$/)?.[1] : undefined;
      const given = fixed && choice.options?.some((o) => o.name === fixed) ? [fixed] : undefined;
      // Picks left from an earlier class, species or background (or more than it asks) don't count.
      const from = choice.kind === "expertise" || choice.kind === "spell" ? null : choiceFrom(setup, choice).map((v) => v.toLowerCase());
      const picked = given ?? (p.choices[key] ?? [])
        .filter((v) => (!from || from.includes(v.toLowerCase())) && !blocked(setup, p, choice, v))
        .slice(0, choice.count);
      const a: ActiveChoice = { key, choice, source, picked, ...(given ? { given } : {}) };
      out.push(a);
      for (const picked of pickedIn(p, a)) {
        if (choice.kind === "option") add(`${key}/${picked}`, picked, choice.options?.find((o) => o.name === picked)?.choices ?? []);
        if (choice.kind === "feat") add(`${key}/${picked}`, picked, findFeat(setup, picked)?.choices ?? [], picked);
      }
    }
  };
  add("general", "Every character", setup.general.choices);
  if (c.species) add("species", c.species.name, c.species.choices);
  if (c.subspecies) add("subspecies", c.subspecies.name, c.subspecies.choices);
  if (c.klass) add("class", c.klass.name, c.klass.choices);
  if (c.subclass) add("subclass", c.subclass.name, c.subclass.choices);
  if (c.background) add("background", c.background.name, c.background.choices);
  const feat = c.background?.feat && findFeat(setup, c.background.feat);
  if (feat) add(`feat/${feat.name}`, c.background!.feat!, feat.choices, c.background!.feat!);
  return out;
}

/** What a choice can pick from; a spell choice needs the SRD spells. */
export function choiceFrom(setup: SrdSetup, choice: Choice, proficient: string[] = [], spells: SrdSpell[] = []): string[] {
  if (choice.kind === "option") return (choice.options ?? []).map((o) => o.name);
  if (choice.kind === "spell" && choice.spell) {
    const { level, list } = choice.spell;
    return spells.filter((s) => s.level === level && s.classes.includes(list)).map((s) => s.name).sort();
  }
  if (choice.kind === "casting" && !Array.isArray(choice.from)) return ["int", "wis", "cha"];
  if (choice.from === "proficient") return proficient;
  if (Array.isArray(choice.from)) return choice.from;
  if (choice.kind === "skill") return SKILLS.map(([, label]) => label);
  if (choice.kind === "tool") return setup.tools;
  if (choice.kind === "language") return setup.languages;
  if (choice.kind === "proficiency") return [...SKILLS.map(([, label]) => label), ...setup.tools];
  if (choice.kind === "ability") return ABILITIES.map(([k]) => k);
  return [];
}

/** The grants the picks add up to, from every step and every option or feat picked. */
function grantsOf(setup: SrdSetup, p: SetupPicks, active: ActiveChoice[]): Grant[] {
  const c = chosen(setup, p);
  const grants = [setup.general.grants, c.species?.grants, c.subspecies?.grants, c.klass?.grants, c.subclass?.grants, c.background?.grants];
  for (const a of active)
    if (a.choice.kind === "option") for (const name of pickedIn(p, a)) grants.push(a.choice.options?.find((o) => o.name === name)?.grants);
  return grants.filter((g): g is Grant => !!g);
}

const skillKey = (label: string) => SKILLS.find(([, l]) => l.toLowerCase() === label.toLowerCase())?.[0];
/** Adds to a list, leaving out what it has already (in any case). */
function union(into: string[], more: string[] = []) {
  for (const m of more) if (!into.some((x) => x.toLowerCase() === m.toLowerCase())) into.push(m);
}

/** The skills, tools and languages granted outright (lowercased): what a choice can't pick again. */
export function grantedProficiencies(setup: SrdSetup, p: SetupPicks) {
  const grants = grantsOf(setup, p, activeChoices(setup, p));
  const set = (k: "skills" | "tools" | "languages") => new Set(grants.flatMap((g) => g[k] ?? []).map((s) => s.toLowerCase()));
  return { skills: set("skills"), tools: set("tools"), languages: set("languages") };
}

/** The skills the picks make the character proficient in, before expertise: what expertise picks from. */
export function proficientSkills(setup: SrdSetup, p: SetupPicks): string[] {
  const active = activeChoices(setup, p);
  const skills: string[] = [];
  for (const g of grantsOf(setup, p, active)) union(skills, g.skills);
  for (const a of active)
    if (a.choice.kind === "skill" || a.choice.kind === "proficiency") union(skills, pickedIn(p, a).filter((s) => skillKey(s)));
  return SKILLS.map(([, l]) => l).filter((l) => skills.some((s) => s.toLowerCase() === l.toLowerCase()));
}

/** Scores with every increase applied (species, the abilities picked to +1, the background's), at most 20. */
export function finalScores(setup: SrdSetup, p: SetupPicks): Record<AbilityKey, number> {
  const active = activeChoices(setup, p);
  const out = { ...p.scores };
  // Increases stop at 20, but don't lower a score set higher by hand.
  const bump = (k: AbilityKey, n: number) => (out[k] = Math.max(p.scores[k] ?? 10, Math.min(20, (out[k] ?? 10) + n)));
  for (const g of grantsOf(setup, p, active)) for (const [k, n] of Object.entries(g.abilities ?? {})) bump(k as AbilityKey, n ?? 0);
  for (const a of active) if (a.choice.kind === "ability") for (const k of pickedIn(p, a)) bump(k as AbilityKey, 1);
  // Only on the background's own abilities: increases picked for an earlier background don't count.
  const allowed = chosen(setup, p).background?.abilityChoice ?? [];
  for (const [k, n] of Object.entries(p.increases)) if (allowed.includes(k as AbilityKey)) bump(k as AbilityKey, n ?? 0);
  return out;
}

/** Hit points: the hit die's most at level 1, its average after, Constitution and any per-level bonus every level. */
export function hitPoints(klass: SetupClass, level: number, con: number, perLevel = 0) {
  const each = (n: number) => Math.max(1, n + mod(con) + perLevel);
  return each(klass.hitDie) + (level - 1) * each(Math.floor(klass.hitDie / 2) + 1);
}

/**
 * "<species> <subclass> <class> <level>": "Human Champion Fighter 4". A Custom step shows the name given for it, or
 * "Custom <step>" when it has none, and then the species is set off with a comma ("Human, Custom Subclass Fighter 4").
 * Below its class's subclass level there is no subclass to name ("Human Fighter 2"); a custom class has one only when
 * it is named.
 */
export function subtitle(setup: SrdSetup, p: SetupPicks): string {
  const c = chosen(setup, p);
  const unnamed: string[] = [];
  const named = (srd: string | undefined, custom: string, step: string) => {
    if (srd) return srd;
    if (custom.trim()) return custom.trim();
    unnamed.push(step);
    return `Custom ${step}`;
  };
  const species = named(c.subspecies?.name ?? c.species?.name, p.customSpecies, "Species");
  const klass = named(c.klass?.name, p.customClass, "Class");
  const subclass = c.klass
    ? p.level >= c.klass.subclassLevel ? named(c.subclass?.name, p.customSubclass, "Subclass") : null
    : p.customSubclass.trim() || null;
  const rest = [subclass, klass, String(p.level)].filter(Boolean).join(" ");
  return `${species}${unnamed.length ? "," : ""} ${rest}`;
}

/** Limited uses at a level. */
export function usesAt(spec: UsesSpec, level: number, prof: number, scores: Record<AbilityKey, number>) {
  const byLevel = spec.byLevel && [...spec.byLevel].reverse().find(([at]) => level >= at)?.[1];
  const max = spec.perProf
    ? prof
    : spec.ability
      ? mod(scores[spec.ability]) + (spec.bonus ?? 0)
      : spec.perLevel
        ? spec.perLevel * level
        : (byLevel ?? spec.max ?? 1);
  const recharge = (spec.rechargeByLevel && [...spec.rechargeByLevel].reverse().find(([at]) => level >= at)?.[1]) ?? spec.recharge;
  return { max: Math.min(100, Math.max(1, max)), used: 0, recharge };
}

/** An action as the character has it at a level: its dice, damage and uses scaled. */
function actionAt(a: SetupAction, level: number, prof: number, scores: Record<AbilityKey, number>) {
  const { scale, dieScale, flatLevel, uses, ...rest } = a;
  const at = (table?: [number, number][]) => table && [...table].reverse().find(([l]) => level >= l)?.[1];
  const n = at(scale);
  const d = at(dieScale);
  return newAction({
    ...rest,
    dmg: rest.dmg.map((p) => damage(n ?? p.n, d ?? p.d, p.ab, p.flat + (flatLevel ? level : 0), p.type)),
    uses: uses ? usesAt(uses, level, prof, scores) : null,
  });
}

/** Armor as an SRD item's description gives it: "Medium armor, AC 14 + Dex modifier (max 2)." */
const ARMOR = /^(Light|Medium|Heavy) armor, AC (\d+)( \+ Dex modifier)?( \(max (\d+)\))?/;
const isShield = (i: Item) => /^Shield, \+2 AC|^A shield is made from wood or metal/.test(i.desc);

/**
 * The best Armor Class the character can have with the armor and shield they start with: only armor they are
 * proficient with is worn, a grant's Unarmored Defense counts when it beats the armor, and the shield adds 2 unless
 * that Unarmored Defense rules it out. `worn` names what gives it, for the review.
 */
export const armorClass = (setup: SrdSetup, p: SetupPicks, sheet: Sheet) => bestArmor(sheet, grantsOf(setup, p, activeChoices(setup, p)));

function bestArmor(sheet: Sheet, grants: Grant[]): { ac: number; worn: string[] } {
  const prof = sheet.proficiencies.armor.map((a) => a.toLowerCase());
  const dex = mod(sheet.abilities.dex.score);
  const shield = prof.includes("shields") ? sheet.inventory.items.find(isShield) : undefined;
  const bodies: { ac: number; worn: string[]; shield: boolean }[] = [{ ac: 10 + dex, worn: [], shield: true }];
  for (const g of grants)
    if (g.unarmored) {
      const { base, add, shield: s } = g.unarmored;
      bodies.push({ ac: base + add.reduce((n, k) => n + mod(sheet.abilities[k].score), 0), worn: ["Unarmored Defense"], shield: s });
    }
  for (const i of sheet.inventory.items) {
    const m = ARMOR.exec(i.desc);
    if (!m || !prof.includes(`${m[1]!.toLowerCase()} armor`)) continue;
    const bonus = m[3] ? Math.min(dex, m[5] ? Number(m[5]) : Infinity) : 0;
    bodies.push({ ac: Number(m[2]) + bonus, worn: [i.name], shield: true });
  }
  const withShield = bodies.map((b) => (shield && b.shield ? { ac: b.ac + 2, worn: [...b.worn, shield.name] } : b));
  const best = withShield.reduce((a, b) => (b.ac > a.ac ? b : a));
  return { ac: best.ac, worn: best.worn };
}

/** `items` and `spells` are the rules' SRD lists, for starting equipment and the spells a species or feat gives. */
export function buildCharacter(setup: SrdSetup, p: SetupPicks, items: SrdItem[], spells: SrdSpell[] = []): Sheet {
  const c = chosen(setup, p);
  const active = activeChoices(setup, p);
  const grants = grantsOf(setup, p, active);
  const picks = (kind: Choice["kind"]) => active.filter((a) => a.choice.kind === kind).flatMap((a) => pickedIn(p, a));
  const sheet = starterSheet("character", undefined, setup.rules);
  const level = Math.min(Math.max(p.level, 1), 20);
  const prof = profByLevel(level);
  sheet.name = p.name.trim() || "New character";
  sheet.subtitle = subtitle(setup, p);
  sheet.prof = prof;

  // Scores and saves.
  const scores = finalScores(setup, p);
  for (const [k] of ABILITIES) sheet.abilities[k] = { score: scores[k], save: grants.some((g) => g.saves?.includes(k)) };

  // Skills, then expertise on top.
  for (const label of proficientSkills(setup, p)) sheet.skills[skillKey(label)!] = 1;
  // Expertise only in a skill the character is proficient in (a pick left from earlier may not be one now).
  for (const label of picks("expertise")) if (skillKey(label) && sheet.skills[skillKey(label)!]) sheet.skills[skillKey(label)!] = 2;

  // Proficiencies: what every step grants, and the tools and languages picked.
  const pr = sheet.proficiencies;
  for (const g of grants) {
    union(pr.armor, g.armor);
    union(pr.weapons, g.weapons);
    union(pr.tools, g.tools);
    union(pr.languages, g.languages);
  }
  union(pr.tools, [...picks("tool"), ...picks("proficiency").filter((t) => !skillKey(t))]);
  union(pr.languages, picks("language"));

  // Hit points, from the class.
  const perLevel = grants.reduce((n, g) => n + (g.hpPerLevel ?? 0), 0);
  if (c.klass) {
    const hp = hitPoints(c.klass, level, scores.con, perLevel);
    sheet.hp = { cur: hp, max: hp, temp: 0 };
  }

  // Features: speed first (as a new sheet has it), then species, class and subclass by level, background and feats.
  const speed = [...grants].reverse().find((g) => g.speed)?.speed ?? 30;
  const features = [newFeature({ name: `Walking Speed: ${speed} ft.` })];
  const add = (name: string, desc: string) => !features.some((f) => f.name === name) && features.push(newFeature({ name, desc }));
  for (const e of [c.species, c.subspecies]) for (const f of e?.features ?? []) add(f.name, f.desc);
  for (const a of active) {
    const { choice } = a;
    if (choice.kind !== "option" || choice.noFeature) continue;
    for (const name of pickedIn(p, a)) {
      const o = choice.options?.find((x) => x.name === name);
      if (!o) continue;
      if (o.features?.length) for (const f of o.features) add(f.name, f.desc);
      else add(`${choice.label}: ${o.name}`, o.desc);
    }
  }
  const extras = c.klass?.featureExtras ?? {};
  for (const e of [c.klass, c.subclass])
    for (const f of e?.features ?? []) {
      if ((f.level ?? 1) > level) continue;
      add(f.name, f.desc);
      // What the class gives the feature beyond its text: its uses, and the actions it brings (Second Wind).
      const extra = e === c.klass ? extras[f.name] : undefined;
      if (extra?.uses) features.find((x) => x.name === f.name)!.uses = usesAt(extra.uses, level, prof, scores);
      for (const a of extra?.actions ?? []) sheet.actions.push(actionAt(a, level, prof, scores));
    }
  const feats = [c.background?.feat, ...picks("feat")].filter((f): f is string => !!f);
  for (const name of feats) add(name, findFeat(setup, name)?.desc ?? "");
  sheet.features = features;

  // Actions a species or option grants (a breath weapon), at this level.
  for (const g of grants) for (const a of g.actions ?? []) sheet.actions.push(actionAt(a, level, prof, scores));
  // A monk's Martial Arts strike takes the place of the plain unarmed strike a new sheet has.
  if (sheet.actions.some((a) => a.name.startsWith("Unarmed Strike ("))) sheet.actions = sheet.actions.filter((a) => a.name !== "Unarmed Strike");

  // Spellcasting: the class's ability and slots; its spells are added afterwards from the SRD spell list.
  if (c.klass?.caster && c.klass.castingAbility) {
    sheet.spellcasting = { ab: c.klass.castingAbility, atk: 0, dc: 0, shortRest: c.klass.caster === "pact" };
    sheet.slots = slotsFor(c.klass.caster, level);
  }
  // The spells a species, lineage or feat gives (by character level), and those picked for one; without a casting class,
  // the ability chosen for them (or the one they name) is the sheet's spellcasting ability.
  const named = [...grants.flatMap((g) => (g.spells ?? []).filter(([, at]) => level >= at).map(([n]) => n)), ...picks("spell")];
  for (const n of named) {
    const s = spells.find((x) => x.name.toLowerCase() === n.toLowerCase());
    if (s && !sheet.spells.some((x) => x.name === s.name)) sheet.spells.push(spellFromSrd(s));
  }
  if (sheet.spells.length && !sheet.spellcasting) {
    const ab = (picks("casting")[0] as AbilityKey | undefined) ?? [...grants].reverse().find((g) => g.casting)?.casting ?? "int";
    sheet.spellcasting = { ab, atk: 0, dc: 0, shortRest: false };
  }

  // Starting equipment, into the first category, and its gold.
  const cat = sheet.inventory.categories[0]!.id;
  const groups = [
    ...(c.klass?.equipment ?? []).map((g, i) => [`class/${i}`, g] as const),
    ...(c.background?.equipment ?? []).map((g, i) => [`background/${i}`, g] as const),
  ];
  for (const [key, g] of groups) {
    // An option picked for an earlier class may not be one this class has: then the first.
    const o = g.options[p.equipment[key] ?? 0] ?? g.options[0];
    if (!o) continue;
    sheet.inventory.coins.gp += o.gp;
    for (const it of o.items) {
      const srd = it.srd ? items.find((x) => x.name === it.srd) : undefined;
      sheet.inventory.items.push(srd ? { ...itemFromSrd(srd, cat), name: it.name, qty: it.qty } : newItem({ name: it.name, qty: it.qty, cat }));
    }
  }

  // Armor Class from what they start with, once the gear is in.
  sheet.ac = bestArmor(sheet, grants).ac;

  // Background: its name, and its feature where it has one (2014).
  const bgFeature = c.background?.features[0];
  sheet.background = {
    ...sheet.background,
    name: c.background?.name ?? p.customBackground.trim(),
    feature: bgFeature ? { name: bgFeature.name, desc: bgFeature.desc } : { name: "", desc: "" },
  };
  return sheet;
}

/** Picks to start from: nothing chosen, level 1, the standard array unassigned (all 10s until placed). */
export function blankPicks(rules: SetupPicks["rules"] = "2024"): SetupPicks {
  return {
    name: "",
    rules,
    species: null,
    subspecies: null,
    class: null,
    level: 1,
    subclass: null,
    background: null,
    customSpecies: "",
    customClass: "",
    customSubclass: "",
    customBackground: "",
    method: "array",
    scores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    increases: {},
    choices: {},
    equipment: {},
  };
}
