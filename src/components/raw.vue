<script>
import { codex, template } from './codex.js'
import OBR from "@owlbear-rodeo/sdk"

const arrayCheck = ["stats", "skills", "traits"]
const objectCheck = ["spells", "spellSlots", "storage"]

export default {
  data() {
    return {
      codex
    }
  },

  methods: {
    importChar() {
      try {
        const characters = JSON.parse(this.$el.querySelector('textarea').value)

        const checkPropertyAndType = (obj, template, path) => {
          for (const key in template) {
            if (!obj.hasOwnProperty(key) || typeof obj[key] !== typeof template[key]) {
              throw new Error(`${path}.${key} is missing or invalid`)
            }
          }
        }
        const checkArray = (arr, template, path) => {
          arr.forEach((item, index) => {
            checkPropertyAndType(item, template[0], `${path}[${index}]`)
          })
        }
        const checkObject = (obj, template, path) => {
          for (const key in obj) {
            if (typeof obj[key] === "object") {
              checkPropertyAndType(obj[key], template[key], `${path}.${key}`)
            } else if (Array.isArray(obj[key]) && obj[key].length > 0) {
              checkArray(obj[key], template[key], `${path}.${key}`)
            }
          }
        }

        if (!characters.hasOwnProperty('active')) { throw new Error("Missing characters.active") }
        if (!characters.hasOwnProperty('list')) { throw new Error("Missing characters.list") }
        if (!characters.list.length === 0) { throw new Error("characters.list is empty") }

        characters.list.forEach((character, i) => {
          checkPropertyAndType(character, template, `characters.list[${i}]`)
          arrayCheck.forEach(key => {
            if (character[key].length > 0) {
              checkArray(character[key], template[key], `characters.list[${i}].${key}`)
            }
          })
          objectCheck.forEach(key => {
            checkObject(character[key], template[key], `characters.list[${i}].${key}`)
          })
        })
      } catch (error) {
        OBR.notification.show("Invalid JSON: " + error)
        return
      }

      const string = this.$el.querySelector('textarea').value
      codex.characters = JSON.parse(string)
      if (codex.characters.active > codex.characters.list.length - 1) {
        OBR.notification.show("Active character was out of bounds, setting to 0")
        codex.characters.active = 0
      }
      codex.player = codex.characters.list[codex.characters.active]
      codex.meta.set()
      OBR.notification.show("Import successful")
    }
  }
}
</script>

<template>
  <div class="raw">
    <textarea
      title='To make a backup:&#010;&#010;1: Right-click anywhere inside this field&#010;2: Press "Select All" from the context menu&#010;3: Right click again, then press "Copy" from the context menu&#010;4: Paste the copied text into a text editor (for example, notepad)&#010;5: Save it as a text file.&#010;&#010;To import a backup:&#010;&#010;1: Paste the text from the backup file into this field&#010;2: Press the "IMPORT" button.&#010;&#010;WARNING: Importing a backup will overwrite all current data.&#010;'
      :value="JSON.stringify(codex.characters, null, 2)">
    </textarea>
    <button @click="importChar">IMPORT</button>
  </div>
</template>

<style scoped>
.raw {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.raw textarea {
  width: 100%;
  height: 100%;
  font-family: 'Courier New', Courier, monospace;
  border: none;
  background-color: #f5f5f5;
  resize: none;
}
.raw button {
  margin-top: 1rem;
  background-color: #A6E3A1;
  display: flex;
  justify-content: center;
  font-weight: bold;
}
</style>