<script>
  import { state } from '../stores/state.svelte.js'
  const character = $derived(state.character)
</script>

<header>
  <h1>{character.meta.name}</h1>
</header>
