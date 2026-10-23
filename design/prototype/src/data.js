// Sample sheets for the prototype. All characters, creatures and players are synthetic.
const ABILITIES = [
  ["str", "STR", "Strength"], ["dex", "DEX", "Dexterity"], ["con", "CON", "Constitution"],
  ["int", "INT", "Intelligence"], ["wis", "WIS", "Wisdom"], ["cha", "CHA", "Charisma"],
];
const SKILLS = [
  ["acrobatics", "Acrobatics", "dex"], ["animal", "Animal Handling", "wis"], ["arcana", "Arcana", "int"],
  ["athletics", "Athletics", "str"], ["deception", "Deception", "cha"], ["history", "History", "int"],
  ["insight", "Insight", "wis"], ["intimidation", "Intimidation", "cha"], ["investigation", "Investigation", "int"],
  ["medicine", "Medicine", "wis"], ["nature", "Nature", "int"], ["perception", "Perception", "wis"],
  ["performance", "Performance", "cha"], ["persuasion", "Persuasion", "cha"], ["religion", "Religion", "int"],
  ["sleight", "Sleight of Hand", "dex"], ["stealth", "Stealth", "dex"], ["survival", "Survival", "wis"],
];
const ACTIVATIONS = [
  ["A", "Action"], ["BA", "Bonus action"], ["R", "Reaction"], ["—", "No action"],
  ["1M", "1 minute"], ["10M", "10 minutes"], ["1H", "1 hour"], ["8H", "8 hours"],
];
const DAMAGE_TYPES = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing",
  "poison", "psychic", "radiant", "slashing", "thunder", "healing"];
const RECHARGES = [["SR", "Short rest"], ["LR", "Long rest"], ["5–6", "Recharge 5–6"], ["—", "Manual"]];

let _id = 0;
const uid = (p) => `${p}${++_id}`;
const abl = (str, dex, con, int, wis, cha, saves = []) => {
  const o = {};
  [["str", str], ["dex", dex], ["con", con], ["int", int], ["wis", wis], ["cha", cha]]
    .forEach(([k, v]) => (o[k] = { score: v, save: saves.includes(k) }));
  return o;
};
const skl = (profs = {}) => Object.fromEntries(SKILLS.map(([k]) => [k, profs[k] || 0]));
const dmg = (n, d, ab, flat, type) => ({ n, d, ab: ab || "", flat: flat || 0, type });
const act = (o) => ({ id: uid("a"), act: "A", range: "", hit: null, save: null, dmg: [], uses: null, desc: "", ...o });
const spl = (o) => ({ id: uid("s"), level: 0, act: "A", range: "", conc: false, ritual: false, hit: false, save: null, dmg: [], desc: "", ...o });
const ft = (o) => ({ id: uid("f"), uses: null, desc: "", ...o });
const itm = (qty, name, wt) => ({ id: uid("i"), qty, name, wt });
const blankCoins = () => ({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });

function sampleIlse() {
  return {
    id: "ilse", kind: "character", owner: "Sam", ownerColor: "#3d8bfd",
    name: "Ilse Varga", subtitle: "Halfling Arcane Trickster 5",
    hp: { cur: 24, max: 38, temp: 5 }, ac: 15, prof: 3, death: { s: 0, f: 0 },
    abilities: abl(8, 18, 14, 14, 13, 10, ["dex", "int"]),
    skills: skl({ acrobatics: 2, stealth: 2, perception: 1, sleight: 1, persuasion: 1, insight: 1 }),
    actions: [
      act({ name: "Rapier", range: "Melee · 5 ft · finesse", hit: { ab: "dex", prof: true, flat: 0 }, dmg: [dmg(1, 8, "dex", 0, "piercing")],
        desc: "Melee weapon attack. Finesse: uses DEX for attack and damage." }),
      act({ name: "Shortbow", range: "Ranged · 80/320 ft", hit: { ab: "dex", prof: true, flat: 0 }, dmg: [dmg(1, 6, "dex", 0, "piercing")],
        desc: "Ranged weapon attack. 17 arrows left in the quiver." }),
      act({ name: "Dagger, off-hand", act: "BA", range: "Melee or thrown 20/60 ft", hit: { ab: "dex", prof: true, flat: 0 }, dmg: [dmg(1, 4, "", 0, "piercing")],
        desc: "Two-weapon fighting: no ability modifier on the off-hand damage." }),
      act({ name: "Sneak Attack", act: "—", range: "Once per turn", dmg: [dmg(3, 6, "", 0, "piercing")],
        desc: "Once per turn, deal an extra 3d6 damage to one creature you hit with a finesse or ranged weapon if you have advantage, or if another enemy of the target is within 5 feet of it." }),
      act({ name: "Cunning Action", act: "BA", range: "Dash, Disengage or Hide",
        desc: "Take the Dash, Disengage or Hide action as a bonus action." }),
      act({ name: "Uncanny Dodge", act: "R", range: "When hit by an attacker you can see",
        desc: "Use your reaction to halve the attack's damage against you." }),
    ],
    spellcasting: { ab: "int", atk: 0, dc: 0 },
    slots: { 1: { max: 3, used: 1 } },
    spells: [
      spl({ name: "Fire Bolt", level: 0, range: "120 ft", hit: true, dmg: [dmg(2, 10, "", 0, "fire")], desc: "Hurl a mote of fire. On a hit the target takes 2d10 fire damage. Unattended flammable objects ignite." }),
      spl({ name: "Mage Hand", level: 0, range: "30 ft", desc: "A spectral, floating hand. With Legerdemain it is invisible and can pick locks and pockets." }),
      spl({ name: "Minor Illusion", level: 0, range: "30 ft", desc: "Create a sound or an image of an object for 1 minute." }),
      spl({ name: "Shield", level: 1, act: "R", range: "Self", desc: "When you are hit by an attack or targeted by magic missile: +5 AC until the start of your next turn." }),
      spl({ name: "Magic Missile", level: 1, range: "120 ft", dmg: [dmg(3, 4, "", 3, "force")], desc: "Three glowing darts, each hitting automatically for 1d4 + 1 force damage." }),
      spl({ name: "Disguise Self", level: 1, range: "Self", desc: "Change how you look for 1 hour, including clothing and gear." }),
    ],
    features: [
      ft({ name: "Lucky", uses: { max: 3, used: 1, recharge: "LR" }, desc: "When you make an attack roll, ability check or saving throw, spend a luck point to roll an additional d20 and choose which one is used." }),
      ft({ name: "Mage Hand Legerdemain", desc: "Your mage hand is invisible, and you can use it to stow or retrieve objects in containers worn by others, pick locks and disarm traps at range." }),
      ft({ name: "Halfling Nimbleness", desc: "You can move through the space of any creature that is of a size larger than yours." }),
    ],
    linkedToken: "ilse",
    background: {
      name: "Dockside Urchin",
      feature: { name: "Harbour Ways", desc: "You know the smugglers' tunnels, rooftop routes and back alleys of any port town. Outside combat you can lead your companions through them at twice normal travel speed." },
      traits: "I pocket small shiny things without thinking. I always know where the exits are.",
      ideals: "Freedom. Nobody should be owned, by a master or by a debt.",
      bonds: "I owe my life to Old Mott, the fence who taught me to read.",
      flaws: "I can't walk past a locked door without wondering what's behind it.",
      allies: "The Lantern Street crew, pickpockets on the Saltmere docks. Old Mott, fence and mentor. Captain Ysolde of the Silver Gull, who owes us a favour.",
      appearance: "Three feet tall, dark curls tied back with twine, a burn scar across the back of the left hand.",
      backstory: "Ilse grew up running messages and lifting purses on the Saltmere docks, sleeping in net lofts and trading gossip for bread. When a job for the Gilded Hand went wrong, Old Mott hid her in his cellar for a month and taught her letters to pass the time.\n\nShe left the city owing him everything and promising to come back with enough coin to buy his shop outright. A chance meeting with a travelling wizard showed her that a little magic makes locks much more cooperative.",
    },
    notes: "Session 12\n- The harbourmaster is taking bribes from the Gilded Hand.\n- Owe Maren 15 gp for the healing potions.\n- Ash drakes nest in the old lighthouse. Fire breath recharges, so spread out.\n\nPeople\n- Captain Ysolde, Silver Gull: owes us one.\n- Brother Calder at the shrine knows about the sealed vault.",
    inventory: {
      coins: { cp: 3, sp: 14, ep: 0, gp: 62, pp: 1 },
      items: [itm(1, "Rapier", 2), itm(1, "Shortbow", 2), itm(17, "Arrows", 0.05), itm(2, "Dagger", 1), itm(1, "Studded leather", 13),
        itm(1, "Thieves' tools", 1), itm(2, "Potion of healing", 0.5), itm(1, "Hempen rope, 50 ft", 10), itm(4, "Rations", 2)],
    },
  };
}

function sampleMaren() {
  return {
    id: "maren", kind: "character", owner: "Robin", ownerColor: "#c25bb5",
    name: "Maren Holt", subtitle: "Human Tempest Cleric 5",
    hp: { cur: 33, max: 38, temp: 0 }, ac: 18, prof: 3, death: { s: 0, f: 0 },
    abilities: abl(14, 10, 14, 10, 18, 12, ["wis", "cha"]),
    skills: skl({ insight: 1, religion: 1, medicine: 1, persuasion: 1 }),
    actions: [
      act({ name: "Warhammer", range: "Melee · 5 ft", hit: { ab: "str", prof: true, flat: 0 }, dmg: [dmg(1, 8, "str", 0, "bludgeoning")] }),
      act({ name: "Destructive Wrath", act: "—", range: "Channel Divinity", uses: { max: 1, used: 0, recharge: "SR" },
        desc: "When you roll lightning or thunder damage, use Channel Divinity to deal maximum damage instead of rolling." }),
    ],
    spellcasting: { ab: "wis", atk: 0, dc: 0 },
    slots: { 1: { max: 4, used: 1 }, 2: { max: 3, used: 0 }, 3: { max: 2, used: 0 } },
    spells: [
      spl({ name: "Sacred Flame", level: 0, range: "60 ft", save: { target: "dex" }, dmg: [dmg(2, 8, "", 0, "radiant")], desc: "Flame-like radiance descends on a creature you can see. It must succeed on a DEX save or take 2d8 radiant damage. No benefit from cover." }),
      spl({ name: "Guidance", level: 0, range: "Touch", conc: true, desc: "The target adds 1d4 to one ability check of its choice before the spell ends." }),
      spl({ name: "Thaumaturgy", level: 0, range: "30 ft", desc: "You manifest a minor wonder, a sign of supernatural power." }),
      spl({ name: "Guiding Bolt", level: 1, range: "120 ft", hit: true, dmg: [dmg(4, 6, "", 0, "radiant")], desc: "On a hit, the target takes 4d6 radiant damage, and the next attack roll against it before the end of your next turn has advantage." }),
      spl({ name: "Healing Word", level: 1, act: "BA", range: "60 ft", dmg: [dmg(1, 4, "sc", 0, "healing")], desc: "A creature you can see regains hit points equal to 1d4 + your spellcasting modifier." }),
      spl({ name: "Bless", level: 1, range: "30 ft", conc: true, desc: "Up to three creatures add 1d4 to attack rolls and saving throws for the duration." }),
      spl({ name: "Thunderwave", level: 1, range: "Self · 15 ft cube", save: { target: "con" }, dmg: [dmg(2, 8, "", 0, "thunder")], desc: "Each creature in the cube makes a CON save. On a failure it takes 2d8 thunder damage and is pushed 10 feet away." }),
      spl({ name: "Spiritual Weapon", level: 2, act: "BA", range: "60 ft", hit: true, dmg: [dmg(1, 8, "sc", 0, "force")], desc: "A floating spectral weapon. Make a melee spell attack; on a hit it deals 1d8 + your spellcasting modifier force damage." }),
      spl({ name: "Shatter", level: 2, range: "60 ft · 10 ft sphere", save: { target: "con" }, dmg: [dmg(3, 8, "", 0, "thunder")], desc: "A sudden ringing noise. Each creature in the sphere makes a CON save, taking 3d8 thunder damage on a failure." }),
      spl({ name: "Spirit Guardians", level: 3, range: "Self · 15 ft", conc: true, save: { target: "wis" }, dmg: [dmg(3, 8, "", 0, "radiant")], desc: "Spirits protect you in a 15-foot radius. Enemies there have their speed halved and make a WIS save when they enter or start their turn there, taking 3d8 radiant damage on a failure." }),
      spl({ name: "Call Lightning", level: 3, range: "120 ft", conc: true, save: { target: "dex" }, dmg: [dmg(3, 10, "", 0, "lightning")], desc: "A storm cloud appears. Call down a bolt: each creature within 5 feet of the point makes a DEX save, taking 3d10 lightning damage on a failure." }),
    ],
    features: [
      ft({ name: "Wrath of the Storm", uses: { max: 4, used: 0, recharge: "LR" }, desc: "When a creature within 5 feet hits you with an attack, use your reaction to make it take 2d8 lightning or thunder damage (DEX save for half)." }),
      ft({ name: "Channel Divinity", uses: { max: 1, used: 0, recharge: "SR" }, desc: "Turn Undead or Destructive Wrath." }),
    ],
    background: {
      name: "Acolyte", feature: { name: "Shelter of the Faithful", desc: "Temples of the storm god will offer you and your companions healing and a place to rest." },
      traits: "Thunder is just the god clearing her throat.", ideals: "Tradition, but the weather changes.", bonds: "The lighthouse shrine at Saltmere.", flaws: "Quick to call a bad omen.",
      allies: "", appearance: "", backstory: "Raised in the lighthouse shrine, Maren keeps its lamp lit and its storm-bells rung.",
    },
    notes: "",
    inventory: { coins: { cp: 0, sp: 8, ep: 0, gp: 25, pp: 0 }, items: [itm(1, "Warhammer", 2), itm(1, "Chain mail", 55), itm(1, "Shield", 6), itm(1, "Holy symbol", 1)] },
  };
}

function samplePip() {
  return {
    id: "pip", kind: "creature", owner: "Sam", ownerColor: "#3d8bfd",
    name: "Pip", subtitle: "Owl familiar · Tiny beast",
    hp: { cur: 1, max: 1, temp: 0 }, ac: 11, prof: 2, death: { s: 0, f: 0 },
    abilities: abl(3, 13, 8, 2, 12, 7),
    skills: skl({ perception: 1, stealth: 1 }),
    actions: [
      act({ name: "Talons", range: "Melee · 5 ft", hit: { ab: "dex", prof: true, flat: 0 }, dmg: [dmg(1, 1, "", 0, "slashing")] }),
      act({ name: "Help", range: "Give an ally advantage", desc: "Pip flies in to distract a target, giving an ally advantage on their next attack against it." }),
    ],
    spellcasting: null, slots: {}, spells: [],
    features: [
      ft({ name: "Flyby", desc: "Doesn't provoke opportunity attacks when it flies out of an enemy's reach." }),
      ft({ name: "Keen Hearing and Sight", desc: "Advantage on Perception checks that rely on hearing or sight." }),
    ],
    inventory: { coins: blankCoins(), items: [] },
  };
}

function sampleDrake() {
  return {
    id: "drake", kind: "creature", owner: "GM", ownerColor: "#2b9fc0",
    name: "Ash Drake", subtitle: "Medium dragon · CR 3 · homebrew",
    hp: { cur: 52, max: 52, temp: 0 }, ac: 17, prof: 2, death: { s: 0, f: 0 },
    abilities: abl(18, 12, 16, 6, 12, 10, ["dex", "con"]),
    skills: skl({ perception: 1, stealth: 1 }),
    actions: [
      act({ name: "Multiattack", range: "One bite and one claw", desc: "The drake makes two attacks: one with its bite and one with its claws." }),
      act({ name: "Bite", range: "Melee · 5 ft", hit: { ab: "str", prof: true, flat: 0 }, dmg: [dmg(1, 10, "str", 0, "piercing"), dmg(1, 6, "", 0, "fire")] }),
      act({ name: "Claw", range: "Melee · 5 ft", hit: { ab: "str", prof: true, flat: 0 }, dmg: [dmg(2, 6, "str", 0, "slashing")] }),
      act({ name: "Fire Breath", range: "15 ft cone", save: { ab: "con", dc: null, target: "dex" }, dmg: [dmg(6, 6, "", 0, "fire")], uses: { max: 1, used: 0, recharge: "5–6" },
        desc: "Each creature in a 15-foot cone makes a DEX save, taking 6d6 fire damage on a failure or half as much on a success." }),
    ],
    spellcasting: null, slots: {}, spells: [],
    features: [ft({ name: "Ash Cloud", desc: "When the drake takes fire damage, the area within 5 feet of it is lightly obscured until the end of its next turn." })],
    inventory: { coins: blankCoins(), items: [] }, linkedToken: "drake",
  };
}

function sampleFanatic() {
  return {
    id: "fanatic", kind: "creature", owner: "GM", ownerColor: "#2b9fc0",
    name: "Cult Fanatic", subtitle: "Medium humanoid · CR 2",
    hp: { cur: 33, max: 33, temp: 0 }, ac: 13, prof: 2, death: { s: 0, f: 0 },
    abilities: abl(11, 14, 12, 10, 13, 14),
    skills: skl({ deception: 1, persuasion: 1, religion: 1 }),
    actions: [
      act({ name: "Multiattack", range: "Two melee attacks" }),
      act({ name: "Dagger", range: "Melee 5 ft or thrown 20/60 ft", hit: { ab: "dex", prof: true, flat: 0 }, dmg: [dmg(1, 4, "dex", 0, "piercing")] }),
    ],
    spellcasting: { ab: "wis", atk: 0, dc: 0 },
    slots: { 1: { max: 4, used: 0 }, 2: { max: 3, used: 0 } },
    spells: [
      spl({ name: "Sacred Flame", level: 0, range: "60 ft", save: { target: "dex" }, dmg: [dmg(1, 8, "", 0, "radiant")] }),
      spl({ name: "Command", level: 1, range: "60 ft", save: { target: "wis" }, desc: "Speak a one-word command to a creature. It must succeed on a WIS save or follow the command on its next turn." }),
      spl({ name: "Inflict Wounds", level: 1, range: "Touch", hit: true, dmg: [dmg(3, 10, "", 0, "necrotic")] }),
      spl({ name: "Hold Person", level: 2, range: "60 ft", conc: true, save: { target: "wis" }, desc: "A humanoid must succeed on a WIS save or be paralyzed for the duration." }),
      spl({ name: "Spiritual Weapon", level: 2, act: "BA", range: "60 ft", hit: true, dmg: [dmg(1, 8, "sc", 0, "force")] }),
    ],
    features: [ft({ name: "Dark Devotion", desc: "Advantage on saving throws against being charmed or frightened." })],
    inventory: { coins: blankCoins(), items: [] }, linkedToken: "fanatic",
  };
}

function sampleBandit() {
  return {
    id: "bandit", kind: "creature", owner: "GM", ownerColor: "#2b9fc0",
    name: "Bandit", subtitle: "Medium humanoid · CR 1/8 · ×4 in this scene",
    hp: { cur: 11, max: 11, temp: 0 }, ac: 12, prof: 2, death: { s: 0, f: 0 },
    abilities: abl(11, 12, 12, 10, 10, 10),
    skills: skl(),
    actions: [
      act({ name: "Scimitar", range: "Melee · 5 ft", hit: { ab: "dex", prof: true, flat: 0 }, dmg: [dmg(1, 6, "dex", 0, "slashing")] }),
      act({ name: "Light crossbow", range: "Ranged · 80/320 ft", hit: { ab: "dex", prof: true, flat: 0 }, dmg: [dmg(1, 8, "dex", 0, "piercing")] }),
    ],
    spellcasting: null, slots: {}, spells: [], features: [],
    inventory: { coins: blankCoins(), items: [] },
  };
}

function blankSheet(kind) {
  return {
    id: uid("new"), kind, owner: "", ownerColor: "#3d8bfd",
    name: kind === "creature" ? "New creature" : "New character", subtitle: "",
    hp: { cur: 10, max: 10, temp: 0 }, ac: 10, prof: 2, death: { s: 0, f: 0 },
    abilities: abl(10, 10, 10, 10, 10, 10), skills: skl(),
    actions: [], spellcasting: null, slots: {}, spells: [], features: [],
    inventory: { coins: blankCoins(), items: [] },
    background: { name: "", feature: { name: "", desc: "" } }, notes: "",
  };
}

// Tokens on the simulated map. `sheet` names the sheet each token is linked to.
const TOKENS = [
  { id: "ilse", label: "Ilse", initials: "IV", color: "#3d8bfd", x: 640, y: 300, sheet: "ilse", owner: "player" },
  { id: "maren", label: "Maren", initials: "MH", color: "#c25bb5", x: 720, y: 420, sheet: "maren", owner: "otherplayer" },
  { id: "drake", label: "Ash Drake", initials: "AD", color: "#2b9fc0", x: 920, y: 260, sheet: "drake", owner: "gm" },
  { id: "fanatic", label: "Cult Fanatic", initials: "CF", color: "#2b9fc0", x: 1010, y: 430, sheet: "fanatic", owner: "gm" },
];
