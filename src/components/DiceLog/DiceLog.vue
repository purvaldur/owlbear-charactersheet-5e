<template>
  <div class="dice-log" :class="{ 'visible': isVisible }">
    <h2>Dice Log</h2>
    <button @click="clearLog">Clear Log</button>
    <div class="roll-list">
      <div v-for="(roll, index) in rolls" :key="index" class="roll-item">
        <strong :title="roll.description">{{ roll.character }}: {{ roll.action }}</strong>
        <div v-if="roll.toHit" :title="roll.toHit.breakdown">
          To Hit: <strong>{{ roll.toHit.total }}</strong>
        </div>
        <div v-if="roll.save">
          Save DC: <strong>{{ roll.save.dc }} ({{ roll.save.ability.toUpperCase() }})</strong>
        </div>
        <div v-for="(die, dieIndex) in roll.dice" :key="dieIndex" :title="die.breakdown">
          <strong>{{ die.total }} {{ die.type || 'Damage' }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./DiceLog.js"></script>
<style src="./DiceLog.css" scoped></style>