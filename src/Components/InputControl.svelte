<script>
	export let value = '';

	let editValue = false;

	const initEditValue = (node) => {
		node.focus();
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	on:click={() => (editValue = true)}
	class="flex-1 flex items-center justify-center h-10 bg-blue border border-white rounded-lg"
>
	{value}
</div>

{#if editValue}
	<div class="flex flex-col fixed left-0 z-[99999] bottom-0 h-full w-full">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={() => (editValue = false)} class="flex-1" />
		<div class="flex h-14 w-full bg-lightblue p-2">
			<input
				id="editValueInput"
				bind:value
				use:initEditValue
				type="text"
				class="bg-transparent text-white h-full w-full"
			/>
			<button
				on:click={() => (editValue = false)}
				class="w-10 h-10 text-xl flex items-center justify-center"
			>
				<i class="ri-check-line" />
			</button>
		</div>
	</div>
{/if}
