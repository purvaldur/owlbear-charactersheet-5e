# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

D&D 5e players and their GM, at a live session in Owlbear Rodeo (a browser VTT). The sheet is open in a narrow popover beside the map while attention is split between the map, voice chat and the other players. Players use it to roll checks, saves and attacks, and to track HP and limited resources mid-fight. The GM uses it to run several monsters or NPCs, switching between sheets quickly and sometimes rolling in secret.

The first audience is the author's own table. A public release to the Owlbear extension store, as the successor to v1, comes later once v2 is solid.

## Product Purpose

A character sheet that lives inside Owlbear Rodeo, so nobody has to alt-tab to another site to roll or check a number. Everything the sheet shows can be rolled in one click, and the table sees the results. Success means a player can run their whole turn from the sheet without leaving the VTT or doing maths in their head.

## Positioning

Manual and homebrew-friendly. The player types in their own features, actions and spells; the sheet only does the maths (ability modifiers, proficiency, expertise, attack and save bonuses) and the rolling. It does not build characters from class, level or race, and it does not encode a ruleset, so homebrew and either 5e edition fit equally well. It runs entirely inside the VTT and needs no account.

## Operating Context

- Runs as an Owlbear Rodeo action popover (an iframe roughly 400–500px wide, up to ~900px tall). The popover reloads each time it is reopened.
- Rolls go through the Dice+ extension when it is installed, otherwise through the sheet's own roller. Results are shared with the room.
- Rolls can be public, visible only to the roller and the GM, or GM-only.
- Players are mainly on desktop browsers.

## Capabilities and Constraints

- Character data is stored in the browser's localStorage, with JSON export and import. A backend (third-party or custom) is a deferred, long-term goal.
- Edit mode and view mode are designed and built together for every tab and feature; no feature ships view-only with editing added later.
- Edition-agnostic: nothing is hard-coded that differs between the 2014 and 2024 rules.
- Multiple sheets per user (the GM's monsters, a player's pets or companions).
- v1 (the `master` branch, Vue) is published and has real users whose sheets live on the old backend. Migrating them is required before a public v2 release, but not for the first, own-table phase.
- Monsters get their own stat-block layout, separate from the player-character sheet. v1 reused the player layout for monsters to save work, and it wasn't a good fit.
- One sheet per monster: four goblins are four sheets, not one block with instances.
- Planned: link an Owlbear token to a sheet. Once linked, HP syncs both ways between the sheet and the token.
- Planned: integrate with a turn-tracker extension, so the GM's open sheet switches to whichever monster's turn it is. Which tracker is undecided.

## Brand Commitments

- Name: "Valdur's Heroic Codex!" (the action title in Owlbear is "Character Codex").

## Evidence on Hand

- v1 README with a feature walkthrough and a video tutorial (https://www.youtube.com/watch?v=J2K3T2molDA), on the `master` branch.
- Sample character: Valdur Ironhide, the author's Half-Orc Barbarian, used as demo data.
- No testimonials, usage numbers or user research exist; do not fabricate any.

## Product Principles

1. The table comes first: every roll is visible to the right people, with no trust gaps between Dice+ and the internal roller.
2. Roll in one click; never make the player do the maths.
3. The player is the authority on rules; the sheet calculates, it doesn't adjudicate.
4. Never lose a sheet: persistence and export come before features.
5. Built for a glance mid-combat, not for reading at leisure.
