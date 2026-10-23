# Spike results (real Owlbear Rodeo room, 2026-10-23)

Run with `spike.html` via `public/spike-manifest.json`, as the GM, Dice+ installed.

| Question | Result | Consequence |
|---|---|---|
| Does the action popover stay alive when closed? | Yes. Owlbear loads the iframe with the room (it reported `isOpen: false` at load) and keeps it running; `onOpenChange` fires on open. | No background script needed. Rolls arriving while closed are received; the action badge can count them. |
| Live dark theme | `background.default #1e2231`, `background.paper #222639`, `text.primary #fff`, `text.secondary rgba(255,255,255,0.7)`, `primary.main #bb99ff` (light `rgb(200,173,255)`, dark `rgb(130,107,178)`, contrastText `rgba(0,0,0,0.87)`). | DESIGN.md's approximations were too light. Tokens now use these values; the popover ground is transparent so Owlbear's own translucent, blurred paper shows through, and raised surfaces are overlays of the text colour. Light theme still unmeasured. |
| Dice+ | Ready check answers on `dice-plus/isReady`. The spike's notation `2d20kh1+7 # to hit + 1d8+4 # piercing` was rejected as invalid: a description must follow a dice group, not a modifier. | The Codex puts each label directly after its dice (`2d20kh1 # hit + 7 + 1d8 # p0 + 4`). A plain check rolled fine through the extension. The spike now offers the exact notations for a follow-up check; falling back to built-in dice logs a console warning. |
| Downloads inside the popover | Blob URL downloads work; data-URL downloads do not. | Export uses a Blob URL (already the case). |
| Broadcast and badge | Both work. | As designed. |

## Follow-up (same day)

- **Dice+ notation**: all four notations the Codex sends were accepted and returned grouped results (`2d20kh1 # hit + 7 + 1d8 # p0 + 4`, `1d20 # hit - 1`, `1d10 # p0 + 1d6 # p1`, `6d6 # p0`). With advantage, the `hit` group holds both d20s with `kept` flags; the Codex keeps the higher as expected.
- **Transparency**: with a transparent body the popover still showed an opaque near-black backdrop. Cause: `color-scheme: dark` on the iframe's root differs from Owlbear's page, so the browser paints an opaque canvas behind the iframe. `color-scheme` now sits on `body` instead.
