<script>
  import OBR from "@owlbear-rodeo/sdk";
  import { state } from "./lib/state.svelte.js";
  const obrCount = () => {
    state.count++;
    OBR.notification.show(state.count.toString());
  };
</script>

<main>
  <button on:click={obrCount}>
    clicks: {state.count}
  </button>
</main>
