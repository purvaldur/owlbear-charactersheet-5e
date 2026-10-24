<script lang="ts">
  // A number field bound to sheet data. Svelte binds an emptied number field as null; leaving the field empty puts
  // the fallback back (the schema's default for that field), so the sheet never keeps a null.
  import type { HTMLInputAttributes } from "svelte/elements";

  let { value = $bindable(), fallback = 0, ...rest }: Omit<HTMLInputAttributes, "value" | "type"> & { value: number; fallback?: number } = $props();
</script>

<input {...rest} type="number" bind:value onchange={() => (value ??= fallback)} />
