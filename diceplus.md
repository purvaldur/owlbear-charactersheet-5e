---
title: Dice+
description: Advance physics based dice roller with customizable dice 
author: Missing Link Dev
image: https://dice-plus.missinglinkdev.com/screenshots/example.png
icon: https://dice-plus.missinglinkdev.com/logo.png
tags:
  - dice
manifest: https://dice-plus.missinglinkdev.com/manifest.json
learn-more: https://dice-plus.missinglinkdev.com/learn-more
---

![Dice+ Banner](https://dice-plus.missinglinkdev.com/screenshots/example.png)

# Dice+

---

### Support Development

If you enjoy Dice+ and my other extensions, please consider supporting development on [Patreon](https://patreon.com/MissingLinkDev)! Your support helps me continue creating and maintaining quality extensions for the Owlbear Rodeo community.

---

A feature-rich 3D dice roller extension for Owlbear Rodeo with deterministic physics, customizable dice, and advanced dice rolling capabilities. Roll your dice in beautiful 3D with realistic physics simulation while maintaining complete control over your dice collection and rolling options.

## Table of Contents

- [Features](#features)
- [Adding Dice](#adding-dice)
  - [Quick Roll Buttons](#quick-roll-buttons)
  - [Dice Notation Input](#dice-notation-input)
- [Dice Bag](#dice-bag)
  - [Filters](#filters)
  - [Active and Jailed Dice](#active-and-jailed-dice)
  - [Creating and Editing Dice](#creating-and-editing-dice)
  - [Dice Stats and Log](#dice-stats-and-log)
- [Dice Notation Reference](#dice-notation-reference)
  - [Basic Rolls](#basic-rolls)
  - [Modifiers](#modifiers)
  - [Advanced Operators](#advanced-operators)
- [Extension Integration](#extension-integration)
  - [Ready Check Channel](#ready-check-channel)
  - [Roll Request Channel](#roll-request-channel)
  - [Roll Result Channel](#roll-result-channel)
  - [Roll Error Channel](#roll-error-channel)

## Features

- **3D Physics-Based Dice Rolling**: Realistic dice rolling with deterministic physics using Three.js and Rapier physics engine
- **Customizable Dice**: Create custom dice with unique colors, materials, sizes, and shapes
- **Quick Roll Interface**: Fast dice selection with intuitive left/right click controls
- **Advanced Dice Notation**: Supports complex dice notation including advantage/disadvantage, exploding dice, re-rolls, min/max values, and more
- **Dice Bag Management**: Organize and manage your dice collection with filters, active/jailed states, and custom configurations
- **Material System**: Choose from Standard and Galaxy materials with extensive customization options
- **Statistics Tracking**: View detailed roll history and statistics for your dice
- **Developer Integration**: Broadcast channels for sending roll requests and receiving results from other extensions

## Adding Dice

There are two primary ways to add dice to your roll:

### Quick Roll Buttons

The quick roll interface provides fast, visual dice selection with modifier controls:

- **Add/Subtract Dice**
  - **Left click** on a dice button to add one die of that type
  - **Right click** on a dice button to subtract one die

- **Advantage/Disadvantage**
  - **Left click** the A/D button to add advantage (roll an extra die and keep the highest)
  - **Right click** the A/D button to add disadvantage (roll an extra die and keep the lowest)
  - Visual badges show the number of advantage or disadvantage dice applied

- **Modifiers**
  - Use the **+ and -** buttons to adjust the modifier value (adds or subtracts from the final total)
  - Modifiers range from -99 to +99

- **Exploding Dice**
  - **Left click** the flame icon to enable exploding dice (when a die rolls its maximum value, roll it again and add the result)
  - **Right click** the flame icon to remove the exploding modifier
  - Badge shows the maximum number of explosions allowed (up to 10)

### Dice Notation Input

For more complex rolls, use the dice notation input field. This supports the full range of dice notation features (see [Dice Notation Reference](#dice-notation-reference) below).

Examples:
- `2d20kh1+5` - Roll 2d20, keep highest, add 5
- `4d6dl1 # Ability Score` - Roll 4d6, drop lowest, with label
- `3d6{Fear} # Fire + 2d6{Hope} # Ice` - Use specific dice models with descriptions

## Dice Bag

The Dice Bag is your dice collection management system where you can store, organize, and customize your dice.

### Filters

Filter your dice collection by type:
- Filter chips show **D4, D6, D8, D10/D100, D12, and D20**
- Click a filter chip to show only that dice type
- Click again to remove the filter and show all dice
- Multiple filters can be active simultaneously

### Active and Jailed Dice

Dice in your bag can be in two states:

- **Active Dice**: Available for rolling and rolls will cycle through your active dice as they are rolled
  - ***Tip***: For daggerheart create two d12s (Hope/Fear) and only have those two active, that way every time you roll it will roll those two and be easy to tell what your fear and hope score is.
- **Jailed Dice**: Stored but not currently available for rolling
  - Dice not rolling great jail it
  - Create sets for different characters and activate/jail dice to have the right dice for your session

The dice bag enforces a **maximum capacity of 50 total dice** (active + jailed combined).
Unlimited Dice capacity for Premium users (see Patreon for upgrade)

### Creating and Editing Dice

Click the "Add Dice" button to create new dice with custom properties:

#### Dice Type Selection
Choose the dice type Set (creates all dice type with same settings), D4, D6, D8, D10, D12, D20.

#### Name
Give your dice a custom name to easily identify them in your collection.

#### Preview
Real-time 3D preview of your dice with the selected shape, material, and settings.

#### Shape Selection
Choose the physical shape for your die:
- Each dice type supports multiple geometric shapes (e.g., D6 can be a cube or alternative shapes)
- The shape affects the visual appearance and rolling physics

#### Size Selection
Adjust the dice size from **25% to 300%** of the standard size

#### Material Selection

Choose from two material types with extensive customization (more coming soon):

##### Standard Material

A physically-based material with realistic lighting and surface properties:

- **Color**: Base color of the dice body
- **Font Color**: Color of the numbers on the dice
- **Number Depth** (0.0-1.0): How deeply the numbers are engraved into the surface
- **Roughness** (0.0-1.0): Surface roughness (0 = mirror-like, 1 = matte)
- **Metalness** (0.0-1.0): Metallic appearance (0 = non-metallic, 1 = fully metallic)
- **Sheen** (0.0-1.0): Soft sheen/glow effect on the surface

##### Galaxy Material (Premium Only)

A stunning cosmic material with animated star fields:

- **Font Color**: Color of the numbers
- **Number Depth** (0.0-1.0): How deeply the numbers are engraved
- **Primary Color**: Primary color of the galaxy nebula
- **Secondary Color**: Secondary color blended into the galaxy
- **Star Density** (0.5-1.5): How many stars appear in the galaxy effect
- **Brightness** (0.0-2.0): Overall brightness of the galaxy effect

### Dice Stats and Log

View detailed statistics and history for your dice:
- Roll history showing all past rolls
- Statistical analysis of roll outcomes
- Distribution charts showing roll frequencies
- Individual die performance tracking

## Dice Notation Reference

Dice+ uses a dice notation system compatible with Roll20 and RPG Dice Roller, with some extensions and variations.

### Basic Rolls

- `d20` - Roll a single d20
- `2d6` - Roll two six-sided dice
- `1d8+5` - Roll a d8 and add 5
- `3d6-2` - Roll three d6 and subtract 2

### Modifiers

#### Advantage/Disadvantage (Keep/Drop High/Low)

**Keep Operators** - Keep specified dice, drop the rest:
- `2d20kh1` - Roll 2d20, keep highest 1 (advantage)
- `2d20kl1` - Roll 2d20, keep lowest 1 (disadvantage)
- `4d6kh3` - Roll 4d6, keep highest 3 (common for ability score generation)

**Drop Operators** - Drop specified dice, keep the rest:
- `2d20dl1` - Roll 2d20, drop lowest 1 (same as keep highest - advantage)
- `2d20dh1` - Roll 2d20, drop highest 1 (same as keep lowest - disadvantage)
- `4d6dl1` - Roll 4d6, drop lowest 1 (keep highest 3)

#### Min/Max

- `1d20min10` - Result cannot be less than 10
- `1d20max15` - Result cannot be more than 15

#### Exploding

Exploding dice re-roll when they hit their maximum value and add the new roll to the total:

**Basic Exploding:**
- `1d6!` or `1d6e` - Explode on 6 (implicit max value)
- `1d6!6` - Explode on 6 (explicit single value)
- `1d6!6:3` - Explode on 6, maximum 3 explosions
- `1d6!>4` - Explode on any value greater than 4

**Multiple Values (Comma-Separated):**
- `1d6!1,6` - Explode on 1 or 6
- `1d6!1,6:2` - Explode on 1 or 6, maximum 2 explosions

#### Re-Roll

Re-roll dice that meet certain conditions:

**Basic Re-Roll:**
- `1d20r` or `1d20rr` - Re-roll on 1 (implicit minimum, infinite)
- `1d20ro` - Re-roll once on 1
- `1d20r1` - Re-roll on 1 (explicit single value)
- `1d20r<5` - Re-roll on any value less than 5
- `1d6r6:3` - Re-roll on 6, maximum 3 re-rolls

**Multiple Values (Comma-Separated):**
- `1d20r1,2` - Re-roll on 1 or 2
- `1d8r1,2,7,8` - Re-roll on extreme values


#### Unique (Coming Soon)

- `4d6u` - Roll 4d6, all results must be unique
- `4d6uo` - Roll 4d6 unique, unlimited re-rolls to ensure uniqueness

### Advanced Operators

#### Dice Model Selection

Assign specific dice from your dice bag by name:

- `2d6{Red}` - Use dice named "Red" from your d6 dice bag
- `1d12{Fear}+1d12{Hope}` - Use "Fear" and "Hope" dice
- If the named die doesn't exist, falls back to normal cycling through active dice

#### Roll Descriptions/Labels

Add descriptive labels to your rolls using the `#` symbol:

- `3d6 # Fire damage` - Add a description/label to the roll
- `3d6 # Fire + 2d6 # Ice` - Multiple rolls with different descriptions
- Descriptions stop at math operators, allowing complex expressions

#### Combined Features

All features can be combined for powerful roll expressions:

- `3d6{Red} # Fire damage + 2d6{White} # Frost damage` - Models and descriptions
- `2d20dl1{Red} # Attack with advantage` - Drop lowest with model and description
- `4d6dh1 # Ability Score` - Drop highest with description

#### Complex Expressions

Dice notation supports complex mathematical expressions:

- `2d20 + 1d6 + 5` - Multiple dice types in one roll
- `2d20kh1 + 1d4` - Combine advantage with additional dice
- `-1d4` - Negative dice (subtract the result)
- `3d6!1,6 # Wild Magic` - Explode on 1 or 6 with description
- `2d20kh1 + 1d6!5,6 + 3` - Advantage with exploding damage dice

## Extension Integration

Dice+ provides broadcast channels for integration with other Owlbear Rodeo extensions using the OBR Broadcast API.

### Ready Check Channel

Before sending roll requests, external extensions can check if Dice+ is loaded and ready to accept requests.

**Channel**: `dice-plus/isReady`

**How It Works**:
1. Your extension sends a ready check request on the `dice-plus/isReady` channel
2. Dice+ automatically responds on the same channel when it's ready
3. Your extension listens for the response to confirm Dice+ is available

**Request Message Structure**:
```typescript
{
  requestId: string;      // Unique request identifier (to match responses)
  timestamp: number;      // Request timestamp
}
```

**Response Message Structure**:
```typescript
{
  requestId: string;      // Matches the request requestId
  ready: true;            // Always true when Dice+ responds
  timestamp: number;      // Response timestamp
}
```

**Example**:
```typescript
import OBR from "@owlbear-rodeo/sdk";

async function checkDicePlusReady(): Promise<boolean> {
  const requestId = crypto.randomUUID();

  return new Promise((resolve) => {
    const unsubscribe = OBR.broadcast.onMessage("dice-plus/isReady", (event) => {
      const data = event.data;

      // Check if this is a response (not a request)
      if ('ready' in data && data.requestId === requestId) {
        unsubscribe();
        resolve(true);
      }
    });

    // Send ready check request
    OBR.broadcast.sendMessage("dice-plus/isReady", {
      requestId,
      timestamp: Date.now()
    }, { destination: 'ALL' });

    // Timeout after 1 second if no response
    setTimeout(() => {
      unsubscribe();
      resolve(false);
    }, 1000);
  });
}

// Use it before sending roll requests
const isDicePlusReady = await checkDicePlusReady();
if (!isDicePlusReady) {
  console.error("Dice Plus extension not found!");
  return;
}
```

### Roll Request Channel

Other extensions can send dice roll requests to Dice+ using the broadcast channel.

**Channel**: `dice-plus/roll-request`

**Message Structure**:
```typescript
{
  rollId: string;           // Unique roll identifier (save this to match results)
  playerId: string;         // OBR player ID
  playerName: string;       // Player display name
  rollTarget: 'everyone' | 'self' | 'dm' | 'gm_only';  // Who sees the roll
  diceNotation: string;     // Standard dice notation (e.g., "2d20kh1+5")
  showResults: boolean;     // Show default popup (false = handle in your UI)
  timestamp: number;        // Request timestamp
  source: string;           // Your extension identifier (e.g., "my-extension-id")
}
```

**Important Notes**:
- **source field**: Must be your extension's unique identifier. This is used to create dedicated result and error channels for your extension.
- **Result channels**: Results are sent to your dedicate channel:
  - `{source}/roll-result` - Your extension's dedicated channel
- **Error channel**: Errors will be sent to `{source}/roll-error`
- **Stats & History**: ALL rolls (internal and external) are automatically logged to Dice+ stats and history to be viewed in dice bag stats panel no matter the source of the roll and to track dice statistics
- **Popup behavior**:
  - Internal rolls always show the Dice+ popup
  - External rolls show popup only if `showResults: true`

**Example**:
```typescript
import OBR from "@owlbear-rodeo/sdk";

const MY_EXTENSION_ID = "my-extension-id"; // Use your extension's unique identifier
const rollId = `roll_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Send roll request
await OBR.broadcast.sendMessage("dice-plus/roll-request", {
  rollId,
  playerId: await OBR.player.getId(),
  playerName: await OBR.player.getName(),
  rollTarget: 'everyone',
  diceNotation: '2d20kh1+5',
  showResults: false,  // Handle results in your own UI
  timestamp: Date.now(),
  source: MY_EXTENSION_ID  // Use your extension ID
}, { destination: 'ALL' });

// Listen for results on YOUR extension's channel
OBR.broadcast.onMessage(`${MY_EXTENSION_ID}/roll-result`, (event) => {
  const result = event.data;
  // Handle your roll result
  if (result.rollId === rollId) {
    console.log("Roll complete:", result.result.totalValue);
  }
});

// Listen for errors on YOUR extension's channel
OBR.broadcast.onMessage(`${MY_EXTENSION_ID}/roll-error`, (event) => {
  const error = event.data;
  if (error.rollId === rollId) {
    console.error("Roll failed:", error.error);
  }
});
```

### Roll Result Channel

Dice+ sends roll results to source-specific broadcast channels.

**Channel**: `{source}/roll-result` (where `{source}` is the value you provided in the roll request)

**Message Structure**:
```typescript
{
  rollId: string;           // Matches the request rollId
  playerId: string;         // Who rolled
  playerName: string;       // Display name
  rollTarget: 'everyone' | 'self' | 'dm' | 'gm_only';  // Roll target
  timestamp: number;        // Original timestamp
  result: {
    rollId: string;         // Roll identifier
    diceNotation: string;   // Original notation
    totalValue: number;     // Final sum
    rollSummary: string;    // E.g., "2d6+3 = 11"
    groups: DiceGroup[];    // Grouped results by notation order
  };
}

// DiceGroup structure
interface DiceGroup {
  description?: string;     // E.g., "Fire" from "# Fire"
  diceModel?: string;       // E.g., "Red" from "{Red}"
  diceType: string;         // E.g., "d6", "d20"
  dice: DiceResult[];       // Individual dice in this group
  total: number;            // Total of kept dice in this group
  isNegative?: boolean;     // Whether this group is subtracted
}
```

**Complete Example with Data**:

For a roll request of `2d20kh1-1d4` (advantage on d20, subtract 1d4):

```typescript
const MY_EXTENSION_ID = "my-extension-id";

// Request sent
const rollId = 'roll_1760043220783_abc123';
await OBR.broadcast.sendMessage("dice-plus/roll-request", {
  rollId,
  playerId: '81e7413f-920c-4639-bd9d-1895ac156cf1',
  playerName: 'Gandalf',
  rollTarget: 'everyone',
  diceNotation: '2d20kh1-1d4',
  showResults: false,
  timestamp: 1760043220783,
  source: MY_EXTENSION_ID  // Your extension ID
}, { destination: 'ALL' });

// Result received on channel: my-extension-id/roll-result
{
  rollId: 'roll_1760043220783_abc123',
  playerId: '81e7413f-920c-4639-bd9d-1895ac156cf1',
  playerName: 'Gandalf',
  rollTarget: 'everyone',
  timestamp: 1760043220783,
  result: {
    rollId: 'roll_1760043220783_abc123',
    diceNotation: '2d20kh1-1d4',
    totalValue: 15,                    // Final result: 18 - 3 = 15
    rollSummary: '[18] 18 - 3 = 15',  // Human-readable summary
    groups: [
      {
        diceType: "d20",
        dice: [
          { diceId: 'dice_001', rollId: 'roll_abc123', diceType: 'd20', value: 18, kept: true },
          { diceId: 'dice_002', rollId: 'roll_abc123', diceType: 'd20', value: 7, kept: false }
        ],
        total: 18,                      // Total of kept dice only (18)
        isNegative: false
      },
      {
        diceType: "d4",
        dice: [
          { diceId: 'dice_003', rollId: 'roll_abc123', diceType: 'd4', value: 3, kept: true }
        ],
        total: 3,
        isNegative: true                // This group is subtracted
      }
    ]
  }
}
```

**Understanding the Results**:
- `groups` organizes all dice into their notation groups - even single dice get their own group
- Each group includes ALL dice rolled for that group (both kept and dropped dice)
- Each group's `dice` array contains all dice with a `kept` flag indicating if they count toward the total
- Each group's `total` field is the sum of only the kept dice in that group
- `totalValue` is the final calculated result after all modifiers
- For `2d20kh1-1d4`: rolled 18 and 7 on the d20s (kept 18), rolled 3 on the d4, final: 18 - 3 = 15

**Example with Descriptions and Dice Models**:

For a roll request of `3d6{Red} # Fire + 2d6{White} # Ice`:

```typescript
// Result received on channel: my-extension-id/roll-result
{
  rollId: 'roll_1760043220783_xyz789',
  playerId: '81e7413f-920c-4639-bd9d-1895ac156cf1',
  playerName: 'Gandalf',
  rollTarget: 'everyone',
  timestamp: 1760043220783,
  result: {
    rollId: 'roll_1760043220783_xyz789',
    diceNotation: '3d6{Red} # Fire + 2d6{White} # Ice',
    totalValue: 19,
    rollSummary: '[1, 3, 6] 10 Fire + [2, 3, 4] 9 Ice = 19',
    groups: [
      {
        description: "Fire",
        diceModel: "Red",
        diceType: "d6",
        dice: [
          { diceId: 'dice_001', rollId: 'roll_xyz789', diceType: 'd6', value: 1, kept: true },
          { diceId: 'dice_002', rollId: 'roll_xyz789', diceType: 'd6', value: 3, kept: true },
          { diceId: 'dice_003', rollId: 'roll_xyz789', diceType: 'd6', value: 6, kept: true }
        ],
        total: 10,
        isNegative: false
      },
      {
        description: "Ice",
        diceModel: "White",
        diceType: "d6",
        dice: [
          { diceId: 'dice_004', rollId: 'roll_xyz789', diceType: 'd6', value: 2, kept: true },
          { diceId: 'dice_005', rollId: 'roll_xyz789', diceType: 'd6', value: 3, kept: true },
          { diceId: 'dice_006', rollId: 'roll_xyz789', diceType: 'd6', value: 4, kept: true }
        ],
        total: 9,
        isNegative: false
      }
    ]
  }
}
```

The `groups` field makes it easy to:
- Access dice results organized by their notation order
- Get the description and dice model name for each group
- Calculate group totals without parsing individual dice
- Build custom UI displays that match the roll notation

### Roll Error Channel

Dice+ sends error messages to source-specific channels when a roll fails.

**Channel**: `{source}/roll-error` (where `{source}` is the value you provided in the roll request)

**Message Structure**:
```typescript
{
  rollId: string;           // Matches the request rollId
  error: string;            // Error message
  notation: string;         // Notation that failed
}
```

**Example Listener**:
```typescript
const MY_EXTENSION_ID = "my-extension-id";

OBR.broadcast.onMessage(`${MY_EXTENSION_ID}/roll-error`, (event) => {
  const error = event.data;

  // Match by rollId if needed
  if (error.rollId === rollId) {
    console.error(`Roll failed: ${error.error}`);
  }
});
```

---

**Made with ❤️ for the Owlbear Rodeo community**

