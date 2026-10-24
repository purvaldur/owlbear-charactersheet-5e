<script lang="ts">
  // The alert popover: table rolls that arrived while the Codex was closed, as a short stack in the corner of the map.
  // Ordinary cards fade after a few seconds; a save asked of my active sheet stays until I answer it or dismiss it.
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { app } from "../lib/app.svelte";
  import * as channel from "../lib/log/channel";
  import type { RollEntry } from "../lib/dice/types";
  import RollCard from "../components/RollCard.svelte";
  import Icon from "../components/Icon.svelte";

  const SHOW_MS = 6000;
  // Svelte animates with the Web Animations API, which the stylesheet's reduced-motion rule can't reach.
  const MOTION_MS = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 200;
  /** Give the background page this long to hand over its queue before an empty stack counts as done. */
  const SETTLE_MS = 1500;

  let now = $state(Date.now());
  let hovered = $state(false);
  let settled = $state(false);
  let emptySent = false;
  const since = $state<Record<string, number>>({});
  const dismissed = $state<Record<string, boolean>>({});
  let stack: HTMLDivElement | undefined = $state();

  const sheet = $derived(app.sheet);
  /** A save asked of my active sheet that I haven't answered yet. */
  const waiting = (e: RollEntry) => !!e.save && !!sheet && sheet.id !== e.sheetId && !e.replies.some((r) => r.sheetId === sheet.id);
  const shown = $derived(
    app.log.entries.filter((e) => e.playerId !== app.player.id && !dismissed[e.id] && (waiting(e) || now - (since[e.id] ?? now) < SHOW_MS)),
  );

  // Each card's clock starts when it first appears, and restarts once its save is answered.
  const answered = new Set<string>();
  $effect(() => {
    for (const e of app.log.entries) {
      if (since[e.id] === undefined) since[e.id] = Date.now();
      else if (e.save && sheet && e.replies.some((r) => r.sheetId === sheet.id) && !answered.has(e.id)) {
        answered.add(e.id);
        since[e.id] = Date.now();
      }
    }
  });

  // The clock stands still under the pointer or keyboard focus; leaving restarts every card's clock, so nothing
  // vanishes mid-read.
  function leave(e?: FocusEvent) {
    if (e?.relatedTarget instanceof Node && stack?.contains(e.relatedTarget)) return;
    hovered = false;
    for (const e of shown) since[e.id] = Date.now();
  }

  // Once the stack runs out, ask the background page to close the popover (it won't if a roll is still on its way).
  $effect(() => {
    if (shown.length) emptySent = false;
    if (!settled || shown.length || emptySent) return;
    emptySent = true;
    void app.room.send(channel.CHANNELS.alertEmpty, { shown: app.log.entries.map((e) => e.id) }, "LOCAL");
  });

  // Fit the popover to the stack; it is anchored at the bottom, so it grows upwards.
  $effect(() => {
    if (!stack) return;
    const ro = new ResizeObserver(() => {
      if (stack) void app.room.setPopoverHeight(channel.ALERT_POPOVER, Math.max(1, Math.ceil(stack.getBoundingClientRect().height))).catch(() => {});
    });
    ro.observe(stack);
    return () => ro.disconnect();
  });

  onMount(() => {
    const stopQueue = app.room.listen(channel.CHANNELS.alertQueue, (d) => {
      app.log.merge(channel.entriesFrom(d).filter((e) => channel.canSee(e, app.player.role, app.player.id)), true);
    });
    void app.room.send(channel.CHANNELS.alertRequest, {}, "LOCAL");
    const clock = setInterval(() => {
      if (!hovered) now = Date.now();
    }, 500);
    const settle = setTimeout(() => (settled = true), SETTLE_MS);
    return () => {
      stopQueue();
      clearInterval(clock);
      clearTimeout(settle);
    };
  });

  function onKey(e: KeyboardEvent) {
    const last = shown[shown.length - 1];
    if (e.key === "Escape" && last) dismissed[last.id] = true;
  }
</script>

<svelte:window onkeydown={onKey} />

<div class="alerts" bind:this={stack} role="log" aria-live="polite" aria-label="Table rolls" onmouseenter={() => (hovered = true)} onmouseleave={() => leave()} onfocusin={() => (hovered = true)} onfocusout={leave}>
  {#each shown as entry (entry.id)}
    <div class="alert" class:asks={waiting(entry)} out:fade={{ duration: MOTION_MS }} animate:flip={{ duration: MOTION_MS }}>
      <RollCard {entry} />
      <div class="alert-acts">
        <button class="btn ghost" onclick={() => void app.room.openAction()}><Icon name="book" size="sm" />Open Codex</button>
        <button class="btn icon ghost" aria-label="Dismiss" onclick={() => (dismissed[entry.id] = true)}><Icon name="x" size="sm" /></button>
      </div>
    </div>
  {/each}
</div>
