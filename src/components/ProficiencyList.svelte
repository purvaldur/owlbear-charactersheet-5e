<script lang="ts" module>
  /** "Light armor, Shields" → ["Light armor", "Shields"]: what Edit's comma-separated field holds. */
  export const splitList = (text: string) => text.split(",").map((s) => s.trim()).filter(Boolean);
</script>

<script lang="ts">
  // Proficiencies on Main, under features: armor, weapons, tools (vehicles too) and languages. Play shows all four,
  // "None" for an empty one; Edit gives each a comma-separated field.
  import { app } from "../lib/app.svelte";
  import { PROFICIENCY_KINDS } from "../lib/model/defaults";
  import type { Sheet } from "../lib/model/types";

  let { sheet }: { sheet: Sheet } = $props();
  const editing = $derived(app.ui.edit);
  const p = $derived(sheet.proficiencies);
</script>

{#if editing}
  <div class="prof-edit">
    {#each PROFICIENCY_KINDS as [k, label, hint] (k)}
      <label class="fld"><span>{label}</span>
        <input class="in" value={p[k].join(", ")} placeholder={hint} onchange={(e) => (p[k] = splitList(e.currentTarget.value))} />
      </label>
    {/each}
  </div>
{:else}
  <dl class="profs">
    {#each PROFICIENCY_KINDS as [k, label] (k)}
      <div><dt>{label}</dt><dd class:none={!p[k].length}>{p[k].join(", ") || "None"}</dd></div>
    {/each}
  </dl>
{/if}
