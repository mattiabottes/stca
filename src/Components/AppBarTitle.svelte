<script>
	export let title = '';
	export let subtitle = '';
</script>

<span class="flex-1">
	{#if !subtitle}
		<span class="text-lg font-semibold">{title}</span>
	{:else}
		<div class="flex flex-col">
			<span class="text-lg font-semibold">{title}</span>
			<span class="text-sm">{subtitle}</span>
		</div>
	{/if}
</span>
