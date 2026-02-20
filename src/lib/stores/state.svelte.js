const meta = $state(
  {
    editMode: false,
    rollState: 'normal', // 'normal' | 'advantage' | 'disadvantage'
    sidebarOpen: false,
    activeTab: 'main', // 'main' | 'spells' | 'inventory' | 'backstory' | 'notes'
    currentCharacterIndex: 0
  }
)

const characters = $state([
  {
    meta: {
    name: 'Valdur Ironhide',
      hp: { current: 12, max: 14, temp: 3 },
      armorClass: 15,
      proficiencyBonus: 2,
      inspiration: false
    },
    stats: [
      { name: { full: 'strength',     short: 'str' }, saveProficient: false, value: 8 },
      { name: { full: 'dexterity',    short: 'dex' }, saveProficient: false, value: 12 },
      { name: { full: 'constitution', short: 'con' }, saveProficient: false, value: 14 },
      { name: { full: 'intelligence', short: 'int' }, saveProficient: false, value: 14 },
      { name: { full: 'wisdom',       short: 'wis' }, saveProficient: false, value: 10 },
      { name: { full: 'charisma',     short: 'cha' }, saveProficient: false, value: 20 },
    ],
    skills: [
      { name: 'acrobatics',     proficiency: false, expertise: false, baseStat: 'dex' },
      { name: 'animal handling',proficiency: false, expertise: false, baseStat: 'wis' },
      { name: 'arcana',         proficiency: false, expertise: false, baseStat: 'int' },
      { name: 'athletics',      proficiency: false, expertise: false, baseStat: 'str' },
      { name: 'deception',      proficiency: false, expertise: false, baseStat: 'cha' },
      { name: 'history',        proficiency: false, expertise: false, baseStat: 'int' },
      { name: 'insight',        proficiency: false, expertise: false, baseStat: 'wis' },
      { name: 'intimidation',   proficiency: false, expertise: false, baseStat: 'cha' },
      { name: 'investigation',  proficiency: false, expertise: false, baseStat: 'int' },
      { name: 'medicine',       proficiency: false, expertise: false, baseStat: 'wis' },
      { name: 'nature',         proficiency: false, expertise: false, baseStat: 'int' },
      { name: 'perception',     proficiency: false, expertise: false, baseStat: 'wis' },
      { name: 'performance',    proficiency: false, expertise: false, baseStat: 'cha' },
      { name: 'persuasion',     proficiency: false, expertise: false, baseStat: 'cha' },
      { name: 'religion',       proficiency: false, expertise: false, baseStat: 'int' },
      { name: 'sleight of hand',proficiency: false, expertise: false, baseStat: 'dex' },
      { name: 'stealth',        proficiency: false, expertise: false, baseStat: 'dex' },
      { name: 'survival',       proficiency: false, expertise: false, baseStat: 'wis' },
    ]
  }
]);

function getModifier(statValue) {
  return Math.floor((statValue - 10) / 2);
}

export const state = {
  meta, 
  characters,
  get character() {
    return this.characters[meta.currentCharacterIndex];
  },
  getModifier
}

