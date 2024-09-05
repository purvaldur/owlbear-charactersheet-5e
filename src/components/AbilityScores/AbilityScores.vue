<template>
  <div class="ability-scores">
    <div v-for="(stat, key) in stats" :key="key" class="ability-score">
      <div class="score-box">
        <template v-if="!editing">
          <button class="score-button" @click="rollAbilityCheck(key)">
            <span class="score-modifier">{{ getModifierString(key) }}</span>
          </button>
        </template>
        <input
          v-else
          type="number"
          v-model.number="stat.value"
          @change="updateStat(key)"
        />
      </div>
      <span class="score-name">{{ key.toUpperCase() }}</span>
    </div>
  </div>
</template>

<script src="./AbilityScores.js"></script>
<style src="./AbilityScores.css" scoped></style>