<script src="./obr.js"></script>

<template>
  <div id="main">
    <div id="header">
      <div id="meta">
        <div>
          <h1 @click="setMetadata(true)">{{ player.name }}</h1>
          <img class="editToggle" :class="{ editing: player.editing}" @click="player.editing = !player.editing" src="./assets/anvil.svg" title="Edit character sheet">
        </div>
        <div>
          <input id="currentHP" title="Current HP" type="text" v-model="player.currentHP" @change="setMetadata(false)"/>
          <p>/</p>
          <input id="maxHP" title="Maximum HP" type="text" v-model="player.maxHP" @change="setMetadata(false)"/>
          <input id="tempHP" title="Temporary HP" type="text" v-model="player.tempHP" @change="setMetadata(false)"/>
          <input id="armorClass" title="Armor Class" type="text" v-model="player.armorClass" @change="setMetadata(false)"/>
          <div class="advantage">
            <button type="button" @click="setAdvantage(true, i)" :class="{ active: player.advantage}">ADV</button>
            <button type="button" @click="setAdvantage(false, i)" :class="{ active: player.disadvantage}" >DISADV</button>
          </div>
          <img id="sidebarToggle" @click="toggleSidebar()" src="./assets/d20.svg" title="Open dice log">
        </div>
      </div>
    </div>
    <div id="stats">
      <div class="stat" v-for="(stat, i) in player.stats">
        <div>
          <input 
            type="text" 
            v-model="stat.value" 
            v-bind:readonly="!player.editing"
            @change="setMetadata(false)"
            @click="rollAbility(stat)"
            :class="{editing: player.editing}" 
          />
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
        <img v-if="player.editing" :class="{ editing: skill.editing}" class="editToggle" src="./assets/anvil.svg" @click="toggleSkillEdit(i)" />
        <button v-if="!skill.editing" class="name" type="button" @click="rollSkill(skill)">
          <p>({{ skill.base.toUpperCase() }})&nbsp;</p>
          <p>{{ skill.name }}</p>
          <p>{{ (skill.modifier >= 0 ? '+' : '') + skill.modifier }}</p>
        </button>
        <div v-if="skill.editing" class="buttonEditing">
          <div class="editSection">
            <div>
              <select v-model="player.skills[i].base" @change="setMetadata(false)">
                <option v-for="stat in player.stats" :value="stat.name">{{ stat.name }}</option>
              </select>
              <input type="text" v-model="player.skills[i].name" @change="setMetadata(false)"/>
            </div>
          </div>
        </div>
        <input type="checkbox" title="Proficiency" v-model="player.skills[i].proficient" @change="setMetadata(false)"/>
      </div>
    </div>
    <div id="actions" class="section" v-if="player.tabs.actions">
      <div class="action" v-for="action, i in actionsComputed">
        <img v-if="player.editing" :class="{ editing: action.editing}" class="editToggle" src="./assets/anvil.svg" @click="toggleActionEdit(i)" />
        <button v-if="!action.editing" class="name" type="button" @click="rollAction(action)">
          <p>[{{ action.castingTime.short }}]&nbsp;</p>
          <p>{{ action.name }}</p>
          <p>
            {{ player.actions[i].rollToHit ? (action.modifier >= 0 ? '+' : '') + action.modifier : "" }}
            {{ player.actions[i].save ? "| DC" + calculateActionSave(action) + ' ' + action.saveTarget.toUpperCase() : "" }}
          </p>
        </button>
        <div v-if="action.editing" class="buttonEditing">
          <div class="editSection name">
            <div>
              <select v-model="player.actions[i].castingTime">
                <option v-for="time in castingTimes" :value="time" :title="time.name">{{ time.short }}</option>
              </select>
              <input type="text" v-model="player.actions[i].name" @change="setMetadata(false)"/>
            </div>
          </div>
          <div class="editSection editToHit">
            <div>
              <p>ROLL TO HIT: <b>{{ player.actions[i].rollToHit ? (action.modifier >= 0 ? '+' : '') + action.modifier : "" }}</b></p>
              <label>
                <input type="checkbox" class="switch" title="Roll to hit" v-model="player.actions[i].rollToHit" @change="setMetadata(false)"/>
                <span :class="{sliderChecked: player.actions[i].rollToHit}" class="slider"></span>
              </label>
            </div>
            <div v-if="player.actions[i].rollToHit">
              <div class="editToHitSection">
                <p>Ability modifier</p>
                <select v-model="player.actions[i].bonusStat" @change="setMetadata(false)">
                  <option v-for="stat in player.stats" :value="stat.name">{{ stat.fullName }}</option>
                </select>
              </div>
              <div class="editToHitSection">
                <p style="font-size: 1.2em">+</p>
              </div>
              <div class="editToHitSection">
                <p>Flat bonus</p>
                <input type="text" v-model="player.actions[i].bonusFlat" @change="setMetadata(false)"/>
              </div>
            </div>
            <div v-if="player.actions[i].rollToHit">
              <p>Add proficiency modifier</p>
              <label>
                <input type="checkbox" title="Proficient" v-model="player.actions[i].proficiency" @change="setMetadata(false)"/>
                <span :class="{sliderChecked: player.actions[i].proficiency}" class="slider"></span>
              </label>
            </div>
          </div>
          <div class="editSection editSave">
            <div>
              <p>SAVING THROW: <b>{{ player.actions[i].save ? calculateActionSave(action) : "" }}</b></p>
              <label>
                <input type="checkbox" class="switch" title="Saving throw" v-model="player.actions[i].save" @change="setMetadata(false)"/>
                <span :class="{sliderChecked: player.actions[i].save}" class="slider"></span>
              </label>
            </div>
            <div v-if="player.actions[i].save">
              <div class="editSaveSection">
                <p title="8 + Proficiency + Ability modifier">Ability modifier</p>
                <select v-model="player.actions[i].saveStat" @change="setMetadata(false)">
                  <option v-for="stat in player.stats" :value="stat.name">{{ stat.fullName }}</option>
                </select>
              </div>
              <div class="editSaveSection"></div>
              <div class="editSaveSection">
                <p title="Hard-code DC instead of calculating from ability modifier">Save DC override</p>
                <input type="text" v-model="player.actions[i].saveDC" @change="setMetadata(false)" :placeholder="(player.actions[i].save ? calculateActionSave(action) : '')"/>
              </div>
            </div>
            <div v-if="player.actions[i].save">
              <p style="text-transform: uppercase;" title="Ability the target has to use in its saving throw">
                Target ability save:
              </p>
              <select v-model="player.actions[i].saveTarget" @change="setMetadata(false)">
                <option v-for="stat in player.stats" :value="stat.name">{{ stat.fullName }}</option>
              </select>
            </div>
          </div>
          <div class="editSection editDamage">
            <div>
              <p>DAMAGE: {{ action.damage }}</p>
              <label>
                <input type="checkbox" class="switch" v-model="player.actions[i].damage" @change="setMetadata(false)"/>
                <span :class="{sliderChecked: action.damage}" class="slider"></span>
              </label>
            </div>
            <div v-if="player.actions[i].damage">
              <div class="editDamageSection" v-for="(damage, j) in player.actions[i].damageDice">
                <p>Damage dice+</p>
                <!-- <input type="text" v-model="player.actions[i].damageDice[j]."> -->
                <!-- <input type="text" v-model="player.actions[i].damageDice[j].amount" @change="setMetadata(false)"/> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="spells" class="section" v-if="player.tabs.spells">
      <div class="spell" v-for="spell, i in player.spells">
        <img v-if="player.editing" class="editToggle" src="./assets/anvil.svg" />
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
  <div id="sidebar" v-if="sidebar.display">
    <div id="sidebarHeader">
      <h1>Dice log</h1>
    </div>
    <div id="diceLog">
      <div class="logEntry" v-for="entry in sidebar.log" ref="logEntry">
        <div>
          <p><b>{{ entry.name }}</b>: {{ entry.action }}</p>
          <p v-if="entry.d20">
            [
            <span v-if="entry.advantage"><b class="green">{{ entry.upper }}</b> | {{ entry.lower }}</span>
            <span v-else-if="entry.disadvantage">{{ entry.upper }} | <b class="red">{{ entry.lower }}</b></span>
            <span v-else><b>{{ entry.roll1 }}</b></span>
            ] 
            {{ (entry.modifier >= 0 ? '+ ' : '') + entry.modifier}} = {{ entry.total }}
          </p>
          <p v-if="entry.damage">
            <span v-for="(damage, i) in entry.damageDice">
              {{ damage.total }} {{ damage.type }} {{ i < entry.damageDice.length - 1 ? '+ ' : '' }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>