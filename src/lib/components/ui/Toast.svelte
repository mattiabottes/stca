<script>
	import { onDestroy, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';

	import { ToastMessage } from '$lib/stores';

	let dismissTimeout = null;

	const fade = () => {
		return {
			duration: 250,
			easing: cubicOut,
			css: (t) => `opacity: ${t};`
		};
	};

	onMount(() => {
		dismissTimeout = setTimeout(() => {
			$ToastMessage.show = false;
		}, 3 * 1000);
	});

	onDestroy(() => {
		if (dismissTimeout) {
			clearTimeout(dismissTimeout);
		}
	});
</script>

<div
	class="fixed z-[9999] top-0 left-0 bg-[rgba(0,0,0,0.2)] w-full h-screen flex items-center justify-center"
>
	<div
		transition:fade
		class:text-green-500={$ToastMessage.type === 'success'}
		class:text-orange-500={$ToastMessage.type === 'warning'}
		class:text-red-500={$ToastMessage.type === 'error'}
		class="flex flex-col items-center gap-4 rounded-lg p-6 text-white text-lg bg-white"
	>
		<span class="text-6xl">
			{#if $ToastMessage.type === 'success'}
				<i class="ri-checkbox-circle-line" />
			{:else if $ToastMessage.type === 'warning'}
				<i class="ri-error-warning-line" />
			{:else}
				<i class="ri-close-circle-line" />
			{/if}
		</span>
		<span class="font-semibold">{$ToastMessage.message}</span>
	</div>
</div>
