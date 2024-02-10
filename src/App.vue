<script src="./obr.js"></script>

<template>
  <div id="main" v-if="!player.editing">
    <div id="header">
      <div id="meta">
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
    <div class="separator"></div>
    <div id="stats">
      <div class="stat" v-for="(stat, i) in player.stats">
        <div>
          <input type="text" v-model="stat.value" @change="setMetadata(false)"/>
          <p>{{ stat.name }}</p>
        </div>
      </div>
    </div>
    <div class="separator">
      <div id="tabs">
        <button type="button" @click="setTab('skills')" :class="{ active: player.tabs.skills }">Skills</button>
        <button type="button" @click="setTab('actions')" :class="{ active: player.tabs.actions }">Actions</button>
        <button type="button" @click="setTab('spells')" :class="{ active: player.tabs.spells }">Spells</button>
      </div>
    </div>
    <div id="skills" class="section" v-if="player.tabs.skills">
      <div class="skill" v-for="(skill, i) in skillsComputed">
        <button class="name" type="button" @click="rollSkill(skill)">
          <p>({{ skill.base.toUpperCase() }})&nbsp;</p>
          <p>{{ skill.name }}</p>
          <p>{{ (skill.modifier >= 0 ? '+' : '') + skill.modifier }}</p>
        </button>
        <input type="checkbox" title="Proficiency" v-model="player.skills[i].proficient" @change="setMetadata(false)"/>
      </div>
    </div>
    <div id="actions" class="section" v-if="player.tabs.actions">
      <div class="action" v-for="action, i in player.actions">
          <button class="name" type="button" @click="increment">
            <p>[{{ action.castingTime.short }}]&nbsp;</p>
            <p>{{ action.name }}</p>
            <p>{{ calculateActionBonus(action) }}</p>
          </button>
      </div>
    </div>
    <div id="spells" class="section" v-if="player.tabs.spells">
      <div class="spell" v-for="spell, i in player.spells">
          <button class="name" type="button" @click="increment">
            <p>[{{ spell.level }}][{{ spell.castingTime.short }}]&nbsp;</p>
            <p>{{ spell.name }}</p>
            <p>
              {{ spell.attack === true ? calculateSpellAttack() : '' }}
              {{ spell.save !== null ? "DC"+calculateSpellSave() : '' }}
            </p>
          </button>
      </div>
    </div>
  </div>
  <div v-else>
    <button type="button" @click="player.editing=!player.editing">CLICK ME</button>
  </div>
</template>