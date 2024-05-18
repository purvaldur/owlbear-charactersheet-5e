---
title: Valdur's Heroic Codex!
description: Character Sheet for Owlbear Rodeo that is 5E compatible.
author: Valdur
image: https://raw.githubusercontent.com/purvaldur/owlbear-charactersheet-5e/master/public/preview.png
icon: https://raw.githubusercontent.com/purvaldur/owlbear-charactersheet-5e/master/public/icon.png
tags:
  - tool
  - dice
  - automation
  - combat
manifest: https://owlbear.vald.io/manifest.json
learn-more: thor@vald.io
---

# Simple character sheet extension for Owlbear Rodeo!
draws inspiration from the way some other VTTs easily allows adding custom actions, spells, etc.

In contrast to many other character sheets, this does not keep track of your class and level for the sake of simplicity. The only thing influenced by your level on this sheet is your Proficiency Bonus, which goes up by one at character level 5, 9, etc...

### HOWTO:
When you first open your character sheet, you will be met with a pre-filled character sheet for a character named "Change Me!" along with a premade action, a spell, a trait and a backpack item.

In order to change the character sheet, click on the little anvil icon in the corner to being editing. From there you can change everything about the character sheet, including the name of the character, stats, actions, spells, etc etc.

Most things on the character sheet has a little tooptip explaining the thing if you hover your mouse over it.

**Skills**
This tab is where you manage your abilities. When in editing mode, you can rename the abilities. It is important that you do NOT rename the saving throws yet however, as it might break the saving throw button in the dice-roller. A fix is on the way for this however. While editing, you can also change the core stat for a given ability.

You add your proficiency bonus to a given ability by clicking on the little dot next to it.

**Actions**
An action consists of up to four parts.
- An attack roll (optionally with proficiency)
- A saving throw DC for a targeted ability (calculated as 8+ability modifier+proficiency). This DC can manually be overriden.
- Damage dice with bonuses to damage, optional extra bonuses (for example from a +1 weapon!) and damage type.
- A description that shows when you hover over the action, as well as in the dice roller.

When an action is clicked outside of editing mode, it shows up in the dice roller, rolling any needed dice and displaying the ability saving throw if one is defined. When hovering over the action in the dice roller, the action description shows up as a tooltip. This is great for when your DM asks "what does that action do again?"

**Spells**
For all your spellcasters out there, this tab is for you! When in editing mode, you can define your base casting stat, as well as any bonuses to either the spell attack modifier or the spell DC modifier (this is because some magical items give a bonus only to one and not the other).

You can add a spell manually, much the same way as you define an action, or you can add premade SRD spells from the spellbook.

When in editing mode, you can also define your maximum spellslots for each spell level. When outside of editing mode, these show up as pips you can toggle on and off to keep track of your spent spellslots.

**Traits**
This is for all the miscellaneous stuff on your character sheet. Racial features, class features, etc. You can add a name and description for any trait, as well as a counter (to keep track of Monk Ki Points for example)

**Backpack**
This tab allows you to keep track of your money and inventory. Pretty self explanatory.

### FOR GMs:
We don't need that pesky backpack! If you have the "GM" role in the Owlbear room, you get a "Sheets" tab instead of a backpack. This is to allow you to run monsters using this extension, easily switching back and forth between them as needed.

### Video tutorial
A video tutorial is on the way! In the meantime, sit tight, read the guide above and experiment at your own pace with the character sheet.

### DISCLAIMER
This work includes material taken from the System Reference Document 5.1 (“SRD 5.1”) by Wizards of the Coast LLC and available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at https://creativecommons.org/licenses/by/4.0/legalcode