// A simulated room for the dev harness and tests. Messages sent to "ALL"/"LOCAL" loop back; the harness can
// inject messages from other players with `receive`, and change role or theme on the fly.
import type { Destination, Room, RoomPlayer, RoomTheme } from "./adapter";
import type { Token, TokenLink } from "../tokens/link";

/** OBR's real dark theme, captured in a live room. */
export const DARK_THEME: RoomTheme = {
  mode: "DARK",
  primary: { main: "#bb99ff", light: "rgb(200, 173, 255)", dark: "rgb(130, 107, 178)", contrastText: "rgba(0, 0, 0, 0.87)" },
  secondary: { main: "#ee99ff", light: "rgb(241, 173, 255)", dark: "rgb(166, 107, 178)", contrastText: "rgba(0, 0, 0, 0.87)" },
  background: { default: "#1e2231", paper: "#222639" },
  text: { primary: "#fff", secondary: "rgba(255, 255, 255, 0.7)", disabled: "rgba(255, 255, 255, 0.5)" },
};
export const LIGHT_THEME: RoomTheme = {
  mode: "LIGHT",
  primary: { main: "#7b5cd6", light: "#a68bf0", dark: "#6448c0", contrastText: "#ffffff" },
  secondary: { main: "#b86bc9", light: "#d19ae0", dark: "#8a4a99", contrastText: "#ffffff" },
  background: { default: "#eef0f5", paper: "#ffffff" },
  text: { primary: "#1b1e2b", secondary: "#555a6e", disabled: "#8d90a3" },
};

export class MockRoom implements Room {
  readonly inOwlbear = false;
  sent: { channel: string; data: unknown; destination: Destination }[] = [];
  width = 500;
  badge: string | undefined;
  private me: RoomPlayer;
  private currentTheme: RoomTheme;
  private open = true;
  private bus = new EventTarget();
  /** Tokens on the simulated map; the harness and tests add and select them. */
  tokenList: Token[] = [];
  selected: string[] = [];
  data: Record<string, unknown> = {};
  popoverHeights: Record<string, number> = {};
  actionOpened = 0;

  constructor(player: Partial<RoomPlayer> = {}, theme: RoomTheme = DARK_THEME) {
    this.me = { id: "player-sam", name: "Sam", role: "PLAYER", ...player };
    this.currentTheme = theme;
  }

  private on<T>(type: string, cb: (v: T) => void) {
    const h = (e: Event) => cb((e as CustomEvent<T>).detail);
    this.bus.addEventListener(type, h);
    return () => this.bus.removeEventListener(type, h);
  }
  private emit(type: string, detail: unknown) {
    this.bus.dispatchEvent(new CustomEvent(type, { detail }));
  }

  async player() {
    return { ...this.me };
  }
  onPlayerChange(cb: (p: RoomPlayer) => void) {
    return this.on("player", cb);
  }
  async theme() {
    return this.currentTheme;
  }
  onThemeChange(cb: (t: RoomTheme) => void) {
    return this.on("theme", cb);
  }
  async send(channel: string, data: unknown, destination: Destination = "ALL") {
    this.sent.push({ channel, data, destination });
    if (destination !== "REMOTE") queueMicrotask(() => this.emit(`msg:${channel}`, data));
  }
  listen(channel: string, cb: (data: unknown) => void) {
    return this.on(`msg:${channel}`, cb);
  }
  async setSize(width: number) {
    this.width = width;
    this.emit("size", width);
  }
  async viewportWidth() {
    return globalThis.innerWidth ?? 1280;
  }
  async setBadge(text?: string) {
    this.badge = text;
  }
  async isOpen() {
    return this.open;
  }
  onOpenChange(cb: (open: boolean) => void) {
    return this.on("open", cb);
  }
  async openAction() {
    this.actionOpened++;
    this.setOpen(true);
  }
  async setPopoverHeight(id: string, height: number) {
    this.popoverHeights[id] = height;
  }
  async tokens() {
    return this.tokenList.map((t) => ({ ...t }));
  }
  onTokens(cb: (tokens: Token[]) => void) {
    return this.on("tokens", cb);
  }
  async setLink(ids: string[], link: TokenLink | null) {
    this.tokenList = this.tokenList.map((t) => (ids.includes(t.id) ? { ...t, link: link && structuredClone(link) } : t));
    this.emit("tokens", this.tokenList.map((t) => ({ ...t })));
  }
  async selection() {
    return [...this.selected];
  }
  onSelection(cb: (ids: string[]) => void) {
    return this.on("selection", cb);
  }
  async roomData() {
    return { ...this.data };
  }
  async setRoomData(patch: Record<string, unknown>) {
    this.data = { ...this.data, ...patch };
    this.emit("roomData", { ...this.data });
  }
  onRoomData(cb: (data: Record<string, unknown>) => void) {
    return this.on("roomData", cb);
  }

  // ---- harness controls ----
  receive(channel: string, data: unknown) {
    this.emit(`msg:${channel}`, data);
  }
  setPlayer(p: Partial<RoomPlayer>) {
    this.me = { ...this.me, ...p };
    this.emit("player", { ...this.me });
  }
  setTheme(t: RoomTheme) {
    this.currentTheme = t;
    this.emit("theme", t);
  }
  setOpen(open: boolean) {
    this.open = open;
    this.emit("open", open);
  }
  onSize(cb: (w: number) => void) {
    return this.on("size", cb);
  }
  addToken(name: string, link: TokenLink | null = null) {
    const t = { id: `token-${this.tokenList.length + 1}`, name, link };
    this.tokenList = [...this.tokenList, t];
    this.emit("tokens", this.tokenList.map((x) => ({ ...x })));
    return t.id;
  }
  select(ids: string[]) {
    this.selected = [...ids];
    this.emit("selection", [...ids]);
  }
}
