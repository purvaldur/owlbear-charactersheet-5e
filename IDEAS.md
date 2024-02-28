# IDEAS
Ideas I could explore further for development

- [ ] Multiple character sheets! This allows the DM to have sheets for minions and players to have sheets for pets!
  - Requires a new field field in the data object: `characters`, an array of player objects.
  - `characters` are saved in localstorage as JSON string `{ [ charObjectA ], [ charObjectB ], [ charObjectC ], ... }`
  - Update the metadata save function to also save this string, making it effectively save entries into localstorage.
  - Change "Notes" tab to "Sheets"
  - When another sheet is selected,  replace the this.player object with the selected sheet. Use a `changeSheet(i) { this.characters[i].... }` function that also updates the localstorage `player` json-string (use the `update metadata function`).
  - (optional) allow the DM to have access to each characters sheet. Perhaps read-only / non-editable but still clickable.
- [ ] "connect" a character sheet to a token.
  - Requires adding a new string field to the player/character object. `attachedToken: ''` or something like that
  - Allows adding a HP bar to the token that updates dynamically as health is changed in the charsheet.
- [ ] Expand spells tab
  - [ ] Sort spells by spell level, each level having its' own "section".
  - [ ] Attach spell slots to each of these sections.
  - [ ] Add description field to spells. When rolled, v-bind the `:title` field of the spell name in the dice log to be the description?
