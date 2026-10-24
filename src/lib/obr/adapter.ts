import type { Token, TokenLink } from "../tokens/link";
import type { PageBus } from "./pages";

// The one seam between the sheet and Owlbear Rodeo. The real SDK and the dev/test mock both implement Room,
// so the UI runs (and can be screenshotted) outside a room.
export type Role = "GM" | "PLAYER";

export interface ThemeColor {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}
export interface RoomTheme {
  mode: "DARK" | "LIGHT";
  primary: ThemeColor;
  secondary: ThemeColor;
  background: { default: string; paper: string };
  text: { primary: string; secondary: string; disabled: string };
}

export interface RoomPlayer {
  id: string;
  name: string;
  role: Role;
}

export type Destination = "REMOTE" | "LOCAL" | "ALL";

export interface Room {
  readonly inOwlbear: boolean;
  player(): Promise<RoomPlayer>;
  onPlayerChange(cb: (p: RoomPlayer) => void): () => void;
  theme(): Promise<RoomTheme>;
  onThemeChange(cb: (t: RoomTheme) => void): () => void;
  send(channel: string, data: unknown, destination?: Destination): Promise<void>;
  listen(channel: string, cb: (data: unknown) => void): () => void;
  setSize(width: number, height?: number): Promise<void>;
  /** Width of the room's viewport (the browser window Owlbear runs in), to decide if the popover can widen. */
  viewportWidth(): Promise<number>;
  viewportHeight(): Promise<number>;
  setBadge(text?: string): Promise<void>;
  isOpen(): Promise<boolean>;
  onOpenChange(cb: (open: boolean) => void): () => void;
  /** Opens the Codex's own popover (from the alert popover). */
  openAction(): Promise<void>;
  /** Resizes one of our popovers other than the action's (the alert popover). */
  setPopoverHeight(id: string, height: number): Promise<void>;
  /** Opens one of our pages as a popover in the middle of the room, over the map (the editor). */
  openDialog(id: string, url: string, width: number, height: number): Promise<void>;
  closePopover(id: string): Promise<void>;
  /** Messages between this client's own pages, with no size limit. */
  readonly pages: PageBus;

  /** Character and mount tokens in the open scene, with their Codex link if any. Fails when no scene is open. */
  tokens(): Promise<Token[]>;
  /** Fires with the full token list whenever tokens change, and with [] when the scene closes. */
  onTokens(cb: (tokens: Token[]) => void): () => void;
  /** Writes (or, with null, removes) the link on these tokens. */
  setLink(ids: string[], link: TokenLink | null): Promise<void>;
  selection(): Promise<string[]>;
  onSelection(cb: (ids: string[]) => void): () => void;
  /** Room-wide shared data (Owlbear room metadata). */
  roomData(): Promise<Record<string, unknown>>;
  setRoomData(patch: Record<string, unknown>): Promise<void>;
  onRoomData(cb: (data: Record<string, unknown>) => void): () => void;
}
