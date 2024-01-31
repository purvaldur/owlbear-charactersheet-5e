<script src="./obr.js"></script>

<template>
  <div id="main" v-if="!player.editing">
    <div id="header">
      <div id="stats">
        <h1 @click="setMetadata(true)">{{ player.name }}</h1>
        <div>
          <input id="currentHP" title="Current HP" type="text" v-model="player.currentHP" @change="setMetadata(false)"/>
          <p>/</p>
          <input id="maxHP" title="Maximum HP" type="text" v-model="player.maxHP" @change="setMetadata(false)"/>
          <input id="tempHP" title="Temporary HP" type="text" v-model="player.tempHP" @change="setMetadata(false)"/>
          <input id="armorClass" title="Armor Class" type="text" v-model="player.armorClass" @change="setMetadata(false)"/>
        </div>
      </div>
      <div class="advantage">
        <button type="button" @click="setAdvantage(true, i)" :class="{ active: player.advantage}">ADV</button>
        <button type="button" @click="setAdvantage(false, i)" :class="{ active: player.disadvantage}" >DISADV</button>
      </div>
    </div>
    <div id="separator">
      <h2>Actions</h2>
      <button type="button" @click="newAction">
        <p>NEW</p>
        <p>➕</p>
      </button>
    </div>
    <div id="actions">
      <div class="action" v-for="action, i in player.actions">
        <div>
          <button class="name" type="button" @click="increment">{{ action.name }}</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <button type="button" @click="player.editing=!player.editing">CLICK ME</button>
  </div>
</template>