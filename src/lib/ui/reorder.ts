// Reordering list rows in edit mode: drag the grip, or focus it and use the arrow keys.
export function move<T>(list: T[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return;
  const [it] = list.splice(from, 1);
  list.splice(to, 0, it!);
}

let dragging: { list: unknown[]; index: number } | null = null;

/** Svelte attachment-style handlers for one row of `list` at `index`. */
export function reorderHandlers<T>(list: T[], index: () => number) {
  return {
    onkeydown(e: KeyboardEvent) {
      const i = index();
      if (e.key === "ArrowUp" && i > 0) move(list, i, i - 1);
      else if (e.key === "ArrowDown" && i < list.length - 1) move(list, i, i + 1);
      else return;
      e.preventDefault();
      // Keep focus on the grip after the row moves.
      const grip = e.currentTarget as HTMLElement;
      requestAnimationFrame(() => grip.isConnected && grip.focus());
    },
    ondragstart(e: DragEvent) {
      dragging = { list, index: index() };
      e.dataTransfer?.setData("text/plain", String(index()));
      if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
    },
    ondragover(e: DragEvent) {
      if (dragging?.list === list) e.preventDefault();
    },
    ondrop(e: DragEvent) {
      if (dragging?.list !== list) return;
      e.preventDefault();
      move(list, dragging.index, index());
      dragging = null;
    },
    ondragend() {
      dragging = null;
    },
  };
}
