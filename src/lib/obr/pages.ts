// Messages between this client's own pages (the Codex and the editor popover). The pages share an origin, so a
// BroadcastChannel carries them: unlike OBR broadcast it has no 16KB cap, which a whole sheet can go over.
export interface PageBus {
  send(channel: string, data: unknown): void;
  listen(channel: string, cb: (data: unknown) => void): () => void;
}

const BUS_NAME = "valdurs-codex/pages";

/** Reaches every other page of ours in this browser tab's room; a page never hears its own messages. */
export function browserPages(): PageBus {
  const bc = new BroadcastChannel(BUS_NAME);
  return {
    send: (channel, data) => bc.postMessage({ channel, data }),
    listen(channel, cb) {
      const h = (e: MessageEvent) => {
        if (e.data?.channel === channel) cb(e.data.data);
      };
      bc.addEventListener("message", h);
      return () => bc.removeEventListener("message", h);
    },
  };
}

/** One page's bus for tests: messages loop back, as if every page shared it. */
export function memoryPages(): PageBus {
  const bus = new EventTarget();
  return {
    send: (channel, data) => queueMicrotask(() => bus.dispatchEvent(new CustomEvent(channel, { detail: structuredClone(data) }))),
    listen(channel, cb) {
      const h = (e: Event) => cb((e as CustomEvent).detail);
      bus.addEventListener(channel, h);
      return () => bus.removeEventListener(channel, h);
    },
  };
}
