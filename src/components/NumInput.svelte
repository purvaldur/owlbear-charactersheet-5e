<script lang="ts">
  // A number field bound to sheet data. Svelte binds an emptied number field as null; leaving the field puts the
  // fallback back (the schema's default for that field) and keeps the value within min, max and whole numbers.
  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = Omit<HTMLInputAttributes, "value" | "type" | "min" | "max"> & {
    value: number;
    fallback?: number;
    min?: number;
    max?: number;
    integer?: boolean;
  };
  let { value = $bindable(), fallback = 0, min, max, integer = false, ...rest }: Props = $props();

  function settle() {
    let n = value ?? fallback;
    if (integer) n = Math.trunc(n);
    if (min !== undefined) n = Math.max(min, n);
    if (max !== undefined) n = Math.min(max, n);
    if (n !== value) value = n;
  }
</script>

<input {...rest} type="number" {min} {max} bind:value onchange={settle} />
