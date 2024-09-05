<template>
  <div class="spells">
    <h2>Spells</h2>
    <div v-if="editing" class="spellcasting-ability">
      <label>Spellcasting Ability:
        <select v-model="spellcastingAbility" @change="updateSpellcastingAbility">
          <option v-for="ability in abilities" :key="ability" :value="ability">
            {{ ability.toUpperCase() }}
          </option>
        </select>
      </label>
    </div>
    <div v-for="(spellLevel, level) in spells" :key="level" class="spell-level">
      <h3>{{ getSpellLevelName(level) }}</h3>
      <div v-for="(spell, index) in spellLevel" :key="index" class="spell-item">
        <div class="spell-header">
          <span class="spell-name">{{ spell.name }}</span>
          <span class="spell-school">{{ spell.school }}</span>
        </div>
        <div class="spell-details" v-if="!editing">
          <button @click="castSpell(spell)" class="spell-cast">Cast</button>
          <span class="spell-casting-time">{{ spell.castingTime }}</span>
          <span class="spell-range">{{ spell.range }}</span>
          <span v-if="spell.concentration" class="spell-concentration">Concentration</span>
          <span v-if="spell.attackRoll" class="spell-attack">Attack: +{{ getSpellAttackBonus() }}</span>
          <span v-if="spell.savingThrow" class="spell-save">Save DC: {{ getSpellSaveDC() }} {{ spell.savingThrow }}</span>
          <span v-if="spell.damage" class="spell-damage">Damage: {{ spell.damage }}</span>
        </div>
        <div class="spell-edit" v-else>
          <input v-model="spell.name" placeholder="Name" @change="updateSpell(level, index, spell)" />
          <select v-model="spell.school" @change="updateSpell(level, index, spell)">
            <option v-for="school in spellSchools" :key="school" :value="school">{{ school }}</option>
          </select>
          <input v-model="spell.castingTime" placeholder="Casting Time" @change="updateSpell(level, index, spell)" />
          <input v-model="spell.range" placeholder="Range" @change="updateSpell(level, index, spell)" />
          <label>
            <input type="checkbox" v-model="spell.concentration" @change="updateSpell(level, index, spell)" />
            Concentration
          </label>
          <label>
            <input type="checkbox" v-model="spell.attackRoll" @change="updateSpell(level, index, spell)" />
            Attack Roll
          </label>
          <label>
            <input type="checkbox" v-model="spell.savingThrow" @change="updateSpell(level, index, spell)" />
            Saving Throw
          </label>
          <select v-if="spell.savingThrow" v-model="spell.savingThrow" @change="updateSpell(level, index, spell)">
            <option v-for="ability in abilities" :key="ability" :value="ability">{{ ability.toUpperCase() }}</option>
          </select>
          <label>
            <input type="checkbox" v-model="spell.damage" @change="updateSpell(level, index, spell)" />
            Damage
          </label>
          <input v-if="spell.damage" v-model="spell.damage" placeholder="Damage (e.g. 2d6)" @change="updateSpell(level, index, spell)" />
          <textarea v-model="spell.description" placeholder="Description" @change="updateSpell(level, index, spell)"></textarea>
          <button @click="removeSpell(level, index)" class="remove-spell">Remove</button>
        </div>
      </div>
      <button v-if="editing" @click="addSpell(level)" class="add-spell">Add Spell</button>
    </div>
  </div>
</template>

<script src="./Spells.js"></script>
<style src="./Spells.css" scoped></style>