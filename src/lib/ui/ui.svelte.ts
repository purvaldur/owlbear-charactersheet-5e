// View state that is not character data: which tab, menus, what the dialog popover shows, roll mode, toasts.
import type { RollMode, Visibility } from "../dice/types";
import type { Dialog, EditKind } from "../editor/protocol";
import type { Rules, SheetKind } from "../model/types";

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
  /** What the popover in the middle of the room shows for the active sheet: an entry to edit, or an SRD list. */
  dialog = $state<Dialog | null>(null);
  menu = $state<Menu>(null);
  /** A new sheet being chosen, in the switcher or the empty state: its kind, then its rules, then how to make it. */
  newSheet = $state<{ kind: SheetKind; rules: Rules | null } | null>(null);
  /** The control that opened the current menu, so closing it can hand focus back. */
  menuTrigger: HTMLElement | null = null;
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

  /** The entry open in the editor, when that is what the dialog shows. */
  get editing() {
    const d = this.dialog;
    return d?.view === "edit" ? d : null;
  }

  /** Opens an entry in the editor, or closes it if it is the one open. */
  toggleEditor(kind: EditKind, id: string) {
    this.dialog = this.editing?.id === id ? null : { view: "edit", kind, id };
  }

  /** Shift-click rolls with advantage, Ctrl/Cmd-click with disadvantage; otherwise the segmented control decides. */
  modeFrom(e?: MouseEvent | KeyboardEvent): RollMode {
    if (e?.shiftKey) return "adv";
    if (e?.ctrlKey || e?.metaKey) return "dis";
    return this.mode;
  }
}
// hmr probe
