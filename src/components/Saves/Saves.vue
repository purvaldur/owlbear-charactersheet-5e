<template>
  <div class="saves">
    <h2>Saving throws</h2>
    <div v-for="(stat, key) in stats" :key="key" class="save-item">
      <span class="save-name">{{ stat.name }}</span>
      <span class="save-modifier">{{ getSaveModifier(key) }}</span>
    </div>
  </div>
</template>

<script src="./Saves.js"></script>
<style src="./Saves.css" scoped></style>