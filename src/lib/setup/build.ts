// The guided setup's picks as a character sheet. Pure: the setup popover shows what this would make and sends the result.
// The sheet keeps no class or level to act on later; everything here becomes ordinary sheet data.
import { ABILITIES, SKILLS, damage, newAction, newFeature, newItem, starterSheet } from "../model/defaults";
import { itemFromSrd, type SrdItem } from "../model/srd";
import type { AbilityKey, Sheet } from "../model/types";
import { mod } from "../rules";
import { profByLevel, slotsFor } from "./tables";
import type { Choice, Grant, SetupAction, SetupClass, SetupEntry, SetupPicks, SetupSpecies, SrdSetup, UsesSpec } from "./types";

/** A choice as the setup asks it: `key` keeps picks apart (two "Skill proficiencies" from different steps). */
export interface ActiveChoice {
  key: string;
  choice: Choice;
  /** Where it comes from, for its heading: "Dwarf", "Fighter", "Background". */
  source: string;
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
  const add = (prefix: string, source: string, choices: Choice[]) => {
    for (const choice of choices) {
      if (choice.level && choice.level > p.level) continue;
      const key = `${prefix}/${choice.id}`;
      out.push({ key, choice, source });
      for (const picked of p.choices[key] ?? []) {
        if (choice.kind === "option") add(`${key}/${picked}`, picked, choice.options?.find((o) => o.name === picked)?.choices ?? []);
        if (choice.kind === "feat") add(`${key}/${picked}`, picked, findFeat(setup, picked)?.choices ?? []);
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
  if (feat) add(`feat/${feat.name}`, feat.name, feat.choices);
  return out;
}

/** What a choice can pick from. */
export function choiceFrom(setup: SrdSetup, choice: Choice, proficient: string[] = []): string[] {
  if (choice.kind === "option") return (choice.options ?? []).map((o) => o.name);
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
  for (const { key, choice } of active)
    if (choice.kind === "option") for (const name of p.choices[key] ?? []) grants.push(choice.options?.find((o) => o.name === name)?.grants);
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
  for (const { key, choice } of active)
    if (choice.kind === "skill" || choice.kind === "proficiency") union(skills, (p.choices[key] ?? []).filter((s) => skillKey(s)));
  return SKILLS.map(([, l]) => l).filter((l) => skills.some((s) => s.toLowerCase() === l.toLowerCase()));
}

/** Scores with every increase applied (species, the abilities picked to +1, the background's), at most 20. */
export function finalScores(setup: SrdSetup, p: SetupPicks): Record<AbilityKey, number> {
  const active = activeChoices(setup, p);
  const out = { ...p.scores };
  const bump = (k: AbilityKey, n: number) => (out[k] = Math.min(20, (out[k] ?? 10) + n));
  for (const g of grantsOf(setup, p, active)) for (const [k, n] of Object.entries(g.abilities ?? {})) bump(k as AbilityKey, n ?? 0);
  for (const { key, choice } of active) if (choice.kind === "ability") for (const k of p.choices[key] ?? []) bump(k as AbilityKey, 1);
  if (chosen(setup, p).background?.abilityChoice) for (const [k, n] of Object.entries(p.increases)) bump(k as AbilityKey, n ?? 0);
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
  return { max: Math.min(100, Math.max(1, max)), used: 0, recharge: spec.recharge };
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

export function buildCharacter(setup: SrdSetup, p: SetupPicks, items: SrdItem[]): Sheet {
  const c = chosen(setup, p);
  const active = activeChoices(setup, p);
  const grants = grantsOf(setup, p, active);
  const picks = (kind: Choice["kind"]) => active.filter((a) => a.choice.kind === kind).flatMap((a) => p.choices[a.key] ?? []);
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
  for (const label of picks("expertise")) if (skillKey(label)) sheet.skills[skillKey(label)!] = 2;

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
  for (const { key, choice } of active) {
    if (choice.kind !== "option") continue;
    for (const name of p.choices[key] ?? []) {
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

  // Spellcasting: the ability and slots; spells are added afterwards from the SRD spell list.
  if (c.klass?.caster && c.klass.castingAbility) {
    sheet.spellcasting = { ab: c.klass.castingAbility, atk: 0, dc: 0, shortRest: c.klass.caster === "pact" };
    sheet.slots = slotsFor(c.klass.caster, level);
  }

  // Starting equipment, into the first category, and its gold.
  const cat = sheet.inventory.categories[0]!.id;
  const groups = [
    ...(c.klass?.equipment ?? []).map((g, i) => [`class/${i}`, g] as const),
    ...(c.background?.equipment ?? []).map((g, i) => [`background/${i}`, g] as const),
  ];
  for (const [key, g] of groups) {
    const o = g.options[p.equipment[key] ?? 0];
    if (!o) continue;
    sheet.inventory.coins.gp += o.gp;
    for (const it of o.items) {
      const srd = it.srd ? items.find((x) => x.name === it.srd) : undefined;
      sheet.inventory.items.push(srd ? { ...itemFromSrd(srd, cat), name: it.name, qty: it.qty } : newItem({ name: it.name, qty: it.qty, cat }));
    }
  }

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
