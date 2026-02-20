<script>
  import OBR from "@owlbear-rodeo/sdk";

  import { state } from "./lib/stores/state.svelte.js";
  import Stat from "./lib/components/stat.svelte"
  import Skill from "./lib/components/skill.svelte"

  const obrCount = () => {
    state.count++;
    OBR.notification.show(state.count.toString());
  };
</script>

<main>
  {#each state.character.stats as stat }
    <Stat {stat}/>
  {/each}

  <br>
  
  {#each state.character.skills as skill, index}
    <Skill {skill} {index} />
  {/each}
</main>
