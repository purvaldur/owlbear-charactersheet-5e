// Turns an Open5e creature into a creature sheet, less the ids: the Codex gives every sheet, action, spell and feature
// its own when a creature is made from the list. Open5e's structured attacks are unreliable in its SRD 5.1 data (no
// dice, every type "Thunder"), so rolls are read from the stat block's own text, which both editions write regularly.
import { plain } from "./text.mjs";

const ABILITY = { strength: "str", dexterity: "dex", constitution: "con", intelligence: "int", wisdom: "wis", charisma: "cha" };
const KEYS = Object.values(ABILITY);
const SKILL = { animal_handling: "animal", sleight_of_hand: "sleight" };
const ACT = { ACTION: "A", BONUS_ACTION: "BA", REACTION: "R", LEGENDARY_ACTION: "—" };
const ORDER = ["ACTION", "BONUS_ACTION", "REACTION", "LEGENDARY_ACTION"];
const SKILL_KEYS = ["acrobatics", "animal", "arcana", "athletics", "deception", "history", "insight", "intimidation", "investigation",
  "medicine", "nature", "perception", "performance", "persuasion", "religion", "sleight", "stealth", "survival"];

const mod = (score) => Math.floor((score - 10) / 2);
/** Proficiency bonus by challenge rating: +2 up to CR 4, then one more every four. */
export const crProf = (cr) => Math.max(2, Math.floor((Math.max(cr, 1) - 1) / 4) + 2);
export const crText = (cr) => ({ 0.125: "1/8", 0.25: "1/4", 0.5: "1/2" })[cr] ?? String(cr);
const lower = (s) => String(s || "").toLowerCase();
const num = (s) => +String(s).replace("−", "-").replace(/\s+/g, "");

// ---------- Rolls from text ----------
const PART = /(\d+) \((\d+)d(\d+)(?:\s*([+−-])\s*(\d+))?\) ([A-Za-z]+) damage/g;
const FLAT = /\b(\d+) ([A-Za-z]+) damage/;
/** Whether some text has a damage part: PART is global (for matchAll), and a global test() carries on where it last stopped. */
const hasDamage = (text) => new RegExp(PART.source).test(text) || FLAT.test(text);

/**
 * The damage parts in a stretch of stat-block text: "13 (1d10 + 8) Slashing damage plus 5 (2d4) Fire damage". Only the
 * first of alternatives counts ("… or 8 (1d10 + 3) slashing damage if used with two hands"), and a part that only
 * applies under a condition ("plus 2 (1d4) … if the attack roll had Advantage") is left off.
 */
function parts(text) {
  const first = text.split(/\s+or\s+(?=\d+ \()/)[0];
  const out = [];
  for (const m of first.matchAll(PART)) {
    if (/^,?\s*if\b/.test(first.slice(m.index + m[0].length))) continue;
    out.push({ n: +m[2], d: +m[3], bonus: m[5] ? (m[4] === "+" ? +m[5] : -m[5]) : 0, type: lower(m[6]) });
  }
  if (!out.length) {
    const m = first.match(FLAT);
    if (m) out.push({ n: 0, d: 6, bonus: +m[1], type: lower(m[2]) });
  }
  return out;
}

/** "DC 21 Dexterity saving throw" (2014) or "Dexterity Saving Throw: DC 21" (2024). */
function saveIn(text) {
  const m = text.match(/DC (\d+) (\w+) saving throw/i) || text.match(/(\w+) Saving Throw: DC (\d+)/i);
  if (!m) return null;
  const [dc, ab] = /^\d+$/.test(m[1]) ? [+m[1], m[2]] : [+m[2], m[1]];
  const target = ABILITY[lower(ab)];
  return target ? { dc, target, at: m.index + m[0].length } : null;
}

/** "reach 5 ft." and "range 80/320 ft." as the sheet's range line: "Melee · 5 ft", "Ranged · 80/320 ft". */
function rangeIn(text) {
  const reach = text.match(/reach (\d+) (?:ft|feet)/);
  const range = text.match(/range (\d+(?:\/\d+)?) (?:ft|feet)/);
  if (reach && range) return `Melee ${reach[1]} ft or ranged ${range[1]} ft`;
  if (reach) return `Melee · ${reach[1]} ft`;
  if (range) return `Ranged · ${range[1]} ft`;
  return "";
}

/**
 * The ability behind a to-hit bonus: the first of `pool` whose modifier and proficiency make it exactly, then any other
 * ability that does (2024 stat blocks don't say which attacks are spells), else the closest of `pool` with the rest as
 * a flat bonus.
 */
function hitFrom(toHit, scores, prof, pool) {
  const flat = (ab) => toHit - prof - mod(scores[ab]);
  const exact = [...pool, ...KEYS.filter((k) => !pool.includes(k))].find((ab) => flat(ab) === 0);
  if (exact) return { ab: exact, prof: true, flat: 0 };
  const ab = pool.reduce((a, b) => (Math.abs(flat(b)) < Math.abs(flat(a)) ? b : a));
  return { ab, prof: true, flat: flat(ab) };
}

/** The first sentence in some text that deals damage, as damage parts. */
function damageSentence(text) {
  const s = text.split(/(?<=\.)\s+/).find(hasDamage);
  return s ? parts(s) : [];
}

function action(a, scores, prof) {
  const desc = plain(a.desc);
  const out = { name: a.name.trim(), act: ACT[a.action_type] || "A", range: "", hit: null, save: null, dmg: [], uses: null, desc };
  // 2014: "Melee Weapon Attack: +14 to hit, …. Hit: 19 (2d10 + 8) …"; 2024: "Melee Attack Roll: +14, reach 10 ft. 13 (1d10 + 8) …".
  const atk = desc.match(/(Melee|Ranged|Melee or Ranged) (Weapon |Spell )?Attack(?: Roll)?:\s*([+−-]\s*\d+)/);
  if (atk) {
    const spell = atk[2] === "Spell " || a.attacks?.[0]?.attack_type === "SPELL";
    out.hit = hitFrom(num(atk[3]), scores, prof, spell ? ["int", "wis", "cha"] : ["str", "dex"]);
    out.range = rangeIn(desc);
    const after = desc.slice(atk.index + atk[0].length);
    // 2014 marks the hit; 2024 follows the range ("reach 5 ft. or range 150 ft.") with it.
    const hitText = after.includes("Hit:")
      ? after.slice(after.indexOf("Hit:") + 4)
      : after.replace(/^[^.]*?(?:reach|range)[^.]*?(?:ft|feet)\.(?:\s*or range [^.]*?(?:ft|feet)\.)?\s*/, "");
    // The hit's own damage, up to any saving throw it forces; the save shows as its DC.
    const save = saveIn(hitText);
    const own = save ? hitText.slice(0, hitText.search(/the target must|\w+ Saving Throw:|DC \d+/i)) : hitText;
    out.dmg = parts(own.split(/\.\s/)[0]).map((p) => damage(p, out.hit.ab, scores));
    if (save) out.save = { ab: "", dc: save.dc, target: save.target };
  } else {
    const save = saveIn(desc);
    if (save) {
      out.save = { ab: "", dc: save.dc, target: save.target };
      // 2024: "Failure: 59 (17d6) Fire damage."; 2014: "…saving throw, taking 63 (18d6) fire damage on a failed save",
      // or "On a failure, a target takes 15 (3d8 + 2) bludgeoning damage" a sentence on.
      const rest = desc.slice(save.at);
      const fail = rest.indexOf("Failure:");
      out.dmg = damageSentence(fail >= 0 ? rest.slice(fail + 8) : rest).map((p) => damage(p, "", scores));
      const area = desc.match(/\b(\d+)-foot[- ](cone|line|radius|cube|sphere|emanation|cylinder)/i);
      if (area) out.range = `${area[1]} ft ${lower(area[2])}`;
    } else if (/damage/.test(desc)) {
      // Damage with neither an attack nor a save ("each creature charmed by the aboleth takes 10 (3d6) psychic damage").
      out.dmg = damageSentence(desc).map((p) => damage(p, "", scores));
    }
  }
  const lim = a.usage_limits;
  if (lim?.type === "PER_DAY") out.uses = { max: lim.param, used: 0, recharge: "LR" };
  else if (lim?.type === "RECHARGE_ON_ROLL" || lim?.type === "RECHARGE") {
    // The sheet tracks Recharge 5–6 itself; any other range is noted in the name and recharged by hand.
    out.uses = { max: 1, used: 0, recharge: lim.param === 5 ? "5–6" : "—" };
    if (lim.param !== 5 && !/recharge/i.test(out.name)) out.name += ` (Recharge ${lim.param === 6 ? "6" : `${lim.param}–6`})`;
  }
  if (a.action_type === "LEGENDARY_ACTION") {
    const cost = a.legendary_action_cost > 1 ? ` (costs ${a.legendary_action_cost})` : "";
    out.range = [`Legendary${cost}`, out.range].filter(Boolean).join(" · ");
  }
  return out;
}

/** A damage part on the sheet: the attack's ability when the bonus is just its modifier, a flat bonus otherwise. */
function damage(p, ab, scores) {
  if (ab && p.bonus && p.bonus === mod(scores[ab])) return { n: p.n, d: p.d, ab, flat: 0, type: p.type };
  return { n: p.n, d: p.d, ab: "", flat: p.bonus, type: p.type };
}

// ---------- Spellcasting ----------
/** Spell names in a spellcasting block: the lists after "At will:", "1/day each:", "1st level (4 slots):" and the like. */
function spellNames(text) {
  const names = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^(?:•\s*)?([^:]{2,40}):\s*(.+)$/);
    if (!m || !/(at will|\/day|level|cantrip)/i.test(m[1])) continue;
    for (const n of m[2].split(",")) names.push(n.replace(/\(.*?\)|\*/g, "").trim());
  }
  return names.filter(Boolean);
}

/**
 * Spells named in prose rather than a list: italicised in 2014 ("can innately cast _sleep_"), and in 2024 written with
 * their capitals ("casts Fireball … or Wall of Fire"), which is also how the SRD list names them.
 */
function spellsInProse(raw, spells) {
  const found = [...raw.matchAll(/[_*]([a-z][a-z' /-]+?)[_*]/gi)].map((m) => m[1].toLowerCase()).filter((n) => spells.has(n));
  for (const s of spells.values()) if (new RegExp(`\\b${s.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(raw)) found.push(s.name.toLowerCase());
  return found;
}

function spellcasting(blocks, scores, prof, spells) {
  if (!blocks.length) return { spellcasting: null, slots: {}, spells: [] };
  const raw = blocks.map((b) => b.desc).join("\n");
  const text = blocks.map((b) => plain(b.desc)).join("\n");
  const abName = text.match(/(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\b(?= as the spellcasting ability| \()/i)
    || text.match(/spellcasting ability is (\w+)/i);
  const ab = ABILITY[lower(abName?.[1])] || "int";
  const dc = text.match(/spell save DC (\d+)/i);
  const atk = text.match(/([+−-]\d+) to hit with spell attacks/i);
  const slots = {};
  for (const m of text.matchAll(/(\d)(?:st|nd|rd|th) level \((\d+) slots?\)/g)) slots[m[1]] = { max: +m[2], used: 0 };
  const seen = new Set();
  const found = [];
  const listed = spellNames(text);
  for (const n of listed.length ? listed : spellsInProse(raw, spells)) {
    const s = spells.get(n.toLowerCase());
    if (s && !seen.has(s.name)) {
      seen.add(s.name);
      found.push(s);
    }
  }
  return {
    spellcasting: {
      ab,
      // Offsets that make the sheet's derived numbers the stat block's.
      atk: atk ? num(atk[1]) - (mod(scores[ab]) + prof) : 0,
      dc: dc ? +dc[1] - (8 + mod(scores[ab]) + prof) : 0,
      shortRest: false,
    },
    slots,
    spells: found.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)),
  };
}

// ---------- Stat-block lines the sheet has no field for ----------
function speedLine(sp) {
  const ft = (n) => `${n} ft.`;
  const rest = ["burrow", "climb", "fly", "swim"].filter((k) => sp[k]).map((k) => `${k} ${ft(sp[k])}${k === "fly" && sp.hover ? " (hover)" : ""}`);
  return [ft(sp.walk ?? 0), ...rest].join(", ");
}

function senseLine(c) {
  return [["blindsight", c.blindsight_range], ["darkvision", c.darkvision_range], ["tremorsense", c.tremorsense_range], ["truesight", c.truesight_range]]
    .filter(([, r]) => r)
    .map(([k, r]) => `${k} ${r} ft.`)
    .join(", ");
}

const feature = (name, desc = "", uses = null) => ({ name, uses, desc });

export function monster(c, rules, spells) {
  const scores = Object.fromEntries(Object.entries(c.ability_scores).map(([k, v]) => [ABILITY[k], v]));
  const prof = c.proficiency_bonus || crProf(c.challenge_rating);
  const abilities = Object.fromEntries(KEYS.map((k) => {
    const full = Object.keys(ABILITY).find((n) => ABILITY[n] === k);
    const save = c.saving_throws?.[full];
    return [k, { score: scores[k], save: save != null && save > mod(scores[k]) }];
  }));
  const skills = Object.fromEntries(SKILL_KEYS.map((k) => [k, 0]));
  const ab = { acrobatics: "dex", animal: "wis", arcana: "int", athletics: "str", deception: "cha", history: "int", insight: "wis", intimidation: "cha",
    investigation: "int", medicine: "wis", nature: "int", perception: "wis", performance: "cha", persuasion: "cha", religion: "int", sleight: "dex",
    stealth: "dex", survival: "wis" };
  for (const [k, bonus] of Object.entries(c.skill_bonuses || {})) {
    const key = SKILL[k] || k;
    if (!(key in skills)) continue;
    const level = Math.round((bonus - mod(scores[ab[key]])) / prof);
    skills[key] = Math.max(bonus > mod(scores[ab[key]]) ? 1 : 0, Math.min(2, level));
  }

  const sorted = [...c.actions].sort((a, b) => ORDER.indexOf(a.action_type) - ORDER.indexOf(b.action_type) || (a.order_in_statblock ?? 0) - (b.order_in_statblock ?? 0));
  const casting = spellcasting([...c.traits, ...c.actions].filter((t) => /spellcasting/i.test(t.name)), scores, prof, spells);

  const r = c.resistances_and_immunities || {};
  const features = [
    // `speed`, not `speed_all`: the latter fills in a climb and swim speed for every creature.
    feature(`Speed: ${speedLine({ ...c.speed, hover: c.speed?.hover || c.speed_all?.hover })}`),
    senseLine(c) && feature(`Senses: ${senseLine(c)}`),
    r.damage_vulnerabilities_display && feature(`Damage Vulnerabilities: ${r.damage_vulnerabilities_display}`),
    r.damage_resistances_display && feature(`Damage Resistances: ${r.damage_resistances_display}`),
    r.damage_immunities_display && feature(`Damage Immunities: ${r.damage_immunities_display}`),
    r.condition_immunities_display && feature(`Condition Immunities: ${r.condition_immunities_display}`),
    ...c.traits.map((t) => {
      const day = t.name.match(/\((\d+)\/Day/i);
      return feature(t.name.trim(), plain(t.desc), day ? { max: +day[1], used: 0, recharge: "LR" } : null);
    }),
    c.actions.some((a) => a.action_type === "LEGENDARY_ACTION") &&
      feature("Legendary Actions", "It can take 3 legendary actions, choosing from the options listed with its actions. Only one option can be used at a time, at the end of another creature's turn. Spent legendary actions are regained at the start of its turn.", { max: 3, used: 0, recharge: "—" }),
  ].filter(Boolean);

  const lang = String(c.languages?.as_string || "").trim();
  // For the GM, one fact a line.
  const notes = [
    c.alignment && `Alignment: ${c.alignment.charAt(0).toUpperCase()}${c.alignment.slice(1)}`,
    c.hit_dice && `Hit dice: ${c.hit_dice}`,
    c.armor_detail && `Armor: ${plain(c.armor_detail)}`,
    c.experience_points != null && `XP: ${c.experience_points.toLocaleString("en-US")}`,
  ].filter(Boolean).join("\n");

  return {
    cr: c.challenge_rating,
    type: c.type.name,
    size: c.size.name,
    kind: "creature",
    rules,
    name: c.name.trim(),
    subtitle: `CR ${crText(c.challenge_rating)} · ${c.size.name} ${lower(c.type.name)}`,
    hp: { cur: c.hit_points, max: c.hit_points, temp: 0 },
    ac: c.armor_class,
    prof,
    death: { s: 0, f: 0 },
    abilities,
    skills,
    actions: sorted.map((a) => action(a, scores, prof)),
    ...casting,
    features,
    proficiencies: { armor: [], weapons: [], tools: [], languages: lang && lang !== "—" ? lang.split(/,\s*(?![^(]*\))/).map((s) => s.trim()) : [] },
    inventory: { coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }, categories: [{ id: "equipment", name: "Equipment", collapsed: false }, { id: "backpack", name: "Backpack", collapsed: false }], items: [] },
    background: { name: "", feature: { name: "", desc: "" } },
    notes,
  };
}
