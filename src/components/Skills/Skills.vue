<template>
  <div class="skills">
    <h2>Skills</h2>
    <div v-for="(skill, index) in skills" :key="index" class="skill-item" @click="rollSkillCheck(skill)">
      <span class="skill-ability">[{{ skill.ability.toUpperCase() }}]</span>
      <span class="skill-name">{{ skill.name }}</span>
      <span class="skill-modifier">{{ getSkillModifierString(skill) }}</span>
      <!-- <div class="skill-controls">
        <template v-if="!editing">
          <button @click="rollSkillCheck(skill)" class="skill-roll">
            {{ getSkillModifierString(skill) }}
          </button>
        </template>
        <template v-else>
          <select v-model="skill.ability" @change="updateSkill(index, skill)">
            <option v-for="ability in abilities" :key="ability" :value="ability">
              {{ ability.toUpperCase() }}
            </option>
          </select>
        </template>
        <label v-if="editing" class="proficiency-toggle">
          <input
            type="checkbox"
            v-model="skill.proficient"
            @change="updateSkill(index, skill)"
          />
        </label>
      </div> -->
    </div>
  </div>
</template>

<script src="./Skills.js"></script>
<style src="./Skills.css" scoped></style>