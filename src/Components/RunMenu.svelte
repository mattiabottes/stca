<script>
	import { NavigationStack, RunSection } from '../libs/stores';

	let sections = ['tyres', 'setup', 'impressions', 'info'];

	const changeSection = (section = '') => {
		$NavigationStack.pop();

		$RunSection = section;
	};
</script>

<div class="fixed bottom-20 right-4 border border-aqua rounded-xl p-4 bg-blue flex flex-col gap-2">
	{#each sections as section}
		<button
			on:click={() => changeSection(section)}
			class:border-aqua={section === $RunSection}
			class:border-white={section !== $RunSection}
			class:bg-aqua={section === $RunSection}
			class:text-blue={section === $RunSection}
			class="h-10 border px-5 uppercase rounded-md active:bg-aqua active:border-aqua active:text-blue transition-all"
		>
			{section}
		</button>
	{/each}
	<button
		class="h-10 border px-5 rounded-md active:bg-aqua active:border-aqua active:text-blue transition-all"
	>
		+ Run
	</button>
</div>
