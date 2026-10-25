// Species, classes (with subclasses), backgrounds and feats from Open5e, for the guided character setup. Open5e has
// their text, but what they grant and what they ask you to choose is mostly prose ("Choose two from Arcana, …", "You can
// speak, read, and write Common and Dwarvish"). That is parsed where the prose is regular; setup_overrides.json, kept
// by hand, fills in the rest (lineages, ancestries, caster types) and corrects Open5e where it is wrong.
import { plain } from "./text.mjs";

const ABILITY = { strength: "str", dexterity: "dex", constitution: "con", intelligence: "int", wisdom: "wis", charisma: "cha" };
export const SKILLS = ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation",
  "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"];
const NUMBER = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twenty: 20 };
/** Traits that become fields (speed, increases, languages) or that no sheet needs (age, size), not features. */
const NOT_FEATURES = /^(ability score increase|speed|languages|age|alignment|size|creature type)$|table$/i;
/** Class features that are tables or proficiency lists rather than features. */
const NOT_CLASS_FEATURES = new Set(["CORE_TRAITS_TABLE", "PROFICIENCIES", "PROFICIENCY_BONUS", "CLASS_TABLE_DATA", "STARTING_EQUIPMENT", "SPELL_SLOTS", "CLASS_FEATURE_OPTION_LIST"]);

// Some Open5e text has words broken by a stray space ("Na ture", "Ar mor", "Ar rows"), and curly apostrophes.
const unbreak = (s) => s.replace(/\b(Na) (ture)\b|\b(Ar) (mor|rows|cane)\b/g, "$1$2$3$4").replace(/’/g, "'");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const count = (word) => NUMBER[String(word).toLowerCase()] ?? (+word || 1);
const abilityKey = (name) => ABILITY[String(name).trim().toLowerCase()];
/** "A, B, and C" / "A and B" / "A, B, or C" → ["A", "B", "C"]. */
const list = (text) => text.replace(/\.$/, "").split(/,\s*(?:and\s+|or\s+)?|\s+(?:and|or)\s+/).map((s) => s.trim()).filter(Boolean);
const skill = (name) => SKILLS.find((s) => s.toLowerCase() === name.trim().toLowerCase());

// ---------- Proficiency prose ----------
function armor(text) {
  const t = text.toLowerCase();
  if (/^none/.test(t)) return [];
  if (/all armor/.test(t)) return ["Light armor", "Medium armor", "Heavy armor", ...(/shield/.test(t) ? ["Shields"] : [])];
  return [...["light", "medium", "heavy"].filter((k) => t.includes(k)).map((k) => `${cap(k)} armor`), ...(/shield/.test(t) ? ["Shields"] : [])];
}

function weapons(text) {
  const t = text.replace(/\s*\([^)]*\)/g, "").trim();
  if (/^none/i.test(t)) return [];
  if (/^simple and martial weapons$/i.test(t)) return ["Simple weapons", "Martial weapons"];
  // "Simple weapons and Martial weapons that have the Finesse or Light property": the second is one entry.
  const some = t.match(/^(simple weapons) and (martial weapons that .+)$/i);
  if (some) return [cap(some[1]), cap(some[2])];
  return list(t).map(cap);
}

/** Tools: some fixed, or a choice from the instruments, artisan's tools or gaming sets the overrides list. */
function tools(text, lists, id) {
  const t = text.trim();
  if (!t || /^none/i.test(t)) return { tools: [] };
  const choose = t.match(/(?:choose\s+)?(\w+)\s+(?:type of |kind of )?(?:musical instrument|artisan|gaming set|of your choice)/i) || /choose|of your choice/i.test(t);
  if (choose) {
    const from = [
      ...(/instrument/i.test(t) ? lists.instruments : []),
      ...(/artisan/i.test(t) ? lists.artisanTools : []),
      ...(/gaming set/i.test(t) ? lists.gamingSets : []),
    ];
    const n = Array.isArray(choose) ? count(choose[1]) : 1;
    return { tools: [], choice: { id, label: "Tool proficiency", kind: "tool", count: n, from: from.length ? from : "any" } };
  }
  return { tools: list(t).map(cap) };
}

/** "Choose two from A, B, and C", "Choose 2: A, B, or C", "Choose any three", "Choose any 3 skills". */
function skillChoice(text, id, label = "Skill proficiencies") {
  const any = text.match(/choose any (\w+)/i);
  if (any) return { id, label, kind: "skill", count: count(any[1]), from: "any" };
  const m = text.match(/choose (\w+)(?: skills)?(?: from|:)\s*(.+)$/i);
  if (!m) return null;
  return { id, label, kind: "skill", count: count(m[1]), from: list(m[2]).map(skill).filter(Boolean) };
}

/** What a trait or a proficiency feature grants or asks for, read from its prose. */
function grantsInProse(text, lists, id) {
  const grants = {};
  const choices = [];
  // "You gain proficiency in two skills of your choice", "…in the Insight, Perception, or Survival skill", "…in the Perception skill".
  let m = text.match(/proficiency (?:in|with) (\w+) skills? of your choice/i);
  if (m) choices.push({ id: `${id}-skills`, label: "Skill proficiencies", kind: "skill", count: count(m[1]), from: "any" });
  else if ((m = text.match(/proficiency in the ([\w ,]+?) skill\b/i))) {
    const named = list(m[1]).map(skill).filter(Boolean);
    if (/\bor\b/.test(m[1]) && named.length > 1) choices.push({ id: `${id}-skill`, label: "Skill proficiency", kind: "skill", count: 1, from: named });
    else grants.skills = named;
  }
  // "proficiency with the battleaxe, handaxe, light hammer, and warhammer" (weapons) or "with heavy armor".
  if ((m = text.match(/proficiency with ([^.]+?)(?:\.|$)/i)) && !/tool|supplies|kit|skill/i.test(m[1])) {
    if (/armor|shield/i.test(m[1])) grants.armor = armor(m[1]);
    else grants.weapons = list(m[1].replace(/^the /i, "")).map(cap);
  }
  // "artisan's tools of your choice: smith's tools, brewer's supplies, or mason's tools"; "artisan's tools (tinker's tools)".
  if ((m = text.match(/tools of your choice: ([^.]+)/i))) choices.push({ id: `${id}-tool`, label: "Tool proficiency", kind: "tool", count: 1, from: list(m[1]).map(cap) });
  else if ((m = text.match(/proficiency with artisan's tools \(([^)]+)\)/i))) grants.tools = [cap(m[1])];
  if (/hit point maximum increases by 1/i.test(text)) grants.hpPerLevel = 1;
  return { grants, choices };
}

// ---------- Equipment ----------
/** "two handaxes" → ["handaxes", 2]; "20 arrows" → ["arrows", 20]; "a holy symbol" → ["holy symbol", 1]. */
function quantity(text) {
  const t = text.replace(/\s*\(if proficient\)/i, "").replace(/^(?:a set of|a pouch containing)\s+/i, "").trim();
  const m = t.match(/^(\d+|a|an|one|two|three|four|five|ten|twenty)\s+(.+)$/i);
  return m ? [m[2].trim(), count(m[1])] : [t, 1];
}

/** SRD items by every name an equipment list might use for them. */
export function itemIndex(items) {
  const index = new Map();
  const add = (key, name) => !index.has(key) && index.set(key, name);
  for (const it of items.filter((i) => !i.rarity)) {
    const n = it.name.toLowerCase().replace(/[’]/g, "'");
    const bare = n.replace(/\s*\(.*$/, "").replace(/\)$/, "").trim();
    add(n, it.name);
    add(bare, it.name);
    // "Clothes, Common" is "common clothes"; "Musical Instrument, Lute" is a "lute"; "Holy Symbol, Amulet" a "holy symbol".
    const parts = bare.split(/,\s*/);
    if (parts.length === 2) {
      add(`${parts[1]} ${parts[0]}`, it.name);
      add(parts[1], it.name);
      add(parts[0], it.name);
    }
    // "Crossbow bolt" is what "20 bolts" means.
    if (it.type === "Ammunition") add(bare.split(" ").at(-1), it.name);
  }
  return index;
}

/**
 * An equipment entry: its name as written ("Light crossbow", not the SRD's "Crossbow, light"), how many, and the SRD
 * item it is, or null. A bundle ("Arrows (20)") counts as one and keeps the SRD's name, which says what's in it.
 */
function resolve(text, index) {
  const [raw, qty] = quantity(unbreak(text));
  const key = raw.toLowerCase().replace(/\s*\(.*\)$/, "");
  for (const k of [key, key.replace(/es$/, ""), key.replace(/s$/, "")]) {
    const srd = index.get(k);
    if (!srd) continue;
    const bundle = srd.match(/\((\d+)\)$/);
    if (bundle && qty % +bundle[1] === 0) return { name: srd, qty: qty / +bundle[1], srd };
    return { name: cap(raw), qty, srd };
  }
  return { name: cap(raw), qty, srd: null };
}

/** One option's list ("Greataxe, 4 Handaxes, Explorer's Pack, and 15 GP") as items and gold. */
function option(label, text, index) {
  let gp = 0;
  const items = [];
  const t = text.replace(/(?:a )?quiver of (\d+) arrows/i, "quiver, $1 arrows").replace(/[;.]\s*$/, "").replace(/[;,]?\s+or$/, "");
  for (const part of t.split(/,\s*(?:and\s+)?|\s+and\s+/).map((s) => s.trim()).filter(Boolean)) {
    const coins = part.match(/(\d+)\s*gp\b/i);
    if (coins) gp += +coins[1];
    else items.push(resolve(part, index));
  }
  return { label, items, gp };
}

/** 2014: a bulleted list, each line its own choice ("(a) a greataxe or (b) any martial melee weapon"). */
function equipment2014(text, index) {
  return plain(text)
    .split("\n")
    .filter((l) => l.startsWith("•"))
    .map((l) => {
      const parts = l.slice(1).split(/,?\s*(?:or\s+)?\(([a-c])\)\s*/).map((s) => s.trim());
      const options = [];
      if (parts.length === 1) options.push(option("", parts[0], index));
      else for (let i = 1; i < parts.length; i += 2) options.push(option(`(${parts[i]})`, parts[i + 1].replace(/,?\s+or$/, ""), index));
      return { options };
    });
}

/** 2024: one choice of whole bundles ("Choose A or B: (A) …; or (B) 75 GP"). */
function equipment2024(text, index) {
  const parts = plain(text).replace(/^.*?:\s*(?=\(A\))/, "").split(/\(([A-C])\)\s*/).map((s) => s.trim());
  const options = [];
  for (let i = 1; i < parts.length; i += 2) options.push(option(parts[i], parts[i + 1], index));
  return options.length ? [{ options }] : [];
}

// ---------- Classes ----------
const features = (fs) =>
  fs
    .filter((f) => !NOT_CLASS_FEATURES.has(f.feature_type))
    .map((f) => ({ name: f.name.trim(), desc: plain(f.desc), level: Math.min(...f.gained_at.map((g) => g.level), 20) }))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

/** The class's proficiencies, from 2014's "**Armor:** …" lines or 2024's "Core Traits" table, as label → text. */
function profLines(c, rules) {
  const f = c.features.find((x) => x.feature_type === (rules === "2014" ? "PROFICIENCIES" : "CORE_TRAITS_TABLE"));
  const lines = {};
  for (const line of unbreak(plain(f?.desc ?? "")).split("\n")) {
    const m = rules === "2014" ? line.match(/^([^:]+):\s*(.*)$/) : line.match(/^([^·]+?)\s*·\s*(.*)$/);
    if (m) lines[m[1].trim().toLowerCase()] = m[2].trim();
  }
  return lines;
}

/** Expertise as a choice at each level the class gains it (Rogue at 1 and 6). */
const expertise = (fs) =>
  fs.filter((f) => f.name === "Expertise").flatMap((f) => f.gained_at.map((g) => g.level)).sort((a, b) => a - b)
    .map((level) => ({ id: `expertise-${level}`, label: `Expertise (level ${level})`, kind: "expertise", count: 2, from: "proficient", level }));

export function klass(c, subs, rules, lists, index) {
  const p = profLines(c, rules);
  const saves = list(p["saving throws"] ?? p["saving throw proficiencies"] ?? "").map(abilityKey).filter(Boolean);
  const tool = tools(p.tools ?? p["tool proficiencies"] ?? "", lists, "class-tools");
  const choices = [skillChoice(p.skills ?? p["skill proficiencies"] ?? "", "class-skills"), tool.choice, ...expertise(c.features)].filter(Boolean);
  const equip = c.features.find((f) => f.feature_type === "STARTING_EQUIPMENT")?.desc;
  const subclasses = subs.map((s) => {
    const fs = features(s.features);
    const extra = fs.filter((f) => /proficienc/i.test(f.name)).map((f) => ({ ...grantsInProse(f.desc, lists, `sub-${f.level}`), level: f.level }));
    return {
      name: s.name.trim(),
      desc: plain(s.desc),
      features: fs,
      grants: Object.assign({}, ...extra.map((e) => e.grants)),
      choices: extra.flatMap((e) => e.choices.map((ch) => ({ ...ch, level: e.level }))),
    };
  });
  return {
    name: c.name.trim(),
    desc: plain(c.desc),
    hitDie: +String(c.hit_dice).replace(/^d/i, ""),
    caster: null,
    castingAbility: null,
    subclassLevel: Math.min(...subclasses.flatMap((s) => s.features.map((f) => f.level)), 20),
    grants: { saves, armor: armor(p.armor ?? p["armor training"] ?? ""), weapons: weapons(p.weapons ?? p["weapon proficiencies"] ?? ""), tools: tool.tools },
    choices,
    features: features(c.features),
    equipment: rules === "2014" ? (equip ? equipment2014(equip, index) : []) : equipment2024(p["starting equipment"] ?? "", index),
    subclasses: subclasses.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

// ---------- Species ----------
export function species(s, rules, lists) {
  const traits = s.traits.map((t) => ({ name: t.name.trim(), desc: unbreak(plain(t.desc)) }));
  const grants = {};
  const choices = [];
  const speed = traits.find((t) => t.name === "Speed")?.desc.match(/(\d+) feet/);
  if (speed) grants.speed = +speed[1];
  const asi = traits.find((t) => t.name === "Ability Score Increase")?.desc ?? "";
  if (/ability scores each increase by 1/i.test(asi)) grants.abilities = Object.fromEntries(Object.values(ABILITY).map((k) => [k, 1]));
  else if (asi) grants.abilities = Object.fromEntries([...asi.matchAll(/(\w+) score increases by (\d)/gi)].map((m) => [abilityKey(m[1]), +m[2]]).filter(([k]) => k));
  const langs = traits.find((t) => /languages?$/i.test(t.name))?.desc ?? "";
  const known = langs.match(/write ([^.]+?)(?:,? and one extra language of your choice)?\./i);
  const named = known ? list(known[1]).filter((l) => /^[A-Z]/.test(l)) : [];
  if (named.length) grants.languages = named;
  if (/one extra language of your choice/i.test(langs)) choices.push({ id: "species-language", label: "Language", kind: "language", count: 1, from: "any" });
  for (const t of traits) {
    const g = grantsInProse(t.desc, lists, `species-${t.name.toLowerCase().replace(/\W+/g, "-")}`);
    for (const [k, v] of Object.entries(g.grants)) grants[k] = Array.isArray(v) ? [...(grants[k] ?? []), ...v] : v;
    choices.push(...g.choices);
  }
  return { name: s.name.trim(), desc: plain(s.desc), features: traits.filter((t) => !NOT_FEATURES.test(t.name)), grants, choices };
}

// ---------- Backgrounds and feats ----------
export function background(b, rules, lists, index) {
  const grants = {};
  const choices = [];
  const out = { name: b.name.trim(), desc: plain(b.desc), features: [], grants, choices, equipment: [] };
  for (const x of b.benefits) {
    const text = unbreak(plain(x.desc));
    if (x.type === "skill_proficiency") grants.skills = list(text).map(skill).filter(Boolean);
    else if (x.type === "tool_proficiency") {
      const t = tools(text, lists, "background-tool");
      grants.tools = t.tools;
      if (t.choice) choices.push(t.choice);
    } else if (x.type === "language") {
      const m = text.match(/(\w+) of your choice/i);
      if (m) choices.push({ id: "background-languages", label: "Languages", kind: "language", count: count(m[1]), from: "any" });
      else grants.languages = list(text);
    } else if (x.type === "ability_score") out.abilityChoice = list(text).map(abilityKey).filter(Boolean);
    else if (x.type === "feat") out.feat = text;
    else if (x.type === "feature") out.features.push({ name: x.name.trim(), desc: text });
    else if (x.type === "equipment") out.equipment = rules === "2014" ? [{ options: [option("", text, index)] }] : equipment2024(text, index);
  }
  return out;
}

export function feat(f) {
  const benefits = (f.benefits ?? []).map((b) => plain(b.desc)).filter(Boolean);
  return { name: f.name.trim(), type: f.type ?? "", desc: [plain(f.desc), ...benefits.map((b) => `• ${b}`)].filter(Boolean).join("\n"), choices: [] };
}

// ---------- Overrides ----------
/** Deep merge: objects merge key by key, anything else (arrays included) replaces. */
export function merge(base, over) {
  if (!over || typeof over !== "object" || Array.isArray(over) || !base || typeof base !== "object" || Array.isArray(base)) return over ?? base;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = k in base ? merge(base[k], v) : v;
  return out;
}

/** Applies an override section ({ "Fighter": {...} }) to entries by name; a name with no entry is an error. */
export function apply(entries, overrides = {}, what) {
  for (const name of Object.keys(overrides)) if (!entries.some((e) => e.name === name)) throw new Error(`setup_overrides: no ${what} named ${name}`);
  return entries.map((e) => (overrides[e.name] ? merge(e, overrides[e.name]) : e));
}

/** Applies overrides to entries nested under several parents (subspecies, subclasses), each name found somewhere. */
function applyNested(parents, key, overrides = {}, what) {
  const all = parents.flatMap((p) => p[key]);
  apply(all, overrides, what);
  return parents.map((p) => ({ ...p, [key]: p[key].map((e) => (overrides[e.name] ? merge(e, overrides[e.name]) : e)) }));
}

export function setup(raw, rules, overrides, items) {
  const o = overrides[rules] ?? {};
  const lists = overrides.lists;
  const index = itemIndex(items);
  const top = raw.species.filter((s) => !s.subspecies_of);
  const allSpecies = top.map((s) => ({
    ...species(s, rules, lists),
    subspecies: raw.species.filter((x) => x.subspecies_of === s.key).map((x) => species(x, rules, lists)),
  }));
  const classes = raw.classes.filter((c) => !c.subclass_of).map((c) => klass(c, raw.classes.filter((s) => s.subclass_of?.key === c.key), rules, lists, index));
  const byName = (a, b) => a.name.localeCompare(b.name);
  return {
    rules,
    languages: lists.languages[rules],
    tools: [...lists.artisanTools, ...lists.instruments, ...lists.gamingSets, ...lists.otherTools],
    general: o.general ?? { grants: {}, choices: [] },
    species: apply(applyNested(allSpecies, "subspecies", o.subspecies, "subspecies"), o.species, "species").sort(byName),
    classes: apply(applyNested(classes, "subclasses", o.subclasses, "subclass"), o.classes, "class").sort(byName),
    backgrounds: apply(raw.backgrounds.map((b) => background(b, rules, lists, index)), o.backgrounds, "background").sort(byName),
    feats: apply(raw.feats.map(feat), o.feats, "feat").sort(byName),
  };
}
