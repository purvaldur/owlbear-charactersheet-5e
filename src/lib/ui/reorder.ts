// Reordering list rows in edit mode: drag the grip, or focus it and use the arrow keys.
export function move<T>(list: T[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return;
  const [it] = list.splice(from, 1);
  list.splice(to, 0, it!);
}

let dragging: { list: unknown[]; item: unknown } | null = null;

/**
 * Event handlers for the row showing `item` in `list`. `peers` are the rows shown alongside it (spells of one level
 * share one list but are shown by level), so the arrow keys step past rows shown elsewhere and drops stay in the group.
 */
export function reorderHandlers<T>(list: T[], item: () => T, peers: () => T[] = () => list) {
  const moveOnto = (from: T, onto: T) => move(list, list.indexOf(from), list.indexOf(onto));
  return {
    onkeydown(e: KeyboardEvent) {
      const group = peers();
      const i = group.indexOf(item());
      const target = e.key === "ArrowUp" ? group[i - 1] : e.key === "ArrowDown" ? group[i + 1] : undefined;
      if (i < 0 || target === undefined) return;
      e.preventDefault();
      moveOnto(item(), target);
      // Keep focus on the grip after the row moves.
      const grip = e.currentTarget as HTMLElement;
      requestAnimationFrame(() => grip.isConnected && grip.focus());
    },
    ondragstart(e: DragEvent) {
      dragging = { list, item: item() };
      e.dataTransfer?.setData("text/plain", String(list.indexOf(item())));
      if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
    },
    ondragover(e: DragEvent) {
      if (dragging?.list === list && peers().includes(dragging.item as T)) e.preventDefault();
    },
    ondrop(e: DragEvent) {
      if (dragging?.list !== list || !peers().includes(dragging.item as T)) return;
      e.preventDefault();
      moveOnto(dragging.item as T, item());
      dragging = null;
    },
    ondragend() {
      dragging = null;
    },
  };
}
