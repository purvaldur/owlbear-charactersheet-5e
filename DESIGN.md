---
name: Valdur's Heroic Codex
description: A D&D 5e character sheet that reads as a native Owlbear Rodeo panel, themed by the room.
colors:
  obr-bg: "#1e2231"
  obr-paper: "#222639"
  bg: "transparent"
  pop-bg: "rgba(34, 38, 57, 0.86)"
  paper: "rgba(255, 255, 255, 0.06)"
  paper-2: "rgba(255, 255, 255, 0.1)"
  float: "#343749"
  line: "rgba(255, 255, 255, 0.16)"
  line-soft: "rgba(255, 255, 255, 0.08)"
  text: "#ffffff"
  text-2: "rgba(255, 255, 255, 0.7)"
  text-3: "rgba(255, 255, 255, 0.5)"
  accent: "#bb99ff"
  accent-ink: "#c8adff"
  on-accent: "rgba(0, 0, 0, 0.87)"
  accent-soft: "rgba(187, 153, 255, 0.16)"
  danger: "#ff7a7a"
  danger-fill: "#c93a3f"
  danger-soft: "rgba(255, 122, 122, 0.16)"
  warn: "#f5b84a"
  warn-soft: "rgba(245, 184, 74, 0.14)"
  ok: "#5fd3a0"
  ok-soft: "rgba(95, 211, 160, 0.14)"
typography:
  result:
    fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  vital:
    fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  modifier:
    fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.15
  headline:
    fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.3
  title-sm:
    fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  body-sm:
    fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  xxs: "3px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "999px"
spacing:
  "2": "2px"
  "4": "4px"
  "6": "6px"
  "8": "8px"
  "10": "10px"
  "12": "12px"
  "16": "16px"
components:
  button:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.text}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  button-danger:
    backgroundColor: "{colors.danger-fill}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  button-ghost-hover:
    backgroundColor: "{colors.paper-2}"
  button-icon:
    backgroundColor: "{colors.paper-2}"
    rounded: "{rounded.sm}"
    width: "32px"
    height: "32px"
  table-rolls-toggle:
    backgroundColor: "transparent"
    rounded: "{rounded.sm}"
    width: "32px"
    height: "32px"
  table-rolls-toggle-pressed:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
  privacy-mark:
    backgroundColor: "{colors.float}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
    size: "16px"
  unread-badge:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 5px"
    height: "18px"
  segmented:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.text-2}"
    rounded: "{rounded.sm}"
    padding: "2px"
    height: "32px"
  segmented-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.xs}"
  tab:
    textColor: "{colors.text-2}"
    typography: "{typography.body}"
    padding: "8px 10px 9px"
  tab-selected:
    textColor: "{colors.text}"
  input:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "32px"
  header-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "12px"
  ability-strip:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.md}"
  ability-cell:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.modifier}"
    padding: "7px 0 6px"
  ability-cell-hover:
    backgroundColor: "{colors.paper-2}"
  save-cell:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.body-sm}"
    padding: "3px 6px"
    height: "34px"
  save-cell-hover:
    backgroundColor: "{colors.paper}"
  spell-slot:
    backgroundColor: "transparent"
    rounded: "{rounded.xxs}"
    size: "14px"
  spell-slot-filled:
    backgroundColor: "{colors.accent}"
  coin-strip:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.md}"
  coin-cell:
    textColor: "{colors.text}"
    typography: "{typography.title}"
    padding: "6px 10px"
  qty-step:
    backgroundColor: "transparent"
    textColor: "{colors.text-2}"
    rounded: "{rounded.sm}"
    size: "26px"
  qty-step-hover:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.text}"
  notes-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  row:
    backgroundColor: "transparent"
    rounded: "{rounded.md}"
    padding: "6px 8px"
    height: "52px"
  row-hover:
    backgroundColor: "{colors.paper}"
  row-effects:
    textColor: "{colors.text-2}"
    typography: "{typography.caption}"
  row-open:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.md}"
  inline-editor:
    backgroundColor: "{colors.paper}"
    padding: "0 12px 12px"
  roll-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  activation-tag:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.text-2}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    height: "22px"
  flag-pass:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ok}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 7px"
  flag-fail:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 7px"
  flag-crit:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 7px"
  menu:
    backgroundColor: "{colors.float}"
    rounded: "{rounded.md}"
    padding: "6px"
  sidebar:
    backgroundColor: "{colors.bg}"
    width: "340px"
  sidebar-overlay:
    backgroundColor: "{colors.float}"
    width: "340px"
  spell-picker:
    backgroundColor: "{colors.float}"
  popover-harness:
    backgroundColor: "{colors.pop-bg}"
    rounded: "{rounded.lg}"
    width: "500px"
  toast:
    backgroundColor: "{colors.text}"
    textColor: "{colors.obr-bg}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "8px 8px 8px 12px"
---

# Design System: Valdur's Heroic Codex

## Overview

**Creative North Star: "The Native Panel"**

The Codex is the category-standard 5e sheet (header card, HP bar, a six-cell ability strip, tabs, dense rows) built so it could pass for a panel Owlbear Rodeo shipped itself. It takes its neutrals and its one accent from the room's theme, sets everything in OBR's own UI face, and keeps the shape language MUI-like: rounded translucent panels on Owlbear's own blurred popover paper, hairline dividers, and a solid lifted layer with a soft shadow only on things that float. Its distinction is not costume but precision: aligned tabular numerals, rows that roll everything in one click, and a roll card that anyone at the table can read without having pressed the button.

Density is high and calm. The popover is a 500px column (780px in wide mode, which gives the two-column Main tab more room) over a live map, widening by a 340px table-rolls sidebar when the user opens it. The sheet reads in layers of tone rather than borders: a transparent ground through which Owlbear's blurred paper and the map glow, then raised paper and a slightly stronger fill for controls, both thin washes of the text colour, with lists, strips and grids divided by soft hairlines. Colour does almost no decorative work. The accent marks selection, live state and primary actions; red, amber and green mean only what they mean in play.

The system explicitly rejects the parchment-and-serif fantasy costume and novelty worlds, including this project's own earlier iron-and-blood skin.

**Key Characteristics:**
- Theme-derived: every neutral and the accent are computed from `OBR.theme` at runtime with `color-mix()`, dark and light.
- One family (Roboto), weights 400/500/700, tabular numerals on every number that changes.
- Overlay layering: a transparent ground under paper and control fill that are washes of the text colour; list rows and strip cells divided by soft hairlines; a solid lifted fill and shadows only on floating layers.
- One accent for selection, live state and primary actions; semantic colours reserved for HP, damage and save outcomes.
- Drawn SVG icons at a single 2px stroke, 16 or 18px.

## Colors

Owlbear's measured dark theme (a deep blue-slate paper, white text, one lavender accent) with every surface derived from it, so a room's custom palette carries through untouched.

**The Borrowed Palette Rule.** Nothing neutral and nothing accented is a fixed colour. `OBR.theme.getTheme()` is written into eight room values at runtime (`background.default` to `obr-bg`, `background.paper` to `obr-paper`, `text.primary` to `text`, `text.secondary` to `text-2`, `primary.main` to `accent`, `primary.light` and `primary.dark` to the accent-ink sources, `primary.contrastText` to `on-accent`), and every other neutral is a CSS `color-mix()` of those. The frontmatter values are the results for OBR's real dark theme, measured in a live room. The light set (sidecar `themeModes.light`) is still an approximation, unmeasured, and must be verified in a live room before it is trusted. Only the semantic hues are fixed.

### Primary
- **Room Lavender** (accent, `primary.main`): the only accent. Selected segment (Adv/Normal/Dis, Everyone/GM only), selected tab underline, primary buttons, filled proficiency marks and the expertise outline, use pips and spell slots, temp HP in the bar, the unread badge on the table-rolls toggle, crit flags, focus rings, the notes field's focused border.
- **Lavender Ink** (accent-ink): accent used as text or link (temp-HP pill, "Show description" and Undo links, the pressed table-rolls toggle, the eye-off mark on that toggle while rolls are private). It is the theme's `primary.light` in dark mode and `primary.dark` in light mode, so it always moves away from the ground.
- **Accent Wash** (accent-soft, the accent at 16%; 12% in light mode): selected and hovered states that should not shout: the pressed table-rolls toggle, the toggle's arrival flash, info banners (including the token-linking prompt), selected menu item, text selection, the hover on "New action"-style add buttons and the roll-save button.
- **On Accent** (on-accent, `primary.contrastText`): text sitting on a solid accent fill; in OBR's dark theme a near-black at 87%.

### Secondary (semantic only)
- **Wound Red** (danger, danger-fill, danger-soft): HP loss, low HP in the bar, natural-1 flags, failed saves, death-save failures, destructive buttons and the HP panel's Damage button, validation errors. `danger` is the text tone; `danger-fill` is the solid fill.
- **Bloodied Amber** (warn, warn-soft): HP at half or below, warning banners, note flags.
- **Hale Green** (ok, ok-soft): healthy HP in the bar, passed saves, death-save successes, the "connected" status dot.

These are fixed per mode (they do not follow the room), with darker light-mode values in the sidecar.

### Neutral
- **Room Ground** (bg, transparent): the sheet and the docked table-rolls sidebar. Owlbear draws every extension popover on its own translucent, blurred paper, so inside a room the sheet paints no ground of its own, as v1 did, and the map glows through.
- **Room Paper** (obr-paper, `background.paper`) and **Room Default** (obr-bg, `background.default`): the room's own surfaces, never painted directly as a panel. Paper is the base of the floating fill and the harness popover; the default background is the toast's ink.
- **Harness Popover** (pop-bg, room paper at 86%): only outside Owlbear (the dev harness), where the popover imitates Owlbear's own with this fill and a 16px backdrop blur. Inside a room the popover is transparent and Owlbear supplies frame, blur, corners and shadow.
- **Raised Paper** (paper, the text colour at 6%; 5% in light mode): header card, the ability strip, the coin strip, roll cards, the notes field, editor fieldsets, row and save-cell hover, an open row with its inline editor.
- **Control Fill** (paper-2, the text colour at 10%; 8% in light mode): buttons, the segmented track, inputs, activation tags, HP bar track, the AC shield, the switch track, menu-item hover, and the hover on cells that sit on paper (ability cells, quantity steppers, the name switcher and HP block).
- **Lifted Float** (float, room paper mixed 8% toward the text colour; plain room paper in light mode): the one opaque neutral, for layers that sit over other content: menus and the HP panel, the full-height spell picker, the table-rolls sidebar when it overlays the sheet, the eye-off badge on the toggle.
- **Hairline** (line, the text colour at 16%): 1px structural dividers (tab rule, the sidebar's edge, panel headers and footers, the rules above the visibility row and quick dice, card replies, menu separators), input strokes, outline buttons, the menu border, the AC shield's stroke, the dashed add button.
- **Soft Hairline** (line-soft, the text colour at 8%): the 1px divider between rows in skills, actions, features, spells and items; between ability cells, coin cells and save cells; between the sections of an inline editor; above the HP panel's temp field and the inventory add row; under the background head; and the notes field's resting border. Quieter than the hairline so a dense list or strip reads as one block.
- **Primary Text** (text, `text.primary`) and **Secondary Text** (text-2, `text.secondary`, white at 70% in the dark theme): content and metadata respectively. Secondary carries row meta, labels, units, placeholders and an item at quantity 0.
- **Quiet Stroke** (text-3, the text colour at 50%): icon strokes, empty pip, slot and mark borders, drag grips, the offline status dot. Never text.

**The Semantic Hues Rule.** Red, amber and green are reserved for game state: damage and HP loss, natural 1 and failure (red); half HP (amber); healthy HP and a passed save (green). They are never decoration, and they are never identity.

**The Identity Off-Hue Rule.** Identity colours (player and GM avatars on roll cards, token rings) stay off the red, amber and green hues, so an avatar can never be mistaken for a result. The shipped identity set: blue #3d8bfd, magenta #c25bb5, cyan #2b9fc0, violet #8a7cf0, orchid #d06bd9 and a second blue #4f8ff7.

**The One Accent Rule.** The accent marks selection, live state and the primary action, and nothing else. Hover and pressed states are a wash of it, not a fill.

## Typography

**Display Font:** none (the system has no display face)
**Body Font:** Roboto (with system-ui, -apple-system, Segoe UI, sans-serif)

**Character:** One family on purpose, so the sheet matches OBR's own UI. Hierarchy comes from size and weight (400, 500, 700), not from a second face.

### Hierarchy
- **Result** (700, 28px, 1, tabular): the headline number on a roll card (22px for secondary results on the same card).
- **Vital** (700, 26px, 1, tabular): current HP in the header.
- **Modifier** (700, 22px, 1.15): ability modifiers in the ability strip.
- **Headline** (700, 20px, 1.2): the sheet name (the sheet switcher), the AC number, empty-state titles.
- **Title** (700, 16px): full-height panel titles, the sidebar title, the background name, coin amounts, ability scores in their edit inputs.
- **Title small** (700, 14px): fieldset headings in the inline editor and the HP panel.
- **Body** (400, 14px, 1.4): default text; row names at 500, tabs at 500. The notes field and the backstory block use 14px at a looser 1.6 and 1.55.
- **Body small** (400, 13px, 1.5): descriptions and background blocks (max 62ch, 1.5 to 1.55), banners, button labels (500), saving-throw names (values at 700), the spellcasting line (values at 700).
- **Caption** (400, 12px, tabular): the row effects line (to-hit, damage, save DC, then range and reach, then "concentration" and "ritual" as words) with its numbers lifted to primary text at 500; ability scores under the modifier, slot counts ("2/3"), "at will", item weight lines, units, hints, captions, field labels (500).
- **Label** (700, 11px, 0.05em, uppercase): section headers in lists and on the Background tab (spell levels, Skills, Saving throws, Items, Ideals), menu headers, coin labels. Ability abbreviations and activation tags use the same size and weight without forced case.

**The Tabular Rule.** Every number that changes or lines up (HP, modifiers, totals, dice breakdowns, quantities, weights, slot counts) is set with tabular numerals.

**The Label Is a Header Rule.** Uppercase 11px labels name the group or column directly below them. They are never decorative tags above a heading.

## Layout

A single fixed-width column: the popover is 500px wide (780px in wide mode, plus 340px while the table-rolls sidebar is open), at least 560px and at most 900px tall, anchored under OBR's action bar. Content stacks top to bottom: the header card, any banners, the full-width ability strip, the tab bar, then a scrolling body. Popover gutters are 12px; inner rhythm runs 2, 4, 6, 8, 10, 12px, with 16px as the bottom padding of scroll areas. Rows are 52px minimum (inventory rows 48px, skills in the Main tab's left column and save cells 34px) and sit flush, divided by 1px soft hairlines rather than gaps.

Tabs are Main, Spells, Inventory, Background and Notes; a tab drops out when its sheet has nothing for it (outside edit mode), Notes is absent on any read-only sheet, and the bar hides when only Main remains. Main is two columns in one scroll: Skills (with passive scores beneath) in a 176px left column, then on the right Saving throws (a two-column grid, three in wide mode), Actions and Features, 14px apart. At 500px the left column drops ability tags and a long effects line ellipsizes (the full breakdown lands on the roll card). Wide mode widens the left column to 236px and brings the tags back. In edit mode at 500px the Main tab stacks into one column, actions and features first, so inline editors get the full width; wide mode keeps two columns while editing. Below 460px of sheet width (a container query on the sheet, not the viewport) the two columns stack, actions first; there too the vitals row wraps so HP takes a full line, the segmented control stretches, and the Background trait grid drops to one column. The ability strip keeps its six cells and the coin strip its five at every width.

The table-rolls sidebar (340px) opens only from the toggle in the header's identity row. It sits beside the sheet and the popover widens by 340px to make room; below a 900px viewport it overlays the sheet from the right edge instead, with the floating shadow, and below 460px it covers the whole sheet. Top to bottom it holds a header (title, dice source, close), the scrolling log of roll cards, then pinned at the bottom the roll-visibility row ("Your rolls go to" with an Everyone / GM only segmented control) over the quick dice and notation form.

Editing happens in place: an item's editor expands directly under its row. The SRD spell picker is the one remaining full-height panel, covering the sheet on the lifted float with a header, a scrolling body and a footer. Notes fills the tab's height (at least 320px). The toast sits at the bottom of the sheet, 12px from its edges.

**The Never-By-Itself Rule.** Nothing opens, widens or resizes the popover except the user's own click. A roll arriving bumps the unread badge and flashes the toggle; a save asked of the active sheet while the sidebar is closed raises a toast with a Show action, and so does your own roll's result ("Rapier: 20 to hit · 10 piercing"), once Dice+ has settled.

## Elevation & Depth

Depth comes from tone first: the transparent ground (Owlbear's blurred paper), then paper, then control fill, each a slightly stronger wash of the text colour over whatever lies beneath. Anything that floats over other content trades the wash for the opaque lifted float and takes the one soft shadow. Inside a room, Owlbear draws the popover's own frame, corners and shadow; the sheet does not.

### Shadow Vocabulary
- **Floating** (`box-shadow: 0 12px 32px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3)`; light: `0 12px 32px rgba(27,30,43,0.18), 0 2px 6px rgba(27,30,43,0.1)`): menus, the HP panel, the toast, the table-rolls sidebar when it overlays the sheet below a 900px viewport, and the popover itself in the dev harness only.

**The Float-Only Shadow Rule.** Cards, strips and rows are flat. A shadow means the layer floats, and it is always soft and diffuse.

**The Solid Float Rule.** A layer that sits over the sheet is opaque (the lifted float), never a translucent wash, so the content beneath cannot bleed through it. Everything in the sheet's own flow stays a wash, so the map shows through it.

## Shapes

MUI-like rounded geometry at four steps: 12px for the popover and the header card, 8px for the ability and coin strips, roll cards, rows (including an open row and its editor), menus, banners and the notes field, 6px for buttons, inputs and quantity steppers, 4px for activation tags and segment thumbs, and 3px for spell slots and the HP bar's ends. Pills (999px) are kept for status: temp-HP, flags, unread badges, the spell picker's level filters, the switch track. Use pips and death-save pips are 12 to 14px circles with a 2px ring that fills when spent or marked; spell slots are 14px squares with the same ring, so a slot never reads as a use. The AC value sits on a drawn shield in control fill with a hairline stroke, the one non-rectangular silhouette in the system. The HP bar is a 6px rounded track.

## Components

### Buttons
Quiet, tonal and compact, like OBR's own controls.
- **Shape:** gently rounded (6px), 32px tall, 12px side padding, 13px/500 label, optional 16px icon at a 6px gap.
- **Default:** control fill under primary text; hover brightens by 12%.
- **Primary:** solid accent with on-accent text. Use one per surface at most.
- **Ghost / Outline / Icon:** ghost is transparent and takes control fill on hover; outline is a 1px inset hairline; icon buttons are 32px square.
- **Danger:** solid danger-fill with white text, only for destructive confirmation.
- **Focus:** 2px accent outline at a 2px offset (global). Disabled: 50% opacity.

### Segmented control
- A control-fill track with 2px padding; 28px segments at 12px/500 in secondary text. The selected segment fills with the accent. Two uses: Adv / Normal / Dis in the vitals row (resets to Normal after each roll) and Everyone / GM only in the table-rolls sidebar (sticky).

### Cards / Containers
- **Header card:** paper, 12px radius, 12px padding: the identity row (name as switcher with a small 16px link icon after it when the sheet is linked to a token, subtitle, table-rolls toggle, Edit, overflow) over the vitals row (HP number and bar with temp, AC shield, the Adv / Normal / Dis control). Roll visibility does not live here.
- **Ability strip:** one full-width paper strip (8px radius) under the header card, six equal cells divided by soft hairlines and no gaps. Each cell is a check button: the abbreviation (11px/700, secondary), the modifier (22px/700) and the score (12px, secondary), taking control fill on hover. In edit mode each cell holds a centred 46 by 30px score input (16px/700) instead.

### Saving throws
- The first block of Main's right column, under a "Saving throws" label: a two-column grid (three in wide mode) of flush 34px cells divided by soft hairlines, 12px between columns. Each cell is a proficiency mark (the 10px skill mark, filled with the accent when proficient), the full ability name at 13px, and the value at 700 tabular. A click rolls the save; in edit mode a click toggles proficiency (aria-pressed). Hover is the paper wash, like a row.

### HP panel
- A 280px floating menu anchored to the vitals: a 14px/700 title with current over max at the right; a "Damage or heal" field (40px, 18px/700, centred; Enter takes damage, a leading "+" heals) over a two-up pair of 36px buttons, Damage in danger fill and Heal in control fill; a 12px tabular hint line that previews the result as you type; then, under a soft hairline, a 36px "Temp HP" field that applies as you type.
- **Roll card:** paper, 8px radius, 10px/12px padding. The header has a 22px avatar, who, what, and visibility meta; the body has result numbers with their dice breakdown in 12px tabular secondary text; then flags, an optional outlined accent "roll save" button, replies under a hairline, and a footer link. New cards slide 6px up and fade in.

### Rows
- Action, spell, skill and feature rows sit flush in a list, divided by 1px soft hairlines; transparent at rest, a paper wash on hover, 8px radius. The whole row is the roll button (its focus ring is drawn inset on the row); use pips and edit tools sit above it as separate targets.
- **Action and spell rows:** activation tag (22px, control fill, 11px/700), then the name (500) over a single effects line, then use pips at the right edge. The effects line reads like "+7 to hit · 1d8+4 piercing · DC 15 DEX · Melee · 5 ft": 12px tabular secondary text with the numbers (to-hit, dice, DC) in primary text at 500, middots as separators, range last. Each effect is unbreakable and the range travels as one unit, so the line may break only at a middot: when it does not fit, the whole range moves to a second line (ellipsized only if it alone overflows).
- **Open row (edit mode):** a drag grip leads and a pencil and delete icon button trail. The pencil, or the row itself, expands the editor in place: the row and its editor share one paper block (8px radius, 4px vertical margin) and the hairlines above and below it drop away.

**The One Target Row Rule.** A row is one roll target. Clicking it rolls everything the row describes (to-hit, damage and the save DC on the card), and its effects are written under the name, never split into separate per-number buttons.

### Inline editor
- Expands under its row on the same paper, padded 12px at the sides and bottom. Sections (attack, saving throw, damage parts, limited uses, description) have no fill of their own; each is 12px tall in padding and separated by a soft hairline, headed at 14px/700 with a 12px secondary summary at the right.
- The footer, under a final soft hairline, holds a ghost Delete in secondary text, a "Changes save as you type" caption, and a primary Done.

### Inputs / Fields
- **Style:** control fill, 1px hairline stroke, 6px radius, 32px tall (36px for search and the name field, 40px for HP-panel numerals).
- **Focus:** the stroke turns accent, plus a 1px accent ring. Borderless fields inside a strip (coin cells) show a 2px inset accent bar along the cell's bottom edge on focus-within instead; the notes field turns its soft-hairline border accent.
- **Switch:** a 36 by 20px pill; it fills with the accent when on, and its knob turns on-accent.

### Navigation
- **Tabs:** 14px/500 secondary text, with a 2px transparent bottom border on a hairline rule. Selected tabs take primary text and an accent underline; hover takes primary text. The bar scrolls horizontally when it overflows.

### Menus and floating panels
- Lifted float, 8px radius, hairline border, floating shadow, 6px padding. Items are 8px/10px with 6px radius and take control fill on hover; the selected item takes the accent wash. Label-style headers, hairline separators. The overflow menu holds "Link to a token" (or "Link to another token" and "Unlink token" when linked); choosing it closes the menu and raises an info banner under the header card ("Click a token on the map to link it to …", with Cancel). The next token click links the sheet; Escape cancels. The token's own linking highlight is drawn in OBR's scene, outside this system (the prototype simulates it with a pulsing dashed accent outline).
- **Toast:** inverted: the text colour as its fill and the room's default background (obr-bg) as its ink, never the transparent ground; 8px radius, floating shadow, at the bottom of the sheet 12px from its edges, with an outlined inline action (Undo, or Show for a save asked of you or your own roll's result).

### Table-rolls sidebar (signature)
- **Toggle:** a 32px ghost icon button (dice icon) in the header's identity row. Pressed, it takes the accent wash with accent-ink. While rolls are private, a 16px lifted-float disc with a 12px eye-off icon in accent-ink sits on its bottom-right corner. Unseen rolls show as an 18px accent pill badge at its top-right corner (11px/700, on-accent); a new arrival flashes the button with the accent wash for 1.4s.
- **Sidebar:** 340px, transparent like the sheet behind a hairline left edge, sliding 12px in from the sheet; when it overlays the sheet it takes the lifted float and the floating shadow. A header (16px/700 "Table rolls", the dice source as a caption, a close icon button) over a hairline; the log of roll cards at 8px gaps; then, under a hairline, the visibility row (12px secondary "Your rolls go to", the Everyone / GM only control at the right; a GM sees "Only me"), then quick dice buttons (d4 to d100, 30px at 12px/700) and a free-form notation input with its roll button.

### Pips, slots and marks
- Use pips: 12px circles; death saves: 14px circles; spell slots: 14px squares at 3px radius; proficiency marks: 10px circles in skills and saves, with expertise shown as a 1.5px accent outline at a 2px offset around the filled mark (an outline, not a box-shadow ring, because a transparent ground cannot paint the gap). All have a quiet-stroke ring at rest and fill with the accent, or with ok/danger-fill for death saves.

**The Two Counters Rule.** Uses are circles and spell slots are squares. A counter's shape says what it counts, and the two never share a silhouette.

### Spellcasting
- Spells open with one 13px summary line in secondary text, values at 700 in primary ("Spellcasting **Intelligence** · Spell attack **+5** · Save DC **13**"), wrapping with 18px gaps. Each level header is a label row with its slots at the right (14px squares, then an "n/m" count in 12px tabular); cantrips say "at will". In edit mode the slots become a −/+ stepper for the slot maximum. Concentration and ritual are words at the end of the effects line, never a glyph or badge.

### Inventory
- **Coin strip:** a paper strip (8px radius) of five equal cells divided by soft hairlines: an uppercase label over a borderless 16px/700 tabular input.
- **Item rows:** 48px list rows: the name (500) over a 12px secondary weight line ("2 lb each · 6 lb"), then a ghost quantity stepper (26px −/+ buttons in secondary text taking control fill on hover, the count at 700 between), then a remove icon button that appears on hover or focus. At quantity 0 the name is struck through in secondary text and − is disabled. A label row above the list carries the item count and total weight.
- **Add row:** a quiet form under a soft hairline at the list's foot: a plus icon, a name input, a 64px weight input and a default Add button.

### Background
- **View:** a head block (the background name at 16px/700, then the feature as a bold name and 13px secondary text, max 62ch) under a soft hairline; then personality traits, ideals, bonds and flaws in a two-column grid (one column below 460px of sheet width, 16px apart); then allies, appearance and backstory. Each block is a label-style header over 13px text at 1.55 (14px for the backstory), 62ch max, line breaks kept.
- **Edit:** the same fields as labelled inputs and textareas (the standard field: 12px/500 secondary label over the input), background and feature name side by side.

### Notes
- A paper textarea that fills the tab (at least 320px): soft-hairline border, 8px radius, 12px/14px padding, 14px at 1.6, the border turning accent on focus. A 12px caption beneath says who sees it and that it saves as you type. It is typed into directly, outside edit mode, and the tab is absent on read-only sheets (a GM viewing someone else's).

## Do's and Don'ts

### Do:
- **Do** derive every neutral and the accent from the room's `OBR.theme` values with `color-mix()`, so a custom palette carries through; verify the light approximations in a live room.
- **Do** separate surfaces by tone (transparent ground, then paper and paper-2 washes of the text colour) and 1px hairlines before reaching for borders or shadows.
- **Do** give every layer that floats over the sheet the opaque lifted float, never a translucent wash.
- **Do** set every changing number in tabular Roboto, and size results by importance (28, 26 and 22px at 700).
- **Do** keep roll targets at least 32px tall and make the whole row the primary roll action, rolling everything it describes.
- **Do** divide list rows, strip cells and grid cells with 1px soft hairlines (line-soft) and keep the paper wash for hover and the open row.
- **Do** use the accent for selection, live state and primary actions only, and the accent wash for hover and pressed states.
- **Do** draw icons as inline SVG with a 2px round stroke at 16 or 18px.
- **Do** draw spell slots as 14px rounded squares and uses as circles.
- **Do** honour `prefers-reduced-motion` by removing animation and transitions.

### Don't:
- **Don't** use red, amber or green for anything but state: HP, damage, natural 1, save outcomes, warnings and connection status.
- **Don't** give avatars or token rings a red, amber or green identity colour.
- **Don't** put shadows on cards, rows or strips; shadows belong to floating layers, and they are always soft.
- **Don't** introduce a second typeface, a serif, or parchment textures; the sheet should look like part of Owlbear Rodeo, not a fantasy prop.
- **Don't** set body text in the quiet stroke tone (text-3).
- **Don't** paint an opaque ground on the sheet inside Owlbear, or hard-code a neutral hex; the room's blurred paper is the ground and every neutral comes from the theme.
- **Don't** auto-open the table-rolls sidebar or resize the popover when a roll arrives.
- **Don't** split a row's to-hit, damage or save DC into separate roll buttons; the effects line is text, the row is the target.
- **Don't** open editors as full-height panels; editing expands in place under the row.
- **Don't** box abilities, coins or saves as separate cards; they are cells in one strip or grid, divided by soft hairlines.
