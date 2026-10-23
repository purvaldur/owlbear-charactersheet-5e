// Development spike: answers the open questions from the build plan inside a real Owlbear Rodeo room.
// (a) does the popover iframe stay alive when closed, (b) Dice+ round trip, (c) live theme values, (d) downloads.
import OBR from "@owlbear-rodeo/sdk";

const SOURCE = "valdurs-codex-spike";
const lines: string[] = [];
const $ = (id: string) => document.getElementById(id)!;

function log(msg: string, data?: unknown) {
  const line = `[${new Date().toISOString().slice(11, 23)}] ${msg}${data === undefined ? "" : " " + JSON.stringify(data)}`;
  lines.push(line);
  $("log").textContent = lines.join("\n");
}

// Heartbeat survives in localStorage across iframe reloads, so a reopen tells us whether we kept running.
const HB = "codex-spike/heartbeat";
const prev = Number(localStorage.getItem(HB) || 0);
const loadedAt = Date.now();
setInterval(() => localStorage.setItem(HB, String(Date.now())), 1000);

OBR.onReady(async () => {
  log("ready", { isAvailable: OBR.isAvailable, previousHeartbeatGapMs: prev ? loadedAt - prev : null });
  const [id, name, role, conn] = await Promise.all([OBR.player.id, OBR.player.getName(), OBR.player.getRole(), OBR.player.getConnectionId()]);
  log("player", { id, name, role, conn, roomId: OBR.room.id });

  const theme = await OBR.theme.getTheme();
  log("theme", theme);
  const sw = (c: string, label: string) => `<span class="sw" style="background:${c}"></span>${label} ${c}<br>`;
  $("theme").innerHTML =
    sw(theme.background.default, "background.default") + sw(theme.background.paper, "background.paper") +
    sw(theme.primary.main, "primary.main") + sw(theme.primary.light, "primary.light") + sw(theme.primary.dark, "primary.dark") +
    sw(theme.primary.contrastText, "primary.contrastText") + sw(theme.text.primary, "text.primary") + sw(theme.text.secondary, "text.secondary");
  OBR.theme.onChange((t) => log("theme changed", { mode: t.mode, bg: t.background, primary: t.primary.main }));

  $("life").textContent = `Loaded at ${new Date(loadedAt).toLocaleTimeString()}. Previous heartbeat gap: ${prev ? Math.round((loadedAt - prev) / 1000) + "s" : "none"}.`;
  OBR.action.onOpenChange((open) => log("action open change", { open, aliveForMs: Date.now() - loadedAt }));
  log("action isOpen", await OBR.action.isOpen());

  OBR.broadcast.onMessage(`${SOURCE}/ping`, (e) => log("broadcast received", e.data));
  $("b-send").onclick = async () => { await OBR.broadcast.sendMessage(`${SOURCE}/ping`, { from: name, at: Date.now() }); log("broadcast sent"); };
  $("b-badge").onclick = async () => { await OBR.action.setBadgeText("3"); log("badge set"); };
  $("b-badge-clear").onclick = async () => { await OBR.action.setBadgeText(undefined); log("badge cleared"); };

  OBR.broadcast.onMessage("dice-plus/isReady", (e) => log("dice+ isReady message", e.data));
  OBR.broadcast.onMessage(`${SOURCE}/roll-result`, (e) => log("dice+ result", e.data));
  OBR.broadcast.onMessage(`${SOURCE}/roll-error`, (e) => log("dice+ error", e.data));
  $("d-ready").onclick = () => OBR.broadcast.sendMessage("dice-plus/isReady", { requestId: crypto.randomUUID(), timestamp: Date.now() }, { destination: "ALL" });
  document.querySelectorAll<HTMLButtonElement>(".d-n").forEach((b) => {
    b.onclick = async () => {
      const rollId = crypto.randomUUID();
      const diceNotation = b.dataset.n!;
      await OBR.broadcast.sendMessage("dice-plus/roll-request", {
        rollId, playerId: id, playerName: name, rollTarget: ($("d-target") as HTMLSelectElement).value,
        diceNotation, showResults: false, timestamp: Date.now(), source: SOURCE,
      }, { destination: "ALL" });
      log("dice+ request sent", { rollId, diceNotation, rollTarget: ($("d-target") as HTMLSelectElement).value });
    };
  });
});

$("f-blob").onclick = () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify({ test: "blob" })], { type: "application/json" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "codex-spike-blob.json" });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  log("blob download triggered");
};
$("f-data").onclick = () => {
  const a = Object.assign(document.createElement("a"), { href: "data:application/json," + encodeURIComponent('{"test":"data"}'), download: "codex-spike-data.json" });
  document.body.append(a); a.click(); a.remove();
  log("data URL download triggered");
};
$("copy").onclick = async () => {
  try { await navigator.clipboard.writeText(lines.join("\n")); log("report copied"); }
  catch { log("clipboard blocked: select the log text and copy it manually"); }
};
