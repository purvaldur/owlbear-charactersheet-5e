<template>
  <div class="actions">
    <h2>Actions</h2>
    <span v-if="editing" class="add" @click="addAction()" title="Create a new action">+</span>
    <div v-for="(action, index) in actions" :key="index" class="action-item">
      <div v-if="!editing || !action.editing" class="action-button" @click="performAction(action)" :title="action.description">
        <span class="action-name">{{ action.name ? action.name : 'Action #' + (index+1) }}</span>
        <!-- <span class="action-type">[{{ action.type }}]</span> -->
        <span class="action-to-hit">
          {{ action.toHit.enabled ? formatNumber(action.toHit.modifier) : '' }}
          {{ action.toHit.enabled && action.save.enabled ? '|' : '' }}
          {{ action.save.enabled ? 'DC' + action.save.dc : '' }}
        </span>
      </div>
      <img v-if="editing && !action.editing" class="action-edit-button" src="../../assets/gear.svg" @click="editAction(index, action)">
      <div class="action-edit" v-if="editing && action.editing">
        <input class="edit-name" v-model="action.name" placeholder="Name" @change="updateAction(index, action)" />
        <div class="edit-section" :class="{ end: !action.toHit.enabled }" title="Toggle whether this action makes an attack roll">
          <span>Roll to hit: <b>{{ action.toHit.enabled ? formatNumber(action.toHit.modifier) : '' }}</b></span>
          <label>
            <input type="checkbox" v-model="action.toHit.enabled" @change="updateAction(index, action)" />
            <span class="slider" :class="{ checked: action.toHit.enabled }"></span>
           </label>
        </div>
        <div v-if="action.toHit.enabled" class="edit-section" title="Select what stat modifier to use for this action">
          <span>Base stat:</span>
          <select v-model="action.toHit.baseStat" @change="updateAction(index, action)">
            <option v-for="(stat, key) in stats" :key="key" :value="key">{{ stat.name }}</option>
          </select>
        </div>
        <div v-if="action.toHit.enabled" class="edit-section" title="Give the modifier a flat bonus (eg. a +1 weapon)">
          <span>Flat bonus:</span>
          <input type="number" placeholder="0" v-model="action.toHit.flatBonus" @change="updateAction(index, action)" />
        </div>
        <div v-if="action.toHit.enabled" class="edit-section end" title="Toggle whether to add your proficiency bonus to the modifier">
          <span>Add proficiency: </span>
          <label>
            <input type="checkbox" v-model="action.toHit.proficient" @change="updateAction(index, action)"/>
            <span class="slider" :class="{ checked: action.toHit.proficient }"></span>
           </label>
        </div>
        <div class="edit-section" :class="{ end: !action.save.enabled }"
          title="Toggle whether this action requires another creature to roll a saving throw

Automatic DC calculation is 8+<STAT>+<PROFICIENCY>

Alternatively the DC can be hard-set to a custom number">
          <span>Saving throw: <b>{{ action.save.enabled ? 'DC' + action.save.dc : '' }}</b></span>
          <label>
            <input type="checkbox" v-model="action.save.enabled" @change="updateAction(index, action)" />
            <span class="slider" :class="{ checked: action.save.enabled }"></span>
           </label>
        </div>
        <div v-if="action.save.enabled" class="edit-section" title="Select what stat modifier to use for the saving throw">
          <span>Base stat:</span>
          <select v-model="action.save.baseStat" @change="updateAction(index, action)">
            <option v-for="(stat, key) in stats" :key="key" :value="key">{{ stat.name }}</option>
          </select>
        </div>
        <div v-if="action.save.enabled" class="edit-section end" title="Override the automatic calculation (optional)">
          <span>Save DC override:</span>
          <input type="number" placeholder="0" v-model="action.save.override" @change="updateAction(index, action)" />
        </div>
        <div class="edit-section" title="Add a dice roll to the action">
          <span>Dice rolls: </span>
          <span class="add" @click="addDice(index, action)">+</span>
        </div>
        <div class="edit-section dice end">
          <div v-for="(dice, diceIndex) in action.dice">
            <div class="name">
              <span>Dice roll #{{ diceIndex+1 }}</span>
              <img src="../../assets/delete.svg" @click="removeDice(diceIndex, index, action)" title="Delete this dice roll from the action">
            </div>
            <input type="number" v-model="dice.count" @change="updateAction(index, action)" placeholder="1" title="Amount of dice" />
            d
            <input type="number" v-model="dice.sides" @change="updateAction(index, action)" placeholder="4" title="Type of dice"/>
            +
            <select v-model="dice.baseStat" @change="updateAction(index, action)" title="Add this stat's modifier to the result">
              <option :value="null"></option>
              <option v-for="(stat, key) in stats" :key="key" :value="key">{{ key }}</option>
            </select>
            +
            <input type="number" v-model="dice.flatBonus" @change="updateAction(index, action)" placeholder="0" title="Give the result a flat bonus (eg. a +1 weapon)"/>
            <select v-model="dice.type" @change="updateAction(index, action)" title="Type of damage">
              <option v-for="(type) in damageTypes":key="type" :value="type">{{ type }}</option>
            </select>
          </div>
        </div>
        <textarea v-model="action.description" placeholder="Description" @change="updateAction(index, action)"></textarea>
        <button @click="editAction(index, action)" class="action-bottom green">Save action</button>
        <button @click="removeAction(index)" class="action-bottom red">Delete action</button>
      </div>
    </div>
    <!-- <button v-if="editing" @click="addAction" class="action-new green">Add Action</button> -->
  </div>
</template>

<script src="./Actions.js"></script>
<style src="./Actions.css" scoped></style>