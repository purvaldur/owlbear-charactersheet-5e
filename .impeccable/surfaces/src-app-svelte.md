---
version: 1
slug: "src-app-svelte"
primary_target: "src/App.svelte"
related_targets: ["route:/tmp/claude-1000/-home-thor-git-thor-owlbear-charactersheet-5e/d6abb9ae-b18a-47a0-8c51-17a41255f32a/scratchpad/codex-v2/codex-v2.html"]
---

# Surface: v2 character sheet (OBR action popover)

Mode: Operate. Desktop players mid-combat and a GM running one sheet per monster, in a 400–500px popover beside the map. Job: take a whole turn from the sheet (set mode + visibility, roll attack + damage, read the result after looking away, apply damage). Prototype: single-file interactive HTML at popover width; harness controls outside the frame (width, viewer player/GM, Dice+ on/off, next turn, jump to state). Out of scope: real OBR/Dice+, persistence, Spells/Inventory/Notes contents, token-link UI. Open: which turn tracker; token-link UI; player turn-following; light theme.

## Direction contract

THESIS: The sheet is a cockpit, not a document. A fixed top band (header bar + last-roll slot) holds HP, roll mode, visibility and the last result; everything else scrolls under it. Refuses the paper-sheet arrangement where the name is the hero and results vanish in a toast.

OWN-WORLD: Established iron/blood world, quieter. Iron ground, parchment and bone text, hairline iron rules, square corners. Blood red only where it means something: HP field, damage, fumble, destructive actions, active-tab rule; a dim gold for crits and expertise. Cinzel only for name, section titles and the large numerals; a legible workhorse sans with unambiguous 1/l/I for everything else. No ornaments, grain, glow, tracked caps or grey italic prose.

STORY: A player glances: HP, mode, last result. Clicks Greataxe; reads to-hit and damage together; types 9, presses Damage. The GM presses Next turn; the sheet becomes Goblin 2's stat block; rolls GM-only and the player view shows only that a hidden roll happened.

FIRST VIEWPORT: At 460×900: row 1 name (one line) with class/level, sheet switcher, Edit; row 2 HP control dominant (numeral + thin blood bar + temp), AC, Initiative, DIS|Normal|ADV, visibility. Below, the last-roll slot full width with the total as the largest number on screen. Then tabs, the ability band, and the two columns starting.

FORM: Established-world refinement inside the user-pinned world. No concept roll ran: the visual world is pinned by the user and the composition was fixed by the confirmed shape brief, so per new-work it is extended, not re-rolled. Signature move: blood as HP — the HP bar is the one red field on the sheet and drains as damage lands; the damage figure in the last-roll slot shares that red. seed: none (no roll run: established, user-pinned world)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
