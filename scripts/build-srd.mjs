// Copies the SRD lists in scripts/data (spells, items and monsters for each ruleset, already in the Codex's shapes, and
// the guided setup's species, classes, backgrounds and feats) to public/srd, where the dialog popover loads them.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const data = (name) => fileURLToPath(new URL(`./data/${name}`, import.meta.url));
const dir = fileURLToPath(new URL("../public/srd/", import.meta.url));

mkdirSync(dir, { recursive: true });
for (const list of ["spells", "items", "monsters", "setup"])
  for (const rules of ["2014", "2024"]) {
    const entries = JSON.parse(readFileSync(data(`${list}_${rules}.json`), "utf8"));
    writeFileSync(`${dir}${list}-${rules}.json`, JSON.stringify(entries));
    console.log(`srd/${list}-${rules}.json: ${Array.isArray(entries) ? `${entries.length} ${list}` : Object.keys(entries).join(", ")}`);
  }
