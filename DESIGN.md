---
name: Valdur's Heroic Codex
description: A D&D 5e character sheet that reads as a native Owlbear Rodeo panel, themed by the room.
colors:
  bg: "#222639"
  paper: "#3d4051"
  paper-2: "#4a4e61"
  line: "#555a6e"
  line-soft: "rgba(255, 255, 255, 0.08)"
  text: "#f4f4f8"
  text-2: "#c3c5d2"
  text-3: "#9a9db0"
  accent: "#bb99ff"
  accent-ink: "#cbb1ff"
  on-accent: "#1d1530"
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
  ability-box:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "6px 4px 4px"
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
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "6px"
  sidebar:
    backgroundColor: "{colors.bg}"
    width: "340px"
  toast:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "8px 8px 8px 12px"
---

# Design System: Valdur's Heroic Codex

## Overview

**Creative North Star: "The Native Panel"**

The Codex is the category-standard 5e sheet (header card, HP bar, six boxed abilities, tabs, dense rows) built so it could pass for a panel Owlbear Rodeo shipped itself. It takes its neutrals and its one accent from the room's theme, sets everything in OBR's own UI face, and keeps the shape language MUI-like: rounded tonal panels, hairline dividers, a soft shadow only on things that float. Its distinction is not costume but precision: aligned tabular numerals, rows that roll everything in one click, and a roll card that anyone at the table can read without having pressed the button.

Density is high and calm. The popover is a 500px column (780px in wide mode, which gives the two-column Main tab more room) over a live map, widening by a 340px table-rolls sidebar when the user opens it. The sheet reads in layers of tone rather than borders: room ground, raised paper, and a slightly lighter fill for controls, with lists divided by soft hairlines. Colour does almost no decorative work. The accent marks selection, live state and primary actions; red, amber and green mean only what they mean in play.

The system explicitly rejects the parchment-and-serif fantasy costume and novelty worlds, including this project's own earlier iron-and-blood skin.

**Key Characteristics:**
- Theme-derived: neutrals and accent are mapped from `OBR.theme` at runtime, dark and light.
- One family (Roboto), weights 400/500/700, tabular numerals on every number that changes.
- Tonal layering (ground, paper, paper-2) over hairline borders; list rows divided by soft hairlines; shadows only on floating layers.
- One accent for selection, live state and primary actions; semantic colours reserved for HP, damage and save outcomes.
- Drawn SVG icons at a single 2px stroke, 16 or 18px.

## Colors

A cool slate-violet neutral ramp with one lavender accent, all standing in for whatever theme the room supplies.

**The Borrowed Palette Rule.** Every neutral and the accent are simulations of `OBR.theme`. The shipped extension maps them at runtime from `OBR.theme.getTheme()`: `background.default` to `bg`, `background.paper` to `paper`, `text.primary` to `text`, `text.secondary` to `text-2`, `primary.main` to `accent`. The derived tokens (`paper-2`, `line`, `line-soft`, `text-3`, `accent-ink`, `accent-soft`, `on-accent`) are computed from those. The dark values in the frontmatter are approximations of OBR's defaults and must be verified against a live room before they are trusted. A light set exists for OBR's light theme (in the sidecar under `themeModes.light`); it follows `prefers-color-scheme` or an explicit theme flag.

### Primary
- **Room Lavender** (accent): the only accent. Selected segment (Normal/Adv/Dis), selected tab underline, primary buttons, filled proficiency dots and use pips, temp HP in the bar, the unread badge on the table-rolls toggle, crit flags, focus rings.
- **Lavender Ink** (accent-ink): accent used as text or link on dark ground (temp-HP pill, "Show description" links, the pressed table-rolls toggle), lighter than the accent so it stays legible.
- **Accent Wash** (accent-soft): selected and hovered states that should not shout: pressed visibility and table-rolls toggles, the toggle's arrival flash, info banners, selected menu item, add-row and roll-save button hover.
- **On Accent** (on-accent): text sitting on a solid accent fill.

### Secondary (semantic only)
- **Wound Red** (danger, danger-fill, danger-soft): HP loss, low HP in the bar, natural-1 flags, failed saves, death-save failures, destructive buttons, validation errors. `danger` is the text tone; `danger-fill` is the solid fill.
- **Bloodied Amber** (warn, warn-soft): HP at half or below, warning banners, note flags.
- **Hale Green** (ok, ok-soft): healthy HP in the bar, passed saves, death-save successes, the "connected" status dot.

### Neutral
- **Room Ground** (bg): the popover body, the table-rolls sidebar, the full-height spell picker.
- **Raised Paper** (paper): header card, ability boxes, roll cards, menus, stat pills, coin boxes, row hover, an open row with its inline editor.
- **Control Fill** (paper-2): buttons, the segmented track, inputs, activation tags, the ability Save buttons, HP bar track, the AC shield.
- **Hairline** (line): 1px structural dividers (tab rule, the sidebar's edge, header and quick-dice divider, panel headers and footers, card replies), input strokes, outline buttons, menu border.
- **Soft Hairline** (line-soft): the 1px divider between rows in skills, actions, features and spells, and between the sections of an inline editor. Quieter than the hairline so a dense list reads as one block.
- **Primary Text** (text) and **Secondary Text** (text-2): content and metadata respectively. Secondary carries row meta, labels, units and placeholders.
- **Quiet Stroke** (text-3): icon strokes, empty pip and dot borders, drag grips. Never body text.

**The Semantic Hues Rule.** Red, amber and green are reserved for game state: damage and HP loss, natural 1 and failure (red); half HP (amber); healthy HP and a passed save (green). They are never decoration, and they are never identity.

**The Identity Off-Hue Rule.** Identity colours (player and GM avatars on roll cards, token rings) stay off the red, amber and green hues, so an avatar can never be mistaken for a result. The prototype's identity set: blue #3d8bfd (a player), magenta #c25bb5 (another player), cyan #2b9fc0 (the GM's creatures).

**The One Accent Rule.** The accent marks selection, live state and the primary action, and nothing else. Hover and pressed states are a wash of it, not a fill.

## Typography

**Display Font:** none (the system has no display face)
**Body Font:** Roboto (with system-ui, -apple-system, Segoe UI, sans-serif)

**Character:** One family on purpose, so the sheet matches OBR's own UI. Hierarchy comes from size and weight (400, 500, 700), not from a second face.

### Hierarchy
- **Result** (700, 28px, 1, tabular): the headline number on a roll card (22px for secondary results on the same card).
- **Vital** (700, 26px, 1, tabular): current HP in the header.
- **Modifier** (700, 22px, 1.15): ability modifiers in the ability boxes.
- **Headline** (700, 20px, 1.2): the sheet name (the sheet switcher), the AC number, empty-state titles.
- **Title** (700, 16px): full-height panel titles, stat-pill values, coin amounts.
- **Title small** (700, 14px): fieldset headings in the inline editor and the HP panel.
- **Body** (400, 14px, 1.4): default text; row names at 500, tabs at 500.
- **Body small** (400, 13px, 1.5): descriptions (max 62ch), banners, button labels (500).
- **Caption** (400, 12px, tabular): the row effects line (to-hit, damage, save DC, then range and reach) with its numbers lifted to primary text at 500; units, hints, field labels (500).
- **Label** (700, 11px, 0.05em, uppercase): section headers in lists (spell levels, skill groups), column headers, menu headers, stat-pill and coin labels. Ability abbreviations and activation tags use the same size and weight without forced case.

**The Tabular Rule.** Every number that changes or lines up (HP, modifiers, totals, dice breakdowns, quantities, weights, slot counts) is set with tabular numerals.

**The Label Is a Header Rule.** Uppercase 11px labels name the group or column directly below them. They are never decorative tags above a heading.

## Layout

A single fixed-width column: the popover is 500px wide (780px in wide mode, plus 340px while the table-rolls sidebar is open), at least 560px and at most 900px tall, anchored under OBR's action bar. Content stacks top to bottom: the header card, then the six-box ability grid, then the tab bar, then a scrolling body. Popover gutters are 12px; inner rhythm runs 2, 4, 6, 8, 10, 12px, with 16px as the bottom padding of scroll areas. Rows are 52px minimum (inventory rows 40px, skills in the Main tab's left column 34px) and sit flush, divided by 1px soft hairlines rather than gaps.

Tabs are Main, Spells and Inventory; the bar hides when a sheet has only Main. Main is two columns in one scroll: Skills (with passive scores beneath) in a 176px left column, Actions then Features on the right, 14px apart. At 500px the left column drops ability tags and a long effects line ellipsizes (the full breakdown lands on the roll card). Wide mode widens the left column to 236px and brings the tags back. In edit mode at 500px the Main tab stacks into one column, actions and features first, so inline editors get the full width; wide mode keeps two columns while editing. Below 460px of sheet width (a container query on the sheet, not the viewport) the two columns stack, actions first; there too the ability grid drops to three columns, the vitals row wraps so HP takes a full line, the segmented control stretches, and coins drop to three columns.

The table-rolls sidebar (340px) opens only from the toggle in the header's identity row. It sits beside the sheet and the popover widens by 340px to make room; below a 900px viewport it overlays the sheet from the right edge instead, with the floating shadow. Top to bottom it holds a header (title, dice source, close), the scrolling log of roll cards, and the quick dice and notation form pinned at the bottom.

Editing happens in place: an item's editor expands directly under its row. The SRD spell picker is the one remaining full-height panel, covering the sheet with a header, a scrolling body and a footer. The toast sits at the bottom of the sheet, 12px from its edges.

**The Never-By-Itself Rule.** Nothing opens, widens or resizes the popover except the user's own click. A roll arriving bumps the unread badge and flashes the toggle; a save asked of the active sheet while the sidebar is closed raises a toast with a Show action.

## Elevation & Depth

Depth comes from tone first: ground, then paper, then control fill. Shadows exist only on layers that float above the sheet or the map.

### Shadow Vocabulary
- **Floating** (`box-shadow: 0 12px 32px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3)`; light: `0 12px 32px rgba(27,30,43,0.18), 0 2px 6px rgba(27,30,43,0.1)`): the popover itself, menus, the HP panel, the toast, and the table-rolls sidebar when it overlays the sheet below a 900px viewport.

**The Float-Only Shadow Rule.** Cards, ability boxes and rows are flat. A shadow means the layer floats, and it is always soft and diffuse.

## Shapes

MUI-like rounded geometry at four steps: 12px for the popover and the header card, 8px for ability boxes, roll cards, rows (including an open row and its editor), menus and banners, 6px for buttons, inputs, stat pills and coin boxes, and 4px for activation tags, the ability Save buttons and segment thumbs. Pills (999px) are kept for status: temp-HP, flags, unread badges, the spell picker's level filters, the switch track. Use pips and death-save pips are 12 to 14px circles with a 2px ring that fills when spent or marked. The AC value sits on a drawn shield in control fill with a hairline stroke, the one non-rectangular silhouette in the system. The HP bar is a 6px rounded track.

## Components

### Buttons
Quiet, tonal and compact, like OBR's own controls.
- **Shape:** gently rounded (6px), 32px tall, 12px side padding, 13px/500 label, optional 16px icon at a 6px gap.
- **Default:** control fill on text; hover brightens by 12%.
- **Primary:** solid accent with on-accent text. Use one per surface at most.
- **Ghost / Outline / Icon:** ghost is transparent and takes control fill on hover; outline is a 1px inset hairline; icon buttons are 32px square.
- **Danger:** solid danger-fill with white text, only for destructive confirmation.
- **Focus:** 2px accent outline at a 2px offset (global). Disabled: 50% opacity.

### Segmented control (Adv / Normal / Dis)
- A control-fill track with 2px padding; 28px segments at 12px/500 in secondary text. The selected segment fills with the accent. It resets to Normal after each roll.

### Cards / Containers
- **Header card:** paper, 12px radius, 12px padding: the identity row (name as switcher with a small 16px link icon after it when the sheet is linked to a token, subtitle, table-rolls toggle, Edit, overflow) over the vitals row (HP number and bar with temp, AC shield, segmented control, visibility toggle).
- **Ability box:** paper, 8px radius. The modifier is the check button (11px label, 22px modifier, 12px score); a 24px Save button sits beneath (control fill, 4px radius, a separate roll target) with a proficiency dot that fills with the accent.
- **Roll card:** paper, 8px radius, 10px/12px padding. The header has a 22px avatar, who, what, and visibility meta; the body has result numbers with their dice breakdown in 12px tabular secondary text; then flags, an optional outlined accent "roll save" button, replies under a hairline, and a footer link. New cards slide 6px up and fade in.

### Rows
- Action, spell, skill and feature rows sit flush in a list, divided by 1px soft hairlines; transparent at rest, a paper wash on hover, 8px radius. The whole row is the roll button (its focus ring is drawn inset on the row); use pips and edit tools sit above it as separate targets.
- **Action and spell rows:** activation tag (22px, control fill, 11px/700), then the name (500) over a single effects line, then use pips at the right edge. The effects line reads like "+7 to hit · 1d8+4 piercing · DC 15 DEX · Melee · 5 ft": 12px tabular secondary text with the numbers (to-hit, dice, DC) in primary text at 500, middots as separators, range last. It ellipsizes rather than wrapping.
- **Open row (edit mode):** a drag grip leads and a pencil and delete icon button trail. The pencil, or the row itself, expands the editor in place: the row and its editor share one paper block (8px radius, 4px vertical margin) and the hairlines above and below it drop away.

**The One Target Row Rule.** A row is one roll target. Clicking it rolls everything the row describes (to-hit, damage and the save DC on the card), and its effects are written under the name, never split into separate per-number buttons.

### Inline editor
- Expands under its row on the same paper, padded 12px at the sides and bottom. Sections (attack, saving throw, damage parts, limited uses, description) have no fill of their own; each is 12px tall in padding and separated by a soft hairline, headed at 14px/700 with a 12px secondary summary at the right.
- The footer, under a final soft hairline, holds a ghost Delete in secondary text, a "Changes save as you type" caption, and a primary Done.

### Inputs / Fields
- **Style:** control fill, 1px hairline stroke, 6px radius, 32px tall (36px for search and the name field, 40px for HP-panel numerals).
- **Focus:** the stroke turns accent, plus a 1px accent ring. Coin boxes show a 2px inset accent ring on focus-within instead.
- **Switch:** a 36 by 20px pill; it fills with the accent when on, and its knob turns on-accent.

### Navigation
- **Tabs:** 14px/500 secondary text, with a 2px transparent bottom border on a hairline rule. Selected tabs take primary text and an accent underline; hover takes primary text. The bar scrolls horizontally when it overflows.

### Menus and floating panels
- Paper, 8px radius, hairline border, floating shadow, 6px padding. Items are 8px/10px with 6px radius and take control fill on hover; the selected item takes the accent wash. Label-style headers, hairline separators.
- **Toast:** inverted (text colour as background, ground as text), 8px radius, floating shadow, at the bottom of the sheet 12px from its edges, with an outlined inline action (Undo, or Show for a save asked of you).

### Table-rolls sidebar (signature)
- **Toggle:** a 32px ghost icon button (dice icon) in the header's identity row. Pressed, it takes the accent wash with accent-ink. Unseen rolls show as an 18px accent pill badge at its top-right corner (11px/700, on-accent, ringed in paper so it reads cut out of the header card); a new arrival flashes the button with the accent wash for 1.4s.
- **Sidebar:** 340px on the ground colour behind a hairline left edge, sliding 12px in from the sheet. A header (16px/700 "Table rolls", the dice source as a caption, a close icon button) over a hairline; the log of roll cards at 8px gaps; then, under a hairline, quick dice buttons (d4 to d100, 30px at 12px/700) and a free-form notation input with its roll button.

### Pips and dots
- Use pips: 12px; death saves: 14px; proficiency dots: 6px (10px marks in skills, with expertise shown as a ring around the filled mark). All have a quiet-stroke ring at rest and fill with the accent, or with ok/danger-fill for death saves.

## Do's and Don'ts

### Do:
- **Do** read every neutral and the accent from `OBR.theme` at runtime and verify the dark approximations in a live room.
- **Do** separate surfaces by tone (bg, paper, paper-2) and 1px hairlines before reaching for borders or shadows.
- **Do** set every changing number in tabular Roboto, and size results by importance (28, 26 and 22px at 700).
- **Do** keep roll targets at least 32px tall and make the whole row the primary roll action, rolling everything it describes.
- **Do** divide list rows with 1px soft hairlines (line-soft) and keep the paper wash for hover and the open row.
- **Do** use the accent for selection, live state and primary actions only, and the accent wash for hover and pressed states.
- **Do** draw icons as inline SVG with a 2px round stroke at 16 or 18px.
- **Do** honour `prefers-reduced-motion` by removing animation and transitions.

### Don't:
- **Don't** use red, amber or green for anything but state: HP, damage, natural 1, save outcomes, warnings and connection status.
- **Don't** give avatars or token rings a red, amber or green identity colour.
- **Don't** put shadows on cards, rows or ability boxes; shadows belong to floating layers, and they are always soft.
- **Don't** introduce a second typeface, a serif, or parchment textures; the sheet should look like part of Owlbear Rodeo, not a fantasy prop.
- **Don't** set body text in the quiet stroke tone (text-3).
- **Don't** auto-open the table-rolls sidebar or resize the popover when a roll arrives.
- **Don't** split a row's to-hit, damage or save DC into separate roll buttons; the effects line is text, the row is the target.
- **Don't** open editors as full-height panels; editing expands in place under the row.
