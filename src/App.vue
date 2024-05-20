<script src="./obr.js"></script>

<template>
  <div :class="{ editing: codex.player.editing}" id="main">
    <div :class="{ editing: codex.player.editing}" id="header">
      <div id="meta">
        <div>
          <h1 v-if="!codex.player.editing">{{ codex.player.name }}</h1>
          <input id="name" v-if="codex.player.editing" type="text" v-model="codex.player.name" @change="codex.meta.set(false)"/>
          <img class="editToggle" :class="{ editing: codex.player.editing}" @click="togglePlayerEdit" src="./assets/anvil.svg" title="Edit character sheet">
        </div>
        <div>
          <input id="currentHP" title="Current HP" type="text" v-model="codex.player.currentHP" @change="codex.meta.set(false)"/>
          <p class="slash">/</p>
          <input id="maxHP" title="Maximum HP" type="text" v-model="codex.player.maxHP" @change="codex.meta.set(false)"/>
          <input id="tempHP" title="Temporary HP" type="text" v-model="codex.player.tempHP" @change="codex.meta.set(false)"/>
          <input id="armorClass" title="Armor Class" type="text" v-model="codex.player.armorClass" @change="codex.meta.set(false)"/>
          <div class="advantage">
            <button type="button" @click="setAdvantage(true, i)" :class="{ active: codex.player.advantage}">ADV</button>
            <button type="button" @click="setAdvantage(false, i)" :class="{ active: codex.player.disadvantage}" >DISADV</button>
          </div>
          <img id="sidebarToggle" @click="toggleSidebar()" src="./assets/d20.svg" title="Open dice log">
        </div>
        <div id="hiddenMeta" v-if="codex.player.editing">
          <p>Proficiency bonus: </p>
          <input id="proficiency" title="Proficiency bonus" type="text" v-model="codex.player.proficiency" @change="codex.meta.set(false)"/>
        </div>
      </div>
    </div>
    <div id="stats">
      <div class="stat" v-for="(stat, i) in codex.player.stats">
        <div>
          <input
            type="text"
            v-model="stat.value"
            v-bind:readonly="!codex.player.editing"
            @change="codex.meta.set(false)"
            @click="rollAbility(stat)"
            :class="{editing: codex.player.editing}"
          />
          <p>{{ stat.name }}</p>
        </div>
      </div>
    </div>
    <div class="separator">
      <div id="tabs">
        <button type="button" @click="setTab('skills')" :class="{ active: codex.player.tabs.skills }">Skills</button>
        <button type="button" @click="setTab('actions')" :class="{ active: codex.player.tabs.actions }">Actions</button>
        <button type="button" @click="setTab('spells')" :class="{ active: codex.player.tabs.spells }">Spells</button>
        <button type="button" @click="setTab('traits')" :class="{ active: codex.player.tabs.traits }">Traits</button>
        <button v-if="codex.meta.obr.isGM" type="button" @click="setTab('sheets')" :class="{ active: codex.player.tabs.sheets }">Sheets</button>
        <button v-else type="button" @click="setTab('storage')" :class="{ active: codex.player.tabs.storage }">Backpack</button>
      </div>
    </div>
    <div id="skills" class="section" v-if="codex.player.tabs.skills">
      <div class="skill" v-for="(skill, i) in skillsComputed">
        <img v-if="codex.player.editing" :class="{ editing: skill.editing}" class="editToggle" src="./assets/anvil.svg" @click="toggleSkillEdit(i)" />
        <button v-if="!skill.editing" class="name" type="button" @click="rollSkill(skill)">
          <p>({{ skill.base.toUpperCase() }})&nbsp;</p>
          <p>{{ skill.name }}</p>
          <p>{{ (skill.modifier >= 0 ? '+' : '') + skill.modifier }}</p>
        </button>
        <div v-if="skill.editing" class="buttonEditing">
          <div class="editSection">
            <div>
              <select v-model="codex.player.skills[i].base" @change="codex.meta.set(false)">
                <option v-for="stat in codex.player.stats" :value="stat.name">{{ stat.name }}</option>
              </select>
              <input type="text" v-model="codex.player.skills[i].name" @change="codex.meta.set(false)"/>
            </div>
          </div>
        </div>
        <input type="checkbox" title="Proficiency" v-model="codex.player.skills[i].proficient" @change="codex.meta.set(false)"/>
      </div>
    </div>
    <div id="actions" class="section" v-if="codex.player.tabs.actions">
      <div class="action" v-for="action, i in actionsComputed" :title="action.description">
        <img v-if="codex.player.editing" :class="{ editing: action.editing}" class="editToggle" src="./assets/anvil.svg" @click="toggleActionEdit(i)" />
        <button v-if="!action.editing" class="name" type="button" @click="rollAction(action)">
          <p>[{{ action.castingTime.short }}]&nbsp;</p>
          <p>{{ action.name }}</p>
          <p>
            {{ codex.player.actions[i].rollToHit ? (action.modifier >= 0 ? '+' : '') + action.modifier : "" }}
            {{ codex.player.actions[i].rollToHit && codex.player.actions[i].save ? '| ' : ''}}
            {{ codex.player.actions[i].save ? "DC" + calculateActionSave(action) + ' ' + action.saveTarget.toUpperCase() : "" }}
          </p>
        </button>
        <div v-if="action.editing" class="buttonEditing">
          <div class="editSection name">
            <div>
              <select v-model="codex.player.actions[i].castingTime">
                <option v-for="time in castingTimes" :value="time" :title="time.name">{{ time.short }}</option>
              </select>
              <input type="text" v-model="codex.player.actions[i].name" @change="codex.meta.set(false)"/>
            </div>
          </div>
          <div class="editSection editToHit">
            <div>
              <p>ROLL TO HIT: <b>{{ codex.player.actions[i].rollToHit ? (action.modifier >= 0 ? '+' : '') + action.modifier : "" }}</b></p>
              <label>
                <input type="checkbox" class="switch" title="Roll to hit" v-model="codex.player.actions[i].rollToHit" @change="codex.meta.set(false)"/>
                <span :class="{sliderChecked: codex.player.actions[i].rollToHit}" class="slider"></span>
              </label>
            </div>
            <div v-if="codex.player.actions[i].rollToHit">
              <div class="editSubSection editToHitSection">
                <p>Ability modifier</p>
                <select v-model="codex.player.actions[i].bonusStat" @change="codex.meta.set(false)">
                  <option v-for="stat in codex.player.stats" :value="stat.name">{{ stat.fullName }}</option>
                </select>
              </div>
              <div class="editSubSection editToHitSection">
                <p style="font-size: 1.2em">+</p>
              </div>
              <div class="editSubSection editToHitSection">
                <p>Flat bonus</p>
                <input type="text" v-model="codex.player.actions[i].bonusFlat" @change="codex.meta.set(false)"/>
              </div>
            </div>
            <div v-if="codex.player.actions[i].rollToHit">
              <p>Add proficiency modifier</p>
              <label>
                <input type="checkbox" title="Proficient" v-model="codex.player.actions[i].proficiency" @change="codex.meta.set(false)"/>
                <span :class="{sliderChecked: codex.player.actions[i].proficiency}" class="slider"></span>
              </label>
            </div>
          </div>
          <div class="editSection editSave">
            <div>
              <p>SAVING THROW: <b>{{ codex.player.actions[i].save ? calculateActionSave(action) : "" }}</b></p>
              <label>
                <input type="checkbox" class="switch" title="Saving throw" v-model="codex.player.actions[i].save" @change="codex.meta.set(false)"/>
                <span :class="{sliderChecked: codex.player.actions[i].save}" class="slider"></span>
              </label>
            </div>
            <div v-if="codex.player.actions[i].save">
              <div class="editSubSection editSaveSection">
                <p title="8 + Proficiency + Ability modifier">Ability modifier</p>
                <select v-model="codex.player.actions[i].saveStat" @change="codex.meta.set(false)">
                  <option v-for="stat in codex.player.stats" :value="stat.name">{{ stat.fullName }}</option>
                </select>
              </div>
              <div class="editSubSection editSaveSection"></div>
              <div class="editSubSection editSaveSection">
                <p title="Hard-code DC instead of calculating from ability modifier">Save DC override</p>
                <input type="text" v-model="codex.player.actions[i].saveDC" @change="codex.meta.set(false)" :placeholder="(codex.player.actions[i].save ? calculateActionSave(action) : '')"/>
              </div>
            </div>
            <div v-if="codex.player.actions[i].save">
              <p style="text-transform: uppercase;" title="Ability the target has to use in its saving throw">
                Target ability save:
              </p>
              <select v-model="codex.player.actions[i].saveTarget" @change="codex.meta.set(false)">
                <option v-for="stat in codex.player.stats" :value="stat.name">{{ stat.fullName }}</option>
              </select>
            </div>
          </div>
          <div class="editSection editDamage">
            <div>
              <p>DAMAGE:</p>
              <label>
                <input type="checkbox" class="switch" v-model="codex.player.actions[i].damage" @change="codex.meta.set(false)"/>
                <span :class="{sliderChecked: action.damage}" class="slider"></span>
              </label>
            </div>
            <div v-if="codex.player.actions[i].damage" v-for="(damage, j) in codex.player.actions[i].damageDice">
              <div class="editSubSection editDamageSection">
                <div>
                  <input type="text" v-model="damage.amount" @change="codex.meta.set(false)"/>
                  <p>d</p>
                  <input type="text" v-model="damage.die" @change="codex.meta.set(false)"/>
                  <p>+</p>
                  <select title="Add this ability modifier" v-model="damage.bonusStat" @change="codex.meta.set(false)">
                    <option value=""></option>
                    <option v-for="stat in codex.player.stats" :value="stat.name">{{ stat.name }}</option>
                  </select>
                  <p>+</p>
                  <input title="Flat damage bonus" type="text" v-model="damage.bonusFlat" @change="codex.meta.set(false)"/>
                  <select v-model="damage.type" @change="codex.meta.set(false)">
                    <option v-for="(type, k) in damageTypes" :value="type" :title="type">{{ type }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <div v-if="codex.player.actions[i].damage" class="editSubSection editDamageSection">
                <div>
                  <button type="button" @click="removeDamage(action)"><p>Remove damage</p></button>
                  <button type="button" @click="newDamage(action)"><p>Add damage</p></button>
                </div>
              </div>
            </div>
          </div>
          <div class="editSection editDescription">
            <div class="editSubSection">
              <div>
                <textarea placeholder="Description" v-model="codex.player.actions[i].description" @change="codex.meta.set(false)"></textarea>
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
      <div class="addEntry" v-if="codex.player.editing">
        <button type="button" @click="newAction()"><p>Add action</p></button>
      </div>
    </div>
    <div id="spells" class="section" v-if="codex.player.tabs.spells && !codex.player.spellBookOpen">
      <!-- Set spell stat and bonus -->
      <div v-if="codex.player.editing" class="spellStat">
        <select
          title="Ability to use when calculating spell attack modifier and spell save DC"
          v-model="codex.player.spellStat"
          @change="codex.meta.set(false)"
        >
          <option v-for="stat in codex.player.stats" :value="stat.name">{{ stat.fullName }}</option>
        </select>
        <input title="Flat bonus to spell attack modifier" type="text" v-model="codex.player.spellAttackBonus" @change="codex.meta.set(false)"/>
        <input title="Flat bonus to spell save DC" type="text" v-model="codex.player.spellDCBonus" @change="codex.meta.set(false)"/>
      </div>
      <div class="spellLevel" v-for="(level, i) in spellLevels">
        <div v-if="codex.player.spells[i].length > 0 || codex.player.editing" class="levelHeader">
          <div v-if="codex.player.editing">
            <button
            :title="(`Create new ${level.name.toLowerCase()} ${level.name === 'Cantrip' ? '' : 'spell'} from scratch`)"
            type="button"
            @click="newSpell(i)">+</button>
          </div>
          <h2>{{ level.name }}</h2>
          <!-- If not editing, display spellslots as a pip counter -->
          <div class="spellSlot" v-if="!codex.player.editing">
            <input v-for="j in codex.player.spellSlots[i]" type="checkbox" v-model="j.used" @change="codex.meta.set(false)"/>
          </div>
          <!-- If editing, allow manipulation of spellslots -->
          <div class="spellSlotEdit counter" v-if="level.name !== 'Cantrip' && codex.player.editing">
            <button :title="(`Remove a ${level.name} spell slot`)" type="button" @click="codex.player.spellSlots[i].pop()">-</button>
            <input  :title="(`Amount of ${level.name} spell slots`)" type="text" v-model="codex.player.spellSlots[i].length" readonly @change="codex.player.spellSlots[i]=codex.player.spellSlots[i]"/>
            <button :title="(`Remove a ${level.name} spell slot`)" type="button" @click="codex.player.spellSlots[i].push({used: false})">+</button>
          </div>
        </div>
        <div v-if="codex.player.spells[i].length > 0 || codex.player.editing" class="levelContent">
          <div class="spell" v-for="(spell, j) in spellsComputed[i]">
            <img v-if="codex.player.editing" :class="{ editing: spell.editing}" class="editToggle" src="./assets/anvil.svg" @click="toggleSpellEdit(i, j)" />
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
                  <select v-model="codex.player.spells[i][j].castingTime" @change="codex.meta.set(false)">
                    <option v-for="time in castingTimes" :value="time" :title="time.name">{{ time.short }}</option>
                  </select>
                  <input type="text" v-model="codex.player.spells[i][j].name" @change="codex.meta.set(false)"/>
                </div>
              </div>
              <div class="editSection editToHit">
                <div>
                  <p>ROLL TO HIT: <b>{{ codex.player.spells[i][j].rollToHit ? (spell.modifier >= 0 ? '+' : '') + spell.modifier : '' }}</b></p>
                  <label>
                    <input type="checkbox" class="switch" title="Roll to hit" v-model="codex.player.spells[i][j].rollToHit" @change="codex.meta.set(false)"/>
                    <span :class="{sliderChecked: codex.player.spells[i][j].rollToHit}" class="slider"></span>
                  </label>
                </div>
              </div>
              <div class="editSection editSave">
                <div>
                  <p>SAVING THROW: <b>{{ codex.player.spells[i][j].save ? calculateSpellSave(spell) : '' }}</b></p>
                  <label>
                    <input type="checkbox" class="switch" title="Saving throw" v-model="codex.player.spells[i][j].save" @change="codex.meta.set(false)"/>
                    <span :class="{sliderChecked: codex.player.spells[i][j].save}" class="slider"></span>
                  </label>
                </div>
                <div v-if="codex.player.spells[i][j].save">
                  <p style="text-transform: uppercase;" title="Ability the target has to use in its saving throw">
                    Target ability save:
                  </p>
                  <select v-model="codex.player.spells[i][j].saveTarget" @change="codex.meta.set(false)">
                    <option v-for="stat in codex.player.stats" :value="stat.name">{{ stat.fullName }}</option>
                  </select>
                </div>
              </div>
              <div class="editSection editDamage">
                <div>
                  <p>DAMAGE:</p>
                  <label>
                    <input type="checkbox" class="switch" v-model="codex.player.spells[i][j].damage" @change="codex.meta.set(false)"/>
                    <span :class="{sliderChecked: spell.damage}" class="slider"></span>
                  </label>
                </div>
                <div v-if="codex.player.spells[i][j].damage" v-for="(damage, k) in codex.player.spells[i][j].damageDice">
                  <div class="editSubSection editDamageSection">
                    <div>
                      <input type="text" v-model="damage.amount" @change="codex.meta.set(false)"/>
                      <p>d</p>
                      <input type="text" v-model="damage.die" @change="codex.meta.set(false)"/>
                      <p>+</p>
                      <select title="Add this ability modifier" v-model="codex.player.spells[i][j].damageDice[k].bonusStat" @change="codex.meta.set(false)">
                        <option value=""></option>
                        <option v-for="stat in codex.player.stats" :value="stat.name">{{ stat.name }}</option>
                      </select>
                      <p>+</p>
                      <input title="Flat damage bonus" type="text" v-model="damage.bonusFlat" @change="codex.meta.set(false)"/>
                      <select v-model="codex.player.spells[i][j].damageDice[k].type" @change="codex.meta.set(false)">
                        <option v-for="(type, k) in damageTypes" :value="type" :title="type">{{ type }}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div v-if="codex.player.spells[i][j].damage" class="editSubSection editDamageSection">
                  <div>
                    <button type="button" @click="removeDamage(codex.player.spells[i][j])"><p>Remove damage</p></button>
                    <button type="button" @click="newDamage(codex.player.spells[i][j])"><p>Add damage</p></button>
                  </div>
                </div>
              </div>
              <div class="editSection editDescription">
                <div class="editSubSection">
                  <div>
                    <textarea placeholder="Description" v-model="codex.player.spells[i][j].description" @change="codex.meta.set(false)"></textarea>
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
      <div class="addEntry" v-if="codex.player.editing">
        <button title="Currently only contains spells from the PHB" type="button" @click="toggleSpellbookOpen"><p>Add premade spells from the spellbook</p></button>
      </div>
    </div>
    <div id="spellBook" v-if="codex.player.tabs.spells && codex.player.editing && codex.player.spellBookOpen">
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
    <div id="traits" class="section" v-if="codex.player.tabs.traits">
      <p class="passivePerception">Passive perception: {{ passivePerception }}</p>
      <div class="trait" v-for="trait, i in codex.player.traits">
        <img v-if="codex.player.editing" :class="{ editing: trait.editing}" class="editToggle" src="./assets/anvil.svg" @click="toggleTraitEdit(i)" />
        <div v-if="!trait.editing" class="trait">
          <div class="name">
            <h2 :title="trait.description" @click="rollTrait(trait)">{{ trait.name }}</h2>
            <input v-if="trait.counter.enabled" v-for="j in trait.counter.amount" type="checkbox" v-model="j.used" @change="codex.meta.set(false)" />
          </div>
        </div>
        <div v-if="trait.editing" class="buttonEditing">
          <div class="editSection name">
            <div>
              <input placeholder="Name" type="text" v-model="trait.name" @change="codex.meta.set(false)"/>
            </div>
          </div>
          <div class="editSection editTraitCounter">
            <div>
              <p>Has a counter:</p>
              <label>
                <input type="checkbox" class="switch" title="Roll to hit" v-model="trait.counter.enabled" @change="codex.meta.set(false)"/>
                <span :class="{sliderChecked: trait.counter.enabled}" class="slider"></span>
              </label>
              <div class="counter" v-if="trait.counter.enabled">
                <button :title="(`Increase counter`)" type="button" @click="trait.counter.amount.pop()">-</button>
                <input  :title="(`Amount`)" type="text" v-model="trait.counter.amount.length" readonly @change="trait.counter=trait.counter"/>
                <button :title="(`Decrease counter`)" type="button" @click="trait.counter.amount.push({used: false})">+</button>
              </div>
            </div>
          </div>
          <div class="editSection editDescription">
            <div>
              <textarea placeholder="Description" v-model="codex.player.traits[i].description" @change="codex.meta.set(false)"></textarea>
            </div>
          </div>
          <div class="editSection editDelete">
            <div>
              <button type="button" @click="removeTrait(i)"><p>Remove trait</p></button>
            </div>
          </div>
        </div>
      </div>
      <div class="addEntry" v-if="codex.player.editing">
        <button type="button" @click="newTrait()"><p>Add trait</p></button>
      </div>
    </div>
    <div id="storage" class="section" v-if="codex.player.tabs.storage">
      <Storage />
    </div>
    <div id="sheets" class="section" v-if="codex.player.tabs.sheets">
      <Sheets />
    </div>
  </div>
  <div id="sidebar" v-if="sidebar.display">
    <div id="sidebarHeader">
      <h1>Dice log</h1>
      <div id="genericDice">
        <button type="button" @click="rollGeneric('1d4')">1d4</button>
        <button type="button" @click="rollGeneric('1d6')">1d6</button>
        <button type="button" @click="rollGeneric('1d8')">1d8</button>
        <button type="button" @click="rollGeneric('1d10')">1d10</button>
        <button type="button" @click="rollGeneric('1d12')">1d12</button>
        <button type="button" @click="rollGeneric('1d20')">1d20</button>
      </div>
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
            <span v-if="entry.advantage">
              <span :class="{green : entry.roll1 == entry.upper}">{{ entry.roll1 }}</span>
              |
              <span :class="{green : entry.roll2 == entry.upper}">{{ entry.roll2 }}</span>
            </span>
            <span v-else-if="entry.disadvantage">
              <span :class="{red : entry.roll1 == entry.lower}">{{ entry.roll1 }}</span>
              |
              <span :class="{red : entry.roll2 == entry.lower}">{{ entry.roll2 }}</span>
            </span>
            <span v-else><b>
              {{ entry.roll1 }}</b>
            </span>
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