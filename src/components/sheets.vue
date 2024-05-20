<script>
import { codex } from './codex.js'

export default {
  data() {
    return {
      player: codex.player,
      characters: codex.characters,
      meta: codex.meta
    }
  },
  methods: {
    newCharacter() {
      codex.player.editing = false
      codex.meta.set()
      codex.player = Object.assign({}, this.template)
      codex.player.editing = true
      codex.characters.list.push(codex.player)
      codex.characters.active = codex.characters.list.length - 1
      codex.meta.set()
      // this.player = codex.player
    },
    removeCharacter(i) {
      if (codex.characters.active === i) {
        OBR.notification.show("You can't delete the active character. Change to another character first.")
      } else {
        codex.characters.list.splice(i, 1)
        if (codex.characters.active > i) {
          codex.characters.active--
        }
        codex.meta.set()
      }
    },
    changeCharacter(i) {
      const editing = codex.player.editing ? true : false
      codex.characters.list[codex.characters.active].editing = false
      codex.characters.active = i
      codex.player = codex.characters.list[i]
      codex.player.editing = editing
      codex.meta.set()
    },
  },
  mounted() {

  }
}
</script>

<template>
  <div class="sheet" v-for="character, i in characters.list">
  <img v-if="player.editing" :class="{ editing: character.sectionEditing}" class="editToggle sheetEdit" src="./assets/anvil.svg" @click="togglePlayerSectionEdit(i)" />
  <button v-if="!character.sectionEditing" class="name" type="button" @click="changeCharacter(i)">
    <p>{{ character.name }}</p>
  </button>
  <div v-if="character.sectionEditing" class="buttonEditing">
    <div class="editSection name">
      <div>
        <input placeholder="Name" type="text" v-model="character.name" @change="meta.set(false)"/>
      </div>
    </div>
    <div class="editSection editDelete">
      <div>
        <button title="THIS ACTION IS PERMANENT!" type="button" @click="removeCharacter(i)"><p>DELETE CHARACTER</p></button>
      </div>
    </div>
  </div>
</div>
<div class="addEntry" v-if="player.editing">
  <button type="button" @click="newCharacter()"><p>Create new sheet</p></button>
</div>
</template>

