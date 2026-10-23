<script lang="ts">
  import { hpState, type Hp } from "../lib/rules";

  let { hp }: { hp: Hp } = $props();
  const pct = $derived(hp.max ? (hp.cur / hp.max) * 100 : 0);
  const temp = $derived(hp.max ? Math.min((hp.temp / hp.max) * 100, 100 - pct) : 0);
  const state = $derived(hpState(hp));
</script>

<span class="bar" class:mid={state === "mid"} class:low={state === "low"}>
  <i style="width:{pct}%"></i>{#if temp > 0}<i class="t" style="width:{temp}%"></i>{/if}
</span>
