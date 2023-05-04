<script>
	export let title = '';
	export let type = 'text';
	export let value = '';

	export let backgroundColor = 'white';
	export let color = 'blue';
</script>

<div class="flex flex-col gap-1 mb-4">
	<span class="text-sm mx-2 opacity-60">{title}</span>
	{#if type === 'text'}
		<input
			class:bg-white={backgroundColor === 'white'}
			class:bg-blue={backgroundColor === 'blue'}
			class:border-aqua={backgroundColor === 'white'}
			class:border-white={backgroundColor === 'blue'}
			class:color-white={color === 'white'}
			class:color-blue={color === 'blue'}
			bind:value
			on:change
			type="text"
			class="h-12 px-2 border-2 rounded-lg"
		/>
	{:else if type === 'password'}
		<input
			class:bg-white={backgroundColor === 'white'}
			class:bg-blue={backgroundColor === 'blue'}
			class:border-aqua={backgroundColor === 'white'}
			class:border-white={backgroundColor === 'blue'}
			class:color-white={color === 'white'}
			class:color-blue={color === 'blue'}
			bind:value
			on:change
			type="password"
			class="h-12 px-2 border-2 rounded-lg"
		/>
	{:else if type === 'date'}
		<input
			class:bg-white={backgroundColor === 'white'}
			class:bg-blue={backgroundColor === 'blue'}
			class:border-aqua={backgroundColor === 'white'}
			class:border-white={backgroundColor === 'blue'}
			class:color-white={color === 'white'}
			class:color-blue={color === 'blue'}
			bind:value
			on:change
			type="date"
			class="h-12 px-2 border-2 rounded-lg"
		/>
	{:else if type === 'number'}
		<input
			class:bg-white={backgroundColor === 'white'}
			class:bg-blue={backgroundColor === 'blue'}
			class:border-aqua={backgroundColor === 'white'}
			class:border-white={backgroundColor === 'blue'}
			class:color-white={color === 'white'}
			class:color-blue={color === 'blue'}
			bind:value
			on:change
			type="number"
			class="h-12 px-2 border-2 rounded-lg"
		/>
	{:else if type === 'textarea'}
		<textarea
			class:bg-white={backgroundColor === 'white'}
			class:bg-blue={backgroundColor === 'blue'}
			class:border-aqua={backgroundColor === 'white'}
			class:border-white={backgroundColor === 'blue'}
			class:color-white={color === 'white'}
			class:color-blue={color === 'blue'}
			class="p-2 border-2 rounded-lg"
			bind:value
			on:change
			rows={5}
		/>
	{/if}
</div>
