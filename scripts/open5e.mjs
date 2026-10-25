// Fetches SRD material from Open5e (https://api.open5e.com) and writes it to scripts/data in the Codex's own entry
// shapes: a spell as the sheet stores it, less its id, plus the classes and school the SRD list filters by; an
// inventory item less its id and category, plus its SRD type. Run by hand (`npm run open5e`) when the data should be
// refreshed; the build only reads what this wrote.
//
// Creatures (monsters_*.json) are whole creature sheets less their ids; see open5e/monsters.mjs. The guided setup's
// species, classes, backgrounds and feats (setup_*.json) are parsed by open5e/setup.mjs, with setup_overrides.json.
//
// spells_2014.json keeps its own spells, as the Open5e copy of SRD 5.1 has less damage data; their school,
// concentration and ritual come from Open5e. Their classes come from the 5e SRD API (https://www.dnd5eapi.co): Open5e's
// SRD 5.1 class lists hold every subclass's extra spells too (a druid's Haste), and its v2 API leaves out the paladin.
//
// srd_overrides.json, kept by hand, corrects spells and items where the data is wrong.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { plain } from "./open5e/text.mjs";
import { apply } from "./open5e/setup.mjs";
import { monster } from "./open5e/monsters.mjs";
import { setup } from "./open5e/setup.mjs";

const API = "https://api.open5e.com/v2";
const out = (name) => fileURLToPath(new URL(`./data/${name}`, import.meta.url));
const DOCS = { 2014: "srd-2014", 2024: "srd-2024" };

// Open5e ignores the document filter on some endpoints, so every list is filtered by document again here.
async function list(endpoint, doc) {
  return (await pages(`${API}/${endpoint}/?document__key=${doc}&limit=500`)).filter((r) => r.document?.key === doc);
}

async function pages(url) {
  const rows = [];
  while (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
    const page = await res.json();
    rows.push(...page.results);
    url = page.next;
  }
  return rows;
}

// ---------- Spells ----------
const ACTIVATION = { action: "A", "bonus-action": "BA", reaction: "R", "1minute": "1M", "10minutes": "10M", "1hour": "1H", "8hours": "8H", "12hours": "12H", "24hours": "24H" };
const ABILITY = { strength: "str", dexterity: "dex", constitution: "con", intelligence: "int", wisdom: "wis", charisma: "cha" };

/** "60 feet" → "60 ft."; "Self" with an area → "Self (15-foot cone)", as the 2014 list writes them. */
function range(s) {
  const r = String(s.range_text || "").replace(/^(\d+) feet$/, "$1 ft.");
  if (r === "Self" && s.shape_type && s.shape_size) return `Self (${s.shape_size}-foot ${s.shape_type})`;
  return r;
}

/** "8d6", "2d4 + 4" or "20" as damage parts; unreadable rolls are left off. */
function dice(roll) {
  const m = String(roll || "").replace(/\s+/g, "").match(/^(?:(\d+)d(\d+))?(?:\+?(\d+))?$/);
  if (!m || (!m[1] && !m[3])) return null;
  return { n: m[1] ? +m[1] : 0, d: m[2] ? +m[2] : 6, flat: m[3] ? +m[3] : 0 };
}

export function spell(s) {
  const desc = plain(s.desc);
  const roll = dice(s.damage_roll);
  const dmg = [];
  if (roll) {
    // A roll with no damage type is healing or temporary hit points; anything else isn't a roll the sheet makes.
    const type = s.damage_types[0] || (/regains?\b/i.test(desc) ? "healing" : /temporary hit points/i.test(desc) ? "temp. hp" : "");
    // "2d8 plus your spellcasting ability modifier": the sheet adds the modifier itself.
    const sc = new RegExp(`${s.damage_roll.replace(/\s+/g, "\\s*").replace(/\+/g, "\\+")}\\s*(\\+|plus)\\s*your spellcasting ability modifier`, "i").test(desc);
    if (type) dmg.push({ n: roll.n, d: roll.d, ab: sc ? "sc" : "", flat: roll.flat, type });
  }
  const higher = plain(s.higher_level);
  return {
    name: s.name.trim(),
    level: s.level,
    act: ACTIVATION[s.casting_time] || "A",
    range: range(s),
    conc: !!s.concentration,
    ritual: !!s.ritual,
    // Open5e marks spells that only mention attack rolls (Bless, Hunter's Mark); the sheet's flag is for spell attacks.
    hit: !!s.attack_roll && /spell attack/i.test(desc),
    save: ABILITY[s.saving_throw_ability] ? { target: ABILITY[s.saving_throw_ability] } : null,
    dmg,
    classes: s.classes.map((c) => c.name).sort(),
    school: s.school.name,
    desc: higher ? `${desc}\n\n${s.level ? "Using a Higher-Level Spell Slot" : "Cantrip Upgrade"}. ${higher}` : desc,
  };
}

// ---------- Items ----------
const RARITY = { common: "common", uncommon: "uncommon", rare: "rare", "very-rare": "very rare", legendary: "legendary", artifact: "artifact" };
const num = (s) => (s == null || s === "" ? 0 : +(+s).toFixed(2));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function weaponLine(w) {
  // Items carry their weapon without its range; Ammunition is what makes one ranged ("Thrown" weapons are melee).
  const ranged = w.range > 0 || w.properties.some((p) => p.property.name === "Ammunition");
  const kind = `${w.is_simple ? "Simple" : "Martial"} ${ranged ? "ranged" : "melee"} weapon`;
  const props = w.properties.filter((p) => p.property.type !== "Mastery").map((p) => (p.detail ? `${p.property.name} (${p.detail})` : p.property.name));
  const mastery = w.properties.find((p) => p.property.type === "Mastery")?.property.name;
  return [
    `${kind}, ${w.damage_dice} ${w.damage_type.name.toLowerCase()}${w.range ? `, range ${w.range}/${w.long_range} ft.` : ""}.`,
    props.length ? `Properties: ${props.join(", ")}.` : "",
    mastery ? `Mastery: ${mastery}.` : "",
  ].filter(Boolean).join(" ");
}

function armorLine(a, name) {
  if (/^shield$/i.test(a.name) || /^shield$/i.test(name)) return `Shield, +${a.ac_base} AC.`;
  return [
    `${cap(a.category)} armor, AC ${a.ac_display}.`,
    a.strength_score_required ? `Strength ${a.strength_score_required}.` : "",
    a.grants_stealth_disadvantage ? "Disadvantage on Stealth." : "",
  ].filter(Boolean).join(" ");
}

export function item(it) {
  const magic = !!it.rarity;
  const own = plain(it.desc);
  // Mundane weapons and armor come with descriptions like "A battleaxe."; their stats say more.
  const trivial = /^an? [\w\s,'()-]+\.$/i.test(own) && own.length < 40;
  const stats = it.weapon && !magic ? weaponLine(it.weapon) : it.armor && !magic ? armorLine(it.armor, it.name) : "";
  const attune = it.requires_attunement && it.attunement_detail ? `Requires attunement ${it.attunement_detail.replace(/^requires attunement\s*/i, "")}.` : "";
  return {
    type: it.category.name,
    qty: 1,
    // "Calligrapher's Supplies (10 GP)" and "Holy Symbol, Amulet)" in SRD 5.2: no cost in the name, no stray bracket.
    name: it.name.trim().replace(/\s*\(\d+ GP\)$/, "").replace(/^([^(]*)\)$/, "$1"),
    wt: num(it.weight),
    cost: num(it.cost),
    rarity: magic ? RARITY[it.rarity.key] || "" : "",
    attune: !!it.requires_attunement,
    attuned: false,
    desc: [stats, attune, trivial && stats ? "" : own].filter(Boolean).join("\n\n"),
  };
}

// ---------- Run ----------
const sorted = (rows) => rows.sort((a, b) => a.name.localeCompare(b.name));

const write = (name, rows) => writeFileSync(out(name), JSON.stringify(rows, null, 1) + "\n");

/** The 2014 spells as they are, with what Open5e knows that they don't. */
const fixes = JSON.parse(readFileSync(out("srd_overrides.json"), "utf8"));
/** The hand-kept corrections for a list, applied by name. */
const fix = (rules, list, entries) => apply(entries, fixes[rules]?.[list], `${rules} ${list.replace(/s$/, "")}`);

/**
 * The SRD 5.1 class spell lists: spell name (lowercase: it writes "Pass Without Trace") → the classes that have it, from
 * each spell's own record (the API's per-class lists miss a few, such as the druid's Pass without Trace).
 */
async function classLists2014() {
  // The API turns away bursts (429): wait and try again, a little longer each time.
  const get = async (path, tries = 6) => {
    const res = await fetch(`https://www.dnd5eapi.co${path}`);
    if (res.status === 429 && tries > 1) {
      await new Promise((r) => setTimeout(r, (+res.headers.get("retry-after") || 2 ** (7 - tries)) * 1000));
      return get(path, tries - 1);
    }
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
    return res.json();
  };
  const index = (await get("/api/2014/spells")).results;
  const lists = new Map();
  for (let i = 0; i < index.length; i += 5)
    for (const s of await Promise.all(index.slice(i, i + 5).map((x) => get(x.url)))) lists.set(s.name.toLowerCase(), s.classes.map((c) => c.name).sort());
  return lists;
}

async function enrich2014() {
  const [v2, lists] = await Promise.all([list("spells", DOCS[2014]), classLists2014()]);
  const two = new Map(v2.map((s) => [s.name.trim(), s]));
  const spells = JSON.parse(readFileSync(out("spells_2014.json"), "utf8")).map((s) => {
    const a = two.get(s.name);
    if (!a) throw new Error(`Open5e has no 2014 spell named ${s.name}`);
    // Keyed in the order the other entries have them, classes and school before the description.
    const { desc, ...rest } = s;
    return { ...rest, conc: !!a.concentration, ritual: !!a.ritual, classes: lists.get(s.name.toLowerCase()) ?? [], school: a.school.name, desc };
  });
  const unlisted = spells.filter((s) => !s.classes.length).map((s) => s.name);
  if (unlisted.length) console.warn(`On no SRD 5.1 class list: ${unlisted.join(", ")}`);
  write("spells_2014.json", fix("2014", "spells", spells));
  console.log(`spells_2014.json: ${spells.length} spells given classes and schools`);
}

async function main() {
  await enrich2014();
  const spells = await list("spells", DOCS[2024]);
  write("spells_2024.json", fix("2024", "spells", sorted(spells.map(spell))));
  console.log(`spells_2024.json: ${spells.length} spells`);

  for (const [rules, doc] of Object.entries(DOCS)) {
    const [gear, magic] = await Promise.all([list("items", doc), list("magicitems", doc)]);
    // A few items are in both lists (potions, some focuses); the magic item has the rarity.
    const byName = new Map();
    for (const it of [...gear, ...magic]) byName.set(it.name.trim().toLowerCase(), item(it));
    const items = fix(rules, "items", sorted([...byName.values()]));
    write(`items_${rules}.json`, items);
    console.log(`items_${rules}.json: ${items.length} items (${gear.length} gear, ${magic.length} magic)`);
  }

  // Creatures last: their spellcasting is matched against the spell lists written above.
  for (const [rules, doc] of Object.entries(DOCS)) {
    const spells = new Map(
      JSON.parse(readFileSync(out(`spells_${rules}.json`), "utf8")).map(({ classes: _, school: __, ...s }) => [s.name.toLowerCase(), s]),
    );
    const creatures = sorted((await list("creatures", doc)).map((c) => monster(c, rules, spells)));
    write(`monsters_${rules}.json`, creatures);
    console.log(`monsters_${rules}.json: ${creatures.length} creatures`);
  }

  const overrides = JSON.parse(readFileSync(out("setup_overrides.json"), "utf8"));
  for (const [rules, doc] of Object.entries(DOCS)) {
    const [species, classes, backgrounds, feats] = await Promise.all(["species", "classes", "backgrounds", "feats"].map((ep) => list(ep, doc)));
    const items = JSON.parse(readFileSync(out(`items_${rules}.json`), "utf8"));
    const s = setup({ species, classes, backgrounds, feats }, rules, overrides, items);
    write(`setup_${rules}.json`, s);
    console.log(`setup_${rules}.json: ${s.species.length} species, ${s.classes.length} classes, ${s.backgrounds.length} backgrounds, ${s.feats.length} feats`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
