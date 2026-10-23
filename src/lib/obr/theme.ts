// Writes the room's theme into the --obr-* custom properties that styles/tokens.css derives every colour from.
import type { RoomTheme } from "./adapter";

export function themeVars(t: RoomTheme): Record<string, string> {
  return {
    "--obr-bg": t.background.default,
    "--obr-paper": t.background.paper,
    "--obr-text": t.text.primary,
    "--obr-text-2": t.text.secondary,
    "--obr-primary": t.primary.main,
    "--obr-primary-light": t.primary.light,
    "--obr-primary-dark": t.primary.dark,
    "--obr-on-primary": t.primary.contrastText,
  };
}

export function applyTheme(t: RoomTheme, root: HTMLElement = document.documentElement) {
  root.dataset.mode = t.mode === "LIGHT" ? "light" : "dark";
  for (const [k, v] of Object.entries(themeVars(t))) root.style.setProperty(k, v);
}
