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
        if (!characters.active) { throw new Error("Invalid JSON") }
        if (!characters.list) { throw new Error("Invalid JSON") }
        if (!characters.list.length === 0) { throw new Error("Invalid JSON") }
        for (let i = 0; i < characters.list.length; i++) {
          // compare the keys of the template object to the keys of the character object
          // if they don't match, throw an error
          for (const key in template) {
            if (!characters.list[i].hasOwnProperty(key) && typeof characters.list[i][key] !== typeof template[key]) {
              throw new Error("Invalid JSON")
            }
            // if the key is in arrayCheck and if the array is not empty, then ensure that
            // every object in every arraCheck child object has the same keys
            // and types as the template object
            if (arrayCheck.includes(key) && characters.list[i][key].length > 0) {
              for (let j = 0; j < characters.list[i][key].length; j++) {
                for (const childKey in characters.list[i][key][j]) {
                  if (!template[key][0].hasOwnProperty(childKey) && typeof characters.list[i][key][j][childKey] !== typeof template[key][0][childKey]) {
                    throw new Error("Invalid JSON")
                  }
                }
              }
            }
            // if the key is in objectCheck then ensure that
            // every object in the objectCheck child object has the same keys
            // and types as the template object
            if (objectCheck.includes(key)) {
              for (const childKey in characters.list[i][key]) {
                if (!template[key].hasOwnProperty(childKey) && typeof characters.list[i][key][childKey] !== typeof template[key][childKey]) {
                  throw new Error("Invalid JSON")
                }
                if (typeof characters.list[i][key][childKey] === "object") {
                  for (const grandChildKey in characters.list[i][key][childKey]) {
                    if (!template[key][childKey].hasOwnProperty(grandChildKey) && typeof characters.list[i][key][childKey][grandChildKey] !== typeof template[key][childKey][grandChildKey]) {
                      throw new Error("Invalid JSON")
                    }
                  }
                } else if (typeof characters.list[i][key][childKey] === "array" && characters.list[i][key][childKey].length > 0) {
                  for (let j = 0; j < characters.list[i][key][childKey].length; j++) {
                    for (const grandChildKey in characters.list[i][key][childKey][j]) {
                      if (!template[key][childKey][0].hasOwnProperty(grandChildKey) && typeof characters.list[i][key][childKey][j][grandChildKey] !== typeof template[key][childKey][0][grandChildKey]) {
                        throw new Error("Invalid JSON")
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        OBR.notification.show("Invalid JSON")
        return
      }

      const characters = JSON.parse(this.$el.querySelector('textarea').value)

      if (characters.active > codex.characters.list.length - 1) {
        codex.characters.active = 0
      }

      codex.characters.list = characters.list
      console.log("imported!");
      codex.meta.set()
    }
  }
}
</script>

<template>
  <div class="raw">
    <textarea :value="JSON.stringify(codex.characters, null, 2)"></textarea>
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