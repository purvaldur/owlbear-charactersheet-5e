<script lang="ts">
  import { app } from "../lib/app.svelte";
  import { ABILITY } from "../lib/model/defaults";
  import { damageTypes, isHealing } from "../lib/rules";
  import { initials, levelLabel } from "../lib/ui/text";
  import type { D20Result, RollEntry } from "../lib/dice/types";
  import Icon from "./Icon.svelte";

  let { entry }: { entry: RollEntry } = $props();
  const ui = app.ui;
  const sheet = $derived(app.sheet);
  const pending = $derived(!!app.log.pending[entry.id]);
  const dmgTotal = $derived(entry.dmg?.reduce((s, p) => s + p.total, 0) ?? 0);
  const types = $derived(damageTypes(entry.dmg ?? []));
  const healing = $derived(isHealing(entry.dmg ?? []));
  const canSave = $derived(!!entry.save && !pending && !!sheet && sheet.id !== entry.sheetId);
  const answered = $derived(!!sheet && entry.replies.some((r) => r.sheetId === sheet.id));
  const open = $derived(entry.showDesc || !!ui.open[entry.id]);
  // Cards from before 2.1.1 carry no role; an unnamed GM's cards say "GM".
  const fromGM = $derived(entry.role ? entry.role === "GM" : entry.player === "GM");

  function dice(d: D20Result) {
    return d.rolls.map((r, i) => ({ r, kept: d.rolls.length === 1 || i === d.kept }));
  }
</script>

<article class="card" class:pending aria-label="{entry.who}, {entry.title}">
  <div class="card-h">
    <span class="av" style="background:{entry.color}">{initials(entry.who)}</span>
    <span class="who">{entry.who}</span><span class="what">{entry.title}</span>
    <span class="meta">
      {#if entry.vis === "gm"}<span title={fromGM ? "Hidden from players" : "Sent to the GM only"}><Icon name="eyeOff" size="sm" /></span>{/if}
      <span>{entry.player}</span>
    </span>
  </div>

  {#if entry.d20 || entry.dmg?.length || entry.result}
    <div class="card-b">
      {#if entry.d20}
        <div class="res">
          <span class="res-top">
            {#if pending}<span class="shimmer"></span>{:else}<span class="res-n">{entry.d20.total}</span>{/if}
            <span class="res-u">{entry.d20.label}</span>
          </span>
          <span class="res-x">
            {#if pending}Rolling with Dice+…{:else}
              d20 {#each dice(entry.d20) as d, i (i)}{#if d.kept}<span class="k">{d.r}</span>{:else}<s>{d.r}</s>{/if}{" "}{/each}{#if entry.d20.mod}{entry.d20.mod < 0 ? "− " : "+ "}{Math.abs(entry.d20.mod)}{/if}{entry.d20.mode === "adv" ? " · advantage" : entry.d20.mode === "dis" ? " · disadvantage" : ""}
            {/if}
          </span>
          {#if !pending && entry.d20.nat === 20 && entry.d20.label !== "death save"}
            <span class="flag crit">{entry.d20.label === "to hit" ? "Critical hit" : "Natural 20"}</span>
          {:else if !pending && entry.d20.nat === 1}
            <span class="flag fumble">Natural 1</span>
          {/if}
        </div>
      {/if}
      {#if entry.dmg?.length}
        <div class="res">
          <span class="res-top">
            {#if pending}<span class="shimmer"></span>{:else}<span class="res-n" class:sm={!!entry.d20}>{dmgTotal}</span>{/if}
            <span class="res-u">{healing ? "healing" : types.length === 1 ? types[0] : types.length ? "damage" : "total"}</span>
          </span>
          <span class="res-x">
            {#if !pending}
              {entry.dmg.map((p) => `${p.n ? `${p.n}d${p.d} (${p.rolls.join(", ")})` : ""}${p.bonus ? `${p.n ? " " : ""}${p.bonus < 0 ? "−" : "+"} ${Math.abs(p.bonus)}` : ""}${types.length > 1 ? ` ${p.type}` : ""}`).join(" · ")}{entry.d20?.nat === 20 && entry.d20.label === "to hit" ? " · crit doubles dice" : ""}
            {:else}&nbsp;{/if}
          </span>
        </div>
      {/if}
      {#if entry.result && !pending}<span class="flag" class:pass={entry.result.pass} class:fail={!entry.result.pass} style="align-self:center">{entry.result.text}</span>{/if}
    </div>
  {/if}

  {#if open && entry.sub}<div class="card-sub">{entry.sub}</div>{/if}
  {#if open && entry.desc}<div class="desc">{entry.desc}</div>{/if}

  {#if entry.save && !pending}
    {#if canSave && !answered && sheet}
      <button class="save-btn" onclick={(e) => app.replySave(entry, sheet, e)}><Icon name="dice" size="sm" />{app.saveLabel(entry, sheet)} · DC {entry.save.dc}</button>
    {:else}
      <span class="calc">{ABILITY[entry.save.target].long} save · DC {entry.save.dc}</span>
    {/if}
  {/if}

  {#if entry.replies.length && entry.save}
    <div class="replies">
      {#each entry.replies as r (r.sheetId)}
        <div class="reply">
          <span class="av" style="background:{r.color}">{initials(r.who)}</span>
          <span class="grow">{r.who} · {ABILITY[entry.save.target].short} save · d20 {r.d20.nat}{r.d20.mod ? ` ${r.d20.mod < 0 ? "−" : "+"} ${Math.abs(r.d20.mod)}` : ""}</span>
          <span class="rn">{r.d20.total}</span><span class="flag" class:pass={r.pass} class:fail={!r.pass}>{r.pass ? "Pass" : "Fail"}</span>
        </div>
      {/each}
    </div>
  {/if}

  {#if (entry.desc && !entry.showDesc) || entry.spent || entry.used || entry.note}
    <div class="card-f">
      {#if entry.desc && !entry.showDesc}
        <button class="linkbtn" aria-expanded={open} onclick={() => ui.toggle(entry.id)}>{open ? "Hide description" : "Show description"}</button>
      {/if}
      {#if entry.spent && !pending}
        <span>Used a {levelLabel(entry.spent.level)} slot, {entry.spent.left} left</span>
        <button class="linkbtn" onclick={() => app.undoSpend(entry)}><Icon name="undo" size="sm" />Undo</button>
      {/if}
      {#if entry.used && !pending}
        <span>Used one, {entry.used.left} left</span>
        <button class="linkbtn" onclick={() => app.undoSpend(entry)}><Icon name="undo" size="sm" />Undo</button>
      {/if}
      {#if entry.note && !pending}<span class="flag note">{entry.note}</span>{/if}
    </div>
  {/if}
</article>
