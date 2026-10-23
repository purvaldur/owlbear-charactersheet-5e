// Inlines styles, data and app into one self-contained prototype page, with a compact SRD spell list.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, p), "utf8");
const srd = JSON.parse(read("../../public/spells/srd.json"));
const castMap = { B: "BA" };
const trim = (d) => {
  const first = (d || "").split("\n")[0].trim();
  if (first.length <= 320) return first;
  const cut = first.slice(0, 320);
  return cut.slice(0, Math.max(cut.lastIndexOf(". ") + 1, 200)).trim() + (cut.lastIndexOf(". ") > 200 ? "" : "…");
};
const compact = srd.map((s) => [
  s.name.trim(), +s.level, castMap[s.castingTime?.short] || s.castingTime?.short || "A", s.range || "",
  s.rollToHit ? 1 : 0, s.save ? s.saveTarget : "",
  s.damage ? (s.damageDice || []).map((d) => [+d.amount || 1, +d.die || 6, String(d.type || "").toLowerCase()]) : [],
  trim(s.description),
]);
const page = read("src/markup.html")
  .replace("/*STYLES*/", () => read("src/styles.css"))
  .replace("/*SRD*/", () => `const SRD = ${JSON.stringify(compact)};`)
  .replace("/*DATA*/", () => read("src/data.js"))
  .replace("/*APP*/", () => read("src/app.js"));
writeFileSync(join(here, "index.html"), page);
if (process.argv[2]) writeFileSync(process.argv[2], `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>${page}</body></html>`);
console.log(`index.html ${(page.length / 1024).toFixed(0)} KB, ${compact.length} SRD spells`);
