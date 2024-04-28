# IDEAS
Ideas I could explore further for development

- [x] Multiple character sheets! This allows the DM to have sheets for minions and players to have sheets for pets!
  - [x] Requires a new field field in the data object: `characters`, an array of player objects.
  - [x] `characters` are saved in localstorage as JSON string `{ [ charObjectA ], [ charObjectB ], [ charObjectC ], ... }`
  - [x]Update the metadata save function to also save this string, making it effectively save entries into localstorage.
  - [x] Change "Notes" tab to "Sheets"
  - [x] When another sheet is selected,  replace the this.player object with the selected sheet. Use a `changeSheet(i) { this.characters[i].... }` function that also updates the localstorage `player` json-string (use the `update metadata function`).
  - (optional) allow the DM to have access to each characters sheet. Perhaps read-only / non-editable but still clickable.
- [ ] "connect" a character sheet to a token.
  - Requires adding a new string field to the player/character object. `attachedToken: ''` or something like that
  - Allows adding a HP bar to the token that updates dynamically as health is changed in the charsheet.
- [ ] Expand actions/spells tabs
  - [x] ~~Add option for both actions and spells to allow generic dice rolls (example: "Favored By The Gods" trait of Divine Soul Sorcerer, or healing dice for the "Cure Wounds" spell)~~
  - [x] Sort spells by spell level, each level having its' own "section".
  - [x] Attach spell slots to each of these sections.
  - [ ] For actions, have each "section" be a casting time.
  - [x] Add description field to spells. When rolled, v-bind the `:title` field of the spell name in the dice log to be the description?
- Post launch release
  - [ ] Allow upcasting spells
  - [ ] Initiative button + tracker
  - [ ] Inventory / Equipment tab (with 5etools json list of items)
  - [ ] Backstory tab?