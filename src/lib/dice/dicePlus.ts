// Dice+ integration over OBR broadcast (diceplus.md). Requests go out labelled so results map back to the intent;
// anything that goes wrong (not installed, error, timeout) is the caller's cue to fall back to built-in dice.
import type { Room, RoomPlayer } from "../obr/adapter";
import { fromDicePlus, toDicePlus, type DicePlusGroup } from "./notation";
import type { DiceSource } from "./source";
import type { RollIntent, Visibility } from "./types";

export const SOURCE_ID = "valdurs-codex";
const READY_TIMEOUT = 1000;
const ROLL_TIMEOUT = 15000;

type RollTarget = "everyone" | "self" | "dm" | "gm_only";
/** Players' private rolls go to themselves and the GM; the GM's private rolls stay with the GM. */
export const rollTarget = (vis: Visibility, role: RoomPlayer["role"]): RollTarget => (vis === "public" ? "everyone" : role === "GM" ? "self" : "dm");

export async function dicePlusReady(room: Room, timeout = READY_TIMEOUT): Promise<boolean> {
  const requestId = crypto.randomUUID();
  return new Promise((resolve) => {
    const stop = room.listen("dice-plus/isReady", (data) => {
      const d = data as { requestId?: string; ready?: boolean };
      if (d?.ready && d.requestId === requestId) {
        stop();
        clearTimeout(timer);
        resolve(true);
      }
    });
    const timer = setTimeout(() => {
      stop();
      resolve(false);
    }, timeout);
    void room.send("dice-plus/isReady", { requestId, timestamp: Date.now() }, "ALL");
  });
}

interface ResultMessage {
  rollId: string;
  result?: { groups?: DicePlusGroup[] };
}

export function dicePlusSource(room: Room, player: () => RoomPlayer, timeout = ROLL_TIMEOUT): DiceSource {
  return {
    name: "dice+",
    roll(intent: RollIntent, opts) {
      const rollId = crypto.randomUUID();
      const me = player();
      return new Promise((resolve, reject) => {
        const done = () => {
          stopResult();
          stopError();
          clearTimeout(timer);
        };
        const stopResult = room.listen(`${SOURCE_ID}/roll-result`, (data) => {
          const msg = data as ResultMessage;
          if (msg?.rollId !== rollId) return;
          done();
          const out = fromDicePlus(intent, msg.result?.groups ?? []);
          if (intent.d20 && !opts.critOnly && !out.d20?.length) reject(new Error("Dice+ returned no d20"));
          else resolve(opts.critOnly ? { parts: out.parts } : out);
        });
        const stopError = room.listen(`${SOURCE_ID}/roll-error`, (data) => {
          const msg = data as { rollId?: string; error?: string };
          if (msg?.rollId !== rollId) return;
          done();
          reject(new Error(msg.error ?? "Dice+ error"));
        });
        const timer = setTimeout(() => {
          done();
          reject(new Error("Dice+ timed out"));
        }, timeout);
        void room.send(
          "dice-plus/roll-request",
          {
            rollId, playerId: me.id, playerName: me.name, rollTarget: rollTarget(opts.vis, me.role),
            diceNotation: toDicePlus(intent, opts.critOnly), showResults: false, timestamp: Date.now(), source: SOURCE_ID,
          },
          "ALL",
        );
      });
    },
  };
}
