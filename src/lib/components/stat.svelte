<script>
  const { stat } = $props()

  const modifier = $derived(Math.floor((stat.value - 10) / 2))
</script>

<div>
  <span>{stat.name.full}</span>
  <span>{stat.value}</span>
  <span>{modifier >= 0 ? '+' : ''}{modifier}</span>
</div>

