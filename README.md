---
title: Valdur's Heroic Codex
description: A freeform D&D 5e character sheet that lives in your Owlbear Rodeo room, with rolls the whole table can read.
author: Valdur
image: https://raw.githubusercontent.com/purvaldur/owlbear-charactersheet-5e/master/public/preview.png
icon: https://raw.githubusercontent.com/purvaldur/owlbear-charactersheet-5e/master/public/icon.png
tags:
  - tool
  - dice
  - combat
manifest: https://owlbear.vald.io/manifest.json
learn-more: thor@vald.io
---

# Valdur's Heroic Codex

A D&D 5e character sheet that opens beside the map in Owlbear Rodeo. Build your character, your familiar or the GM's monsters, click anything to roll it, and every result lands in a shared log the whole table can read.

## What it does

- **One click rolls everything.** Clicking an attack rolls to hit and damage, and adds the save DC if the attack forces a save. Hold Shift for advantage and Ctrl or Cmd for disadvantage, or set it with Adv / Normal / Dis.
- **Rolls are a message to the table.** Results appear in the table-rolls sidebar for everyone. When a roll forces a save, the target can roll their save straight from the card, and the result shows underneath as Pass or Fail.
- **Freeform, not a rules engine.** The Codex does not track class or level. You build actions, spells and features from parts (to-hit, save DC, damage, limited uses), and the sheet works out modifiers, proficiency, save DCs and spell attacks for you. Homebrew, multiclass characters and monsters are equally easy.
- **Start from the SRD.** A guided setup builds a character from SRD species, classes, subclasses and backgrounds at any level from 1 to 20: ability scores, proficiencies and languages, features, hit points, spell slots and starting equipment, with every choice along the way and any step left blank for homebrew. Creatures can be made from any of the SRD's monsters, complete with attacks, saves, legendary actions and spellcasting.
- **Never miss a roll.** Rolls made while your Codex is closed pop up as cards in the corner of the map, and are waiting in the log when you open it. A save asked of you stays on screen until you roll it, right from the card.
- **HP bars on tokens.** Link a sheet to its token from the ⋯ menu or the token's right-click menu, and the token shows the sheet's HP. The GM decides what everyone sees, separately for characters and creatures: the exact number, a bar, a bar in quarter steps, or nothing. Selecting your linked token opens its sheet.
- **Track play as you go.** HP with temp HP and death saves, spell slots (a warlock's come back on a short rest), limited uses with short and long rests, armor, weapon, tool and language proficiencies, coins and an inventory in folding categories, with weights, gold values, magic item rarities and attunement, a background, and free-form session notes.
- **SRD spells and items.** Add spells, equipment and magic items from the 5e System Reference Document in a few clicks, from the 2014 (SRD 5.1) or 2024 (SRD 5.2) rules, picked per sheet.
- **Works with Dice+.** If Dice+ is installed in the room, rolls use its 3D dice. Otherwise the Codex rolls itself.
- **For GMs too.** Keep a sheet for every monster and NPC, switch between them quickly, and roll privately.

## Your data

Sheets are saved in your browser. Linking a token shares only that sheet's name and hit points with the room, so the HP bar can be drawn. Use **Export all sheets** (or **Export this sheet**) in the ⋯ menu to back them up or move them to another computer, and **Import a sheet file** to bring them back.

## Development

```sh
npm install
npm run dev        # http://localhost:5173/dev/room.html is a simulated room with sample sheets
npm run check      # type check
npm test           # unit tests
npm run build      # static build in dist/
```

To try it in a real room, run `npm run dev` and add `http://localhost:5173/manifest.json` as a custom extension in Owlbear Rodeo.

Spells, items, creatures, species, classes, backgrounds and feats come from the D&D 5e SRD 5.1 and 5.2 (Creative Commons), by way of [Open5e](https://open5e.com). `npm run open5e` refreshes them into `scripts/data`; `scripts/data/setup_overrides.json` holds the guided setup's hand-kept additions and corrections. All sample characters in the dev harness are fictional.
