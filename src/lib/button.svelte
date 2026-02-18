<script>
  import {state} from './state.svelte.js'
</script>

<button onclick={() => state.count++}>
	clicks: {state.count}
</button>
