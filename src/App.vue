<script src="./obr.js"></script>

<template>
  <div :class="{ editing: player.editing}" id="main">
    <div :class="{ editing: player.editing}" id="header">
      <div id="meta">
        <div>
          <h1 v-if="!player.editing">{{ player.name }}</h1>
          <input id="name" v-if="player.editing" type="text" v-model="player.name" @change="setMetadata(false)"/>
          <img class="editToggle" :class="{ editing: player.editing}" @click="togglePlayerEdit" src="./assets/anvil.svg" title="Edit character sheet">
        </div>
        <div>
          <input id="currentHP" title="Current HP" type="text" v-model="player.currentHP" @change="setMetadata(false)"/>
          <p class="slash">/</p>
          <input id="maxHP" title="Maximum HP" type="text" v-model="player.maxHP" @change="setMetadata(false)"/>
          <input id="tempHP" title="Temporary HP" type="text" v-model="player.tempHP" @change="setMetadata(false)"/>
          <input id="armorClass" title="Armor Class" type="text" v-model="player.armorClass" @change="setMetadata(false)"/>
          <div class="advantage">
            <button type="button" @click="setAdvantage(true, i)" :class="{ active: player.advantage}">ADV</button>
            <button type="button" @click="setAdvantage(false, i)" :class="{ active: player.disadvantage}" >DISADV</button>
          </div>
          <img id="sidebarToggle" @click="toggleSidebar()" src="./assets/d20.svg" title="Open dice log">
        </div>
        <div id="hiddenMeta" v-if="player.editing">
          <p>Proficiency bonus: </p>
          <input id="proficiency" title="Proficiency bonus" type="text" v-model="player.proficiency" @change="setMetadata(false)"/>
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
        <button type="button" @click="setTab('traits')" :class="{ active: player.tabs.traits }">Traits</button>
        <button type="button" @click="setTab('sheets')" :class="{ active: player.tabs.sheets }">Sheets</button>
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
      <div class="action" v-for="action, i in actionsComputed" :title="action.description">
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
              <div class="editSubSection editToHitSection">
                <p>Ability modifier</p>
                <select v-model="player.actions[i].bonusStat" @change="setMetadata(false)">
                  <option v-for="stat in player.stats" :value="stat.name">{{ stat.fullName }}</option>
                </select>
              </div>
              <div class="editSubSection editToHitSection">
                <p style="font-size: 1.2em">+</p>
              </div>
              <div class="editSubSection editToHitSection">
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
              <div class="editSubSection editSaveSection">
                <p title="8 + Proficiency + Ability modifier">Ability modifier</p>
                <select v-model="player.actions[i].saveStat" @change="setMetadata(false)">
                  <option v-for="stat in player.stats" :value="stat.name">{{ stat.fullName }}</option>
                </select>
              </div>
              <div class="editSubSection editSaveSection"></div>
              <div class="editSubSection editSaveSection">
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
              <p>DAMAGE:</p>
              <label>
                <input type="checkbox" class="switch" v-model="player.actions[i].damage" @change="setMetadata(false)"/>
                <span :class="{sliderChecked: action.damage}" class="slider"></span>
              </label>
            </div>
            <div v-if="player.actions[i].damage" v-for="(damage, j) in player.actions[i].damageDice">
              <div class="editSubSection editDamageSection">
                <div>
                  <input type="text" v-model="damage.amount" @change="setMetadata(false)"/>
                  <p>d</p>
                  <input type="text" v-model="damage.die" @change="setMetadata(false)"/>
                  <p>+</p>
                  <select title="Add this ability modifier" v-model="damage.bonusStat" @change="setMetadata(false)">
                    <option value=""></option>
                    <option v-for="stat in player.stats" :value="stat.name">{{ stat.name }}</option>
                  </select>
                  <p>+</p>
                  <input title="Flat damage bonus" type="text" v-model="damage.bonusFlat" @change="setMetadata(false)"/>
                  <select v-model="damage.type" @change="setMetadata(false)">
                    <option v-for="(type, k) in damageTypes" :value="type" :title="type">{{ type }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <div v-if="player.actions[i].damage" class="editSubSection editDamageSection">
                <div>
                  <button type="button" @click="removeActionDamage(action)"><p>Remove damage</p></button>
                  <button type="button" @click="newActionDamage(action)"><p>Add damage</p></button>
                </div>
              </div>
            </div>
          </div>
          <div class="editSection editDescription">
            <div class="editSubSection">
              <div>
                <textarea placeholder="Description" v-model="player.actions[i].description" @change="setMetadata(false)"></textarea>
              </div>
            </div>
          </div>
          <div class="editSection editDelete">
            <div>
              <button type="button" @click="removeAction(i)"><p>Remove action</p></button>
            </div>
          </div>
        </div>
      </div>
      <div class="addEntry" v-if="player.editing">
        <button type="button" @click="newAction()"><p>Add action</p></button>
      </div>
    </div>
    <div id="spells" class="section" v-if="player.tabs.spells && !player.spellBookOpen">
      <!-- Set spell stat and bonus -->
      <div v-if="player.editing" class="spellStat">
        <select 
          title="Ability to use when calculating spell attack modifier and spell save DC"
          v-model="player.spellStat"
          @change="setMetadata(false)"
        >
          <option v-for="stat in player.stats" :value="stat.name">{{ stat.fullName }}</option>
        </select>
        <input title="Flat bonus to spell attack modifier" type="text" v-model="player.spellAttackBonus" @change="setMetadata(false)"/>
        <input title="Flat bonus to spell save DC" type="text" v-model="player.spellDCBonus" @change="setMetadata(false)"/>
      </div>
      <div class="spellLevel" v-for="(level, i) in spellLevels">
        <div v-if="player.spells[i].length > 0" class="levelHeader">
          <h2>{{ level.name }}</h2>
        </div>
        <div v-if="player.spells[i].length > 0" class="levelContent">
          <div class="spell" v-for="(spell, j) in spellsComputed[i]">
            <img v-if="player.editing" :class="{ editing: spell.editing}" class="editToggle" src="./assets/anvil.svg" @click="toggleSpellEdit(i, j)" />
            <button v-if="!spell.editing" :title="spell.description" class="name" type="button" @click="rollSpell(spell)">
              <p>[{{ spell.castingTime.short }}]&nbsp;</p>
              <p>{{ spell.name }}</p>
              <p>
                {{ spell.rollToHit ? (spell.modifier >= 0 ? '+' : '') + spell.modifier : '' }}
                {{ spell.rollToHit && spell.save ? '| ' : ''}}
                {{ spell.save ? "DC"+spell.saveDC + ' ' + spell.saveTarget.toUpperCase() : '' }}
              </p>
            </button>
            <div v-if="spell.editing" class="buttonEditing">
              <div class="editSection name">
                <div>
                  <select v-model="player.spells[i][j].castingTime" @change="setMetadata(false)">
                    <option v-for="time in castingTimes" :value="time" :title="time.name">{{ time.short }}</option>
                  </select>
                  <input type="text" v-model="player.spells[i][j].name" @change="setMetadata(false)"/>
                </div>
              </div>
              <div class="editSection editToHit">
                <div>
                  <p>ROLL TO HIT: <b>{{ player.spells[i][j].rollToHit ? (spell.modifier >= 0 ? '+' : '') + spell.modifier : '' }}</b></p>
                  <label>
                    <input type="checkbox" class="switch" title="Roll to hit" v-model="player.spells[i][j].rollToHit" @change="setMetadata(false)"/>
                    <span :class="{sliderChecked: player.spells[i][j].rollToHit}" class="slider"></span>
                  </label>
                </div>
              </div>
              <div class="editSection editSave">
                <div>
                  <p>SAVING THROW: <b>{{ player.spells[i][j].save ? calculateSpellSave(spell) : '' }}</b></p>
                  <label>
                    <input type="checkbox" class="switch" title="Saving throw" v-model="player.spells[i][j].save" @change="setMetadata(false)"/>
                    <span :class="{sliderChecked: player.spells[i][j].save}" class="slider"></span>
                  </label>
                </div>
                <div v-if="player.spells[i][j].save">
                  <p style="text-transform: uppercase;" title="Ability the target has to use in its saving throw">
                    Target ability save:
                  </p>
                  <select v-model="player.spells[i][j].saveTarget" @change="setMetadata(false)">
                    <option v-for="stat in player.stats" :value="stat.name">{{ stat.fullName }}</option>
                  </select>
                </div>
              </div>
              <div class="editSection editDamage">
                <div>
                  <p>DAMAGE:</p>
                  <label>
                    <input type="checkbox" class="switch" v-model="player.spells[i][j].damage" @change="setMetadata(false)"/>
                    <span :class="{sliderChecked: spell.damage}" class="slider"></span>
                  </label>
                </div>
                <div v-if="player.spells[i][j].damage" v-for="(damage, k) in player.spells[i][j].damageDice">
                  <div class="editSubSection editDamageSection">
                    <div>
                      <input type="text" v-model="damage.amount" @change="setMetadata(false)"/>
                      <p>d</p>
                      <input type="text" v-model="damage.die" @change="setMetadata(false)"/>
                      <p>+</p>
                      <select title="Add this ability modifier" v-model="player.spells[i][j].damageDice[k].bonusStat" @change="setMetadata(false)">
                        <option value=""></option>
                        <option v-for="stat in player.stats" :value="stat.name">{{ stat.name }}</option>
                      </select>
                      <p>+</p>
                      <input title="Flat damage bonus" type="text" v-model="damage.bonusFlat" @change="setMetadata(false)"/>
                      <select v-model="player.spells[i][j].damageDice[k].type" @change="setMetadata(false)">
                        <option v-for="(type, k) in damageTypes" :value="type" :title="type">{{ type }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="editSection editDescription">
                <div class="editSubSection">
                  <div>
                    <textarea placeholder="Description" v-model="player.spells[i][j].description" @change="setMetadata(false)"></textarea>
                  </div>
                </div>
              </div>
              <div class="editSection editDelete">
                <div>
                  <button type="button" @click="removeSpell(i, j)"><p>Remove spell</p></button>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
      <div class="addEntry" v-if="player.editing">
        <button title="Add a spell from the spellook" type="button" @click="toggleSpellbookOpen"><p>Add new spell</p></button>
        <button title="Create a new spell from scratch" type="button" @click="newSpell()"><p>Create new spell</p></button>
      </div>
    </div>
    <div id="spellBook" v-if="player.tabs.spells && player.editing && player.spellBookOpen">
      <input class="search" type="text" v-model="spellBookSearch" placeholder="Search spellbook"/>
      <div 
      v-for="bookSpell, i in searchSpellBookComputed"
      class="spell" 
      :class="{ selected: spellBookSelected.indexOf(bookSpell) !== -1}"
      >
        <button :title="bookSpell.description" class="name" type="button" @click="addBookSpell(bookSpell)">
          <p>[{{ bookSpell.level }}][{{ bookSpell.castingTime.short }}] {{ bookSpell.name }}</p>
          <p>
            {{ bookSpell.rollToHit ? (bookSpell.modifier >= 0 ? '+' : '') + bookSpell.modifier : '' }}
            {{ bookSpell.rollToHit && bookSpell.save ? '| ' : ''}}
            {{ bookSpell.save ? "DC"+bookSpell.saveDC + ' ' + bookSpell.saveTarget.toUpperCase() : '' }}
          </p>
        </button>
      </div>
      <div class="bottomFixed">
        <button type="button" @click="toggleSpellbookOpen"><p>Close spellbook</p></button>
        <button type="button" @click="addBookSpells()"><p>Add {{ spellBookSelected.length }} spells</p></button>
      </div>
    </div>
    <div id="traits" class="section" v-if="player.tabs.traits">
      <p class="passivePerception">Passive perception: {{ passivePerception }}</p>
      <div class="trait" v-for="trait, i in player.traits">
        <img v-if="player.editing" :class="{ editing: trait.editing}" class="editToggle
        " src="./assets/anvil.svg" @click="toggleTraitEdit(i)" />
        <button v-if="!trait.editing" class="name" type="button" :title="trait.description" @click="rollTrait(trait)">
          <p>{{ trait.name }}</p>
        </button>
        <div v-if="trait.editing" class="buttonEditing">
          <div class="editSection name">
            <div>
              <input placeholder="Name" type="text" v-model="player.traits[i].name" @change="setMetadata(false)"/>
            </div>
          </div>
          <div class="editSection editDescription">
            <div>
              <textarea placeholder="Description" v-model="player.traits[i].description" @change="setMetadata(false)"></textarea>
            </div>
          </div>
          <div class="editSection editDelete">
            <div>
              <button type="button" @click="removeTrait(i)"><p>Remove trait</p></button>
            </div>
          </div>
        </div>
      </div>
      <div class="addEntry" v-if="player.editing">
        <button type="button" @click="newTrait()"><p>Add trait</p></button>
      </div>
    </div>
    <div id="sheets" class="section" v-if="player.tabs.sheets">
      <div class="sheet" v-for="character, i in characters.list">
        <img v-if="player.editing" :class="{ editing: character.sectionEditing}" class="editToggle sheetEdit" src="./assets/anvil.svg" @click="togglePlayerSectionEdit(i)" />
        <button v-if="!character.sectionEditing" class="name" type="button" @click="changeCharacter(i)">
          <p>{{ character.name }}</p>
        </button>
        <div v-if="character.sectionEditing" class="buttonEditing">
          <div class="editSection name">
            <div>
              <input placeholder="Name" type="text" v-model="character.name" @change="setMetadata(false)"/>
            </div>
          </div>
          <div class="editSection editDelete">
            <div>
              <button title="THIS ACTION IS PERMANENT!" type="button" @click="removeCharacter(i)"><p>DELETE CHARACTER</p></button>
            </div>
          </div>
        </div>
      </div>
      <div class="addEntry" v-if="player.editing">
        <button type="button" @click="newCharacter()"><p>Create new sheet</p></button>
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
          <p>
            <b>{{ entry.name }}</b>: 
            <span :title="(entry.description ? entry.description : '')">{{ entry.action }}</span>
          </p>
          <p v-if="entry.d20">
            [
            <span v-if="entry.advantage"><b class="green">{{ entry.upper }}</b> | {{ entry.lower }}</span>
            <span v-else-if="entry.disadvantage">{{ entry.upper }} | <b class="red">{{ entry.lower }}</b></span>
            <span v-else><b>{{ entry.roll1 }}</b></span>
            ] 
            {{ (entry.modifier >= 0 ? '+ ' : '') + entry.modifier}} = {{ entry.total }}
          </p>
          <p v-if="entry.damage">
            <span v-for="(damage, i) in entry.damageDice" :title="damage.tooltip">
              {{ damage.total }} {{ damage.type }} {{ i < entry.damageDice.length - 1 ? '+ ' : '' }}
            </span>
          </p>
          <button v-if="entry.save" type="button" @click="rollSave(entry.saveTarget)">
            <p>
              DC {{ entry.saveDC }} {{ entry.saveTarget.toUpperCase() }} save
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
if 