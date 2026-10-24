// View state that is not character data: which tab, menus, the inline editor, roll mode, toasts.
import type { RollMode, Visibility } from "../dice/types";

export type Tab = "main" | "spells" | "inventory" | "background" | "notes";
export type Menu = null | "switcher" | "more" | "hp" | "bars";
export interface Toast {
  msg: string;
  undo?: () => void;
  action?: { label: string; run: () => void };
}

export class UiState {
  tab = $state<Tab>("main");
  edit = $state(false);
  editing = $state<{ kind: "action" | "spell" | "feature"; id: string } | null>(null);
  focusEditor = $state(false);
  menu = $state<Menu>(null);
  /** The control that opened the current menu, so closing it can hand focus back. */
  menuTrigger: HTMLElement | null = null;
  picker = $state<{ q: string; lvl: "all" | number; sel: string[] } | null>(null);
  sidebar = $state(false);
  /** Only the opening of the sidebar animates; re-renders must not replay it. */
  sidebarAnim = $state(false);
  wide = $state(false);
  mode = $state<RollMode>("normal");
  vis = $state<Visibility>("public");
  /** Expanded features and roll-card descriptions. */
  open = $state<Record<string, boolean>>({});
  toast = $state<Toast | null>(null);
  private toastTimer: ReturnType<typeof setTimeout> | undefined;

  showToast(t: Toast) {
    this.toast = t;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 6000);
  }

  toggle(id: string) {
    this.open[id] = !this.open[id];
  }

  /** Shift-click rolls with advantage, Ctrl/Cmd-click with disadvantage; otherwise the segmented control decides. */
  modeFrom(e?: MouseEvent | KeyboardEvent): RollMode {
    if (e?.shiftKey) return "adv";
    if (e?.ctrlKey || e?.metaKey) return "dis";
    return this.mode;
  }
}
