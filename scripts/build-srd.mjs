// Compacts the SRD spell list into the shape the spell picker reads:
// [name, level, activation, range, spellAttack, saveTarget, [[dice, die, type]], description]
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const from = fileURLToPath(new URL("../public/spells/srd.json", import.meta.url));
const to = fileURLToPath(new URL("../public/srd-spells.json", import.meta.url));
const castMap = { B: "BA" };

const trim = (d) => {
  const first = (d || "").split("\n")[0].trim();
  if (first.length <= 320) return first;
  const cut = first.slice(0, 320);
  const end = cut.lastIndexOf(". ");
  return end > 200 ? cut.slice(0, end + 1) : `${cut.trimEnd()}…`;
};

const spells = JSON.parse(readFileSync(from, "utf8")).map((s) => [
  s.name.trim(),
  +s.level,
  castMap[s.castingTime?.short] || s.castingTime?.short || "A",
  s.range || "",
  s.rollToHit ? 1 : 0,
  s.save ? s.saveTarget : "",
  s.damage ? (s.damageDice || []).map((d) => [+d.amount || 1, +d.die || 6, String(d.type || "").toLowerCase()]) : [],
  trim(s.description),
]);

writeFileSync(to, JSON.stringify(spells));
console.log(`srd-spells.json: ${spells.length} spells`);
