<script src="./obr.js"></script>

<template>
  <div id="main">
    <div id="header">
      <h1 @click="setMetadata(true)">{{ msg }} {{ player.count }}</h1>
      <div class="advantage">
        <button type="button" @click="setAdvantage(true, i)" :class="{ active: player.advantage}">ADV</button>
        <button type="button" @click="setAdvantage(false, i)" :class="{ active: player.disadvantage}" >DISADV</button>
      </div>
    </div>
    <div class="action" v-for="action, i in player.actions">
      <div>
        <button class="name" type="button" @click="increment">{{ action.name }}</button>
      </div>
    </div>
  </div>
</template>