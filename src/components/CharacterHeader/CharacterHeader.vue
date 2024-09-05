<template>
  <div class="character-header">
    <div class="name-section">
      <h1 v-if="!editing" @click="toggleEditing">{{ character.name }}</h1>
      <input v-else type="text" v-model="character.name" @change="updateCharacter" />
      <button class="edit-toggle" @click="toggleEditing">
        {{ editing ? 'Save' : 'Edit' }}
      </button>
    </div>
    <div class="stats-section">
      <div class="hp-section">
        <input type="number" v-model.number="character.currentHP" @change="updateCharacter" title="Current HP" />
        <span>
          /
        </span>
        <input type="number" v-model.number="character.maxHP" @change="updateCharacter" title="Max HP" />
      </div>
      <input class="temp-hp" type="number" v-model.number="character.tempHP" @change="updateCharacter" placeholder="0" title="Temporary HP" />
      <input class="ac" type="number" v-model.number="character.armorClass" @change="updateCharacter" placeholder="AC" title="Armor Class" />
      <div class="roll-status">
        <button
          @click="toggleRollState('advantage')"
          :class="{ active: rollState === 'advantage' }"
          title="Toggle Advantage"
        >
          ADV
        </button>
        <button
          @click="toggleRollState('disadvantage')"
          :class="{ active: rollState === 'disadvantage' }"
          title="Toggle Disadvantage"
        >
          DISADV
        </button>
      </div>
      <button class="dice-log-toggle" @click="toggleDiceLog">
        {{ diceLogVisible ? 'Hide' : 'Show' }} Dice Log
      </button>
    </div>
  </div>
</template>

<script src="./CharacterHeader.js"></script>
<style src="./CharacterHeader.css" scoped></style>