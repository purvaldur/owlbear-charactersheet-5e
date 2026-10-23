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
  setBadge(text?: string): Promise<void>;
  isOpen(): Promise<boolean>;
  onOpenChange(cb: (open: boolean) => void): () => void;
}
