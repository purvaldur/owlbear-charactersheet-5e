---
version: 1
slug: "design-prototype-index-html"
primary_target: "design/prototype/index.html"
related_targets: []
---

# Surface: Codex popover (whole extension prototype)

Mode: Operate. Audience: players and GMs mid-session in an Owlbear Rodeo room; the sheet is a 500px popover over the map (wide mode ~780px). Job: play a turn without hunting (roll, track HP/slots/uses), and read any roll result as a message to the table. Fidelity: clickable single-file HTML prototype with synthetic sample sheets (labelled), simulating OBR theme, role, Dice+ presence and incoming rolls via a prototype control strip outside the popover.

Confirmed interaction calls (shape, 2026-10-23; revised after user review the same day): a row is one roll target that rolls everything (to-hit, damage, save DC), with the effects written under the name ("+7 to hit · 1d8+4 piercing · DC 15 WIS"); no separate hit/damage chips; editing expands the row inline on the sheet, not a full-screen panel; the table-rolls log is a sidebar toggled from the header that widens the popover (like v1) and never opens itself; list rows are separated by hairlines; adv/dis resets after each roll, Shift = adv, Ctrl/Cmd = dis; visibility sticky; leveled spell spends a slot with Undo; inventory editable in view mode; selecting a linked token switches sheet; the log sidebar never opens itself (a save asked of you shows a short Show prompt); clickable save DC posts a pass/fail reply under the original card.

Open: GM/player data sharing mechanism, token HP display, closed-popover notification (background script), upcasting, initiative, notes tab.

## Direction contract

THESIS: The category-standard 5e sheet (header card, HP bar, boxed abilities, tabs, rows), executed so it reads as a native Owlbear Rodeo panel. It refuses novelty worlds and the parchment/serif fantasy costume; its distinction is precision and the social roll card.

OWN-WORLD: Neutrals and accent derived at runtime from OBR.theme (background.default as ground, background.paper as raised panels, text primary/secondary, primary as the single accent for selection, live state and primary actions). Roboto, one family, tight 1.125-1.2 scale, tabular numerals. Rounded panels (MUI-like radii), hairline dividers, soft offset shadows only on floating layers. Red is semantic only: HP loss, damage, natural 1; amber at half HP; green is semantic for healthy HP and a passed save. Identity colours (player and GM avatars, token rings) stay off the red, amber and green hues. Drawn SVG icons in one stroke weight.

STORY: The user sees who they are and how hurt they are first, rolls anything in one click, and watches results land in a table-rolls sidebar the whole table shares; a target answers a save straight from the card.

FIRST VIEWPORT: Top: header card (name as sheet switcher with a link icon when token-linked, subtitle, table-rolls toggle, Edit, overflow) with vitals row (HP number + bar + temp, AC shield, Adv/Normal/Dis segmented, visibility toggle). Then six ability boxes, each modifier (check) over a Save button. Then tabs (Main, Spells, Inventory), Main active: two columns, skills on the left, dense action rows (activation tag, name, effects line with to-hit, damage and DC, then range; use pips) then features on the right. Header id row also holds the table-rolls toggle with an unread badge; the log opens as a 340px sidebar beside the sheet. Primary action = clicking a row.

FORM: canon (the category standard, user-chosen as the standing exit; not on the grounded list). Quality bar: Owlbear Rodeo's own UI. Chosen sketch: .impeccable/mocks/decision/canon.html. seed:a9b7523b17b63d61

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
