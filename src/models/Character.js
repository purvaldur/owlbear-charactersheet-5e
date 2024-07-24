export class Character {
  constructor(data = {}) {
    this.id = data.id || Date.now().toString();
    this.name = data.name || 'New Character';
    this.level = data.level || 1;
    this.race = data.race || '';
    this.class = data.class || '';
    this.abilityScores = data.abilityScores || {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    };
    this.skills = data.skills || [
      { name: 'Acrobatics', ability: 'dexterity', proficient: false },
      { name: 'Animal Handling', ability: 'wisdom', proficient: false },
      { name: 'Arcana', ability: 'intelligence', proficient: false },
      { name: 'Athletics', ability: 'strength', proficient: false },
      { name: 'Deception', ability: 'charisma', proficient: false },
      { name: 'History', ability: 'intelligence', proficient: false },
      { name: 'Insight', ability: 'wisdom', proficient: false },
      { name: 'Intimidation', ability: 'charisma', proficient: false },
      { name: 'Investigation', ability: 'intelligence', proficient: false },
      { name: 'Medicine', ability: 'wisdom', proficient: false },
      { name: 'Nature', ability: 'intelligence', proficient: false },
      { name: 'Perception', ability: 'wisdom', proficient: false },
      { name: 'Performance', ability: 'charisma', proficient: false },
      { name: 'Persuasion', ability: 'charisma', proficient: false },
      { name: 'Religion', ability: 'intelligence', proficient: false },
      { name: 'Sleight of Hand', ability: 'dexterity', proficient: false },
      { name: 'Stealth', ability: 'dexterity', proficient: false },
      { name: 'Survival', ability: 'wisdom', proficient: false }
    ];
    this.hitPoints = data.hitPoints || { current: 10, max: 10 };
    this.armorClass = data.armorClass || 10;
    this.proficiencyBonus = data.proficiencyBonus || 2;
    this.playerId = data.playerId || null;
  }

  getAbilityModifier(ability) {
    const score = this.abilityScores[ability];
    return Math.floor((score - 10) / 2);
  }

  getSkillModifier(skill) {
    const abilityMod = this.getAbilityModifier(skill.ability);
    const proficiencyBonus = skill.proficient ? this.proficiencyBonus : 0;
    return abilityMod + proficiencyBonus;
  }

  static fromJSON(json) {
    return new Character(JSON.parse(json));
  }

  toJSON() {
    return JSON.stringify(this);
  }

  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      race: this.race,
      class: this.class,
      abilityScores: { ...this.abilityScores },
      skills: this.skills.map(skill => ({ ...skill })),
      hitPoints: { ...this.hitPoints },
      armorClass: this.armorClass,
      proficiencyBonus: this.proficiencyBonus,
      playerId: this.playerId
    };
  }

  static fromPlainObject(obj) {
    return new Character(obj);
  }
}
