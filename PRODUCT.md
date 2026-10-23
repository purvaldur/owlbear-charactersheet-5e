# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

An Owlbear Rodeo (OBR) extension: a web page loaded in an iframe as the popover of an OBR action button, alongside the shared map. Narrow, resizable via `OBR.action.setWidth/setHeight`.

## Stack

Delegated: Svelte 5 + Vite + TypeScript, built as static files (no server). Why: the popover is a small iframe, so a near-zero runtime matters; the sheet is almost entirely derived values (scores → modifiers → skills, saves, to-hit, DCs), which Svelte's fine-grained reactivity expresses directly; TypeScript gives the character data model and import/export validation a real schema, which v1 lacked and kept breaking on.

This is a full rewrite on a fresh start. v1 (Vue 3, socket.io + Appwrite, on `master`) is evidence of behavior only; no code, data format, or server carries over.

## Users

Players and GMs, weighted equally, during a live D&D 5e session in an Owlbear Rodeo room.

- **Player:** keeps their character open next to the map. Rolls checks, saves, attacks and spells; tracks HP, spell slots and limited-use features; answers "what's your AC / passive Perception / what does that ability do?" without leaving the room.
- **GM:** runs several monsters and NPCs during combat, switching between them quickly; rolls in secret when needed; glances at players' key numbers; ties stat blocks to tokens on the map.

## Product Purpose

A 5e-compatible character sheet that lives inside the VTT, where rolling an action puts a readable result in front of the whole table. It exists so a group playing in Owlbear Rodeo doesn't need a separate sheet tool, a separate dice tool, and copy-pasting between them.

Success: at the table, the common moves (roll something, change HP, spend a slot or use) take one interaction from the normal view, and anyone reading a roll result knows what happened and what to do next.

## Positioning

- **Freeform, not a rules engine.** It does not track class, race, or level. Users build their own actions, spells and traits from parts (to-hit, save DC, damage parts, description); the sheet only does the arithmetic it can derive (ability modifiers, proficiency, DCs). That keeps homebrew, multiclass, and monsters equally easy.
- **Rolls are social.** Results land in a shared table log with context: who rolled, what, the dice, the totals, damage by type, and a save DC that the targeted player can click to roll their own save from the log.
- **OBR-native, no account.** Runs entirely in the room, uses Dice+ when the room has it, and falls back to its own roller otherwise.

## Operating Context

- Lives in the OBR action popover beside the map; users go back and forth between map and sheet all session.
- Shared roll log replaces v1's socket.io server with OBR broadcast (messages limited to 16KB).
- Dice+ integration via its broadcast channels (`dice-plus/isReady`, `dice-plus/roll-request`, `{source}/roll-result`, `{source}/roll-error`). Dice+ supports roll visibility `everyone | self | dm | gm_only`, and with `showResults: false` it returns grouped, labelled dice so the extension can render its own result. Reference: `diceplus.md`.
- OBR APIs in play: `OBR.player` (id, name, role GM/PLAYER, metadata), `OBR.party`, `OBR.room` (metadata, 16KB total), `OBR.scene.items` (token metadata), `OBR.contextMenu`, `OBR.broadcast`, `OBR.notification`, `OBR.action` (size, badge, open state), `OBR.theme` (LIGHT/DARK mode and room palette). Reference: `owlbear-rodeo-docs.md`.
- Ordinary combat rhythm: GM asks for a save, a player rolls an attack, someone asks what a feature does. The product sits in the middle of that conversation.

## Capabilities and Constraints

**Confirmed scope (carried from v1 behavior, rebuilt):**
- Header: name, current/max/temp HP, AC, advantage/disadvantage toggle.
- Six ability scores with modifiers; ability checks and saving throws as distinct things (saves are not renameable "skills" as in v1).
- Skills with ability, proficiency and expertise.
- Actions built from: activation time (Action, Bonus, Reaction, 1 min… 24 h), optional to-hit (ability + flat + proficiency), optional save DC (computed from ability or overridden, with target ability), any number of damage parts (NdX + ability + flat + damage type), description.
- Spells: grouped by level with slot tracking; spellcasting ability with separate attack and DC bonuses; built like actions; addable from the SRD spell list (`public/spells/srd.json`).
- Traits/features with description and optional use counter; passive Perception shown.
- Inventory: coins (cp, sp, ep, gp, pp) and item list (qty, name, weight, value).
- Multiple sheets per user, with quick switching.
- Generic dice rolls (d4–d20).
- Shared roll log; save DCs in results are clickable to roll the matching save.
- Crits double damage dice only, never flat modifiers (v1 doubled modifiers too).

**GM capabilities (all confirmed as wanted):**
- Hidden rolls (Dice+ `gm_only` / equivalent visibility in the fallback log).
- Many sheets with fast switching mid-combat.
- Read-only view of players' sheets (at least key numbers such as HP, AC, passive Perception).
- Link a sheet to a map token (e.g. HP shown on the token, open the sheet from the token's context menu).

**Persistence:**
- First release: browser storage on the device, plus file export/import for backup and moving between devices.
- Roadmap: an optional custom server for cross-device persistence. Not in scope now; don't design it out.
- Open: the GM's view of player sheets and token links need some data shared through OBR (player/room/item metadata or broadcast), within OBR's 16KB limits. How much of a sheet is mirrored is undecided.

**Undecided / roadmap (from v1 IDEAS.md, not committed):** upcasting spells, initiative button/tracker, grouping actions by activation time, backstory/notes tab.

**Terminology:** "sheet" = one character or creature; "roll log" = shared results feed; 5e terms as in the SRD (ability, modifier, proficiency bonus, saving throw, DC, spell slot, temp HP, AC).

## Brand Commitments

- Name: **Valdur's Heroic Codex** (OBR store listing; author "Valdur"). Only the name is binding; v1's visual identity (navy + white pills, anvil edit icon, Inter/Fira Code) is not.
- Visual standard (chosen 2026-10-23): the category standard, executed straight with no novelty world. The quality bar is **Owlbear Rodeo's own UI**: the extension should feel native next to OBR's panels and follow its theme.

## Evidence on Hand

- v1 store listing copy and how-to: `README.md`. Video tutorial (v1): https://www.youtube.com/watch?v=J2K3T2molDA
- v1 screenshot: `public/preview.png`; icons `public/icon.png`, `public/icon.svg`, `public/sheet.svg`.
- SRD spell data: `public/spells/srd.json`. `phb.json`, `xge.json`, `tcoe.json` also exist in the repo but are non-SRD content and were deliberately disabled in v1. Don't ship them.
- Platform references: `owlbear-rodeo-docs.md`, `diceplus.md`.
- No user counts, testimonials, or reviews exist in the repo. Don't invent them.

## Product Principles

1. **One interaction at the table.** Viewing and playing is the default state; rolling, changing HP and spending uses never go through edit mode. Building a sheet is separate work.
2. **The user defines; the sheet computes.** No class/level rules engine. Derive what's derivable, let the user override, and make homebrew and monsters as easy as player characters.
3. **A roll is a message to the table.** Every result has to be readable by someone who didn't press the button, and should let the next person act (a clickable save, a description on request).
4. **Players and GMs are equals.** GM workflows (many sheets, secret rolls, tokens, oversight) get the same care as the player sheet.
5. **Belongs in Owlbear.** No accounts or servers needed; cooperate with what's already in the room (Dice+, the OBR theme, tokens) and don't duplicate it.
