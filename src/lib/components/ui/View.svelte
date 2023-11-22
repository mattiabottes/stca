<script>
	import { cubicOut } from 'svelte/easing';

	const slide = () => {
		return {
			duration: 250,
			easing: cubicOut,
			css: (t) => `opacity: ${t}; transform: translateY(${50 - t * 50}%)` //t -> da 0 a 1 per 250ms
		};
	};
</script>

<div
	transition:slide
	class="fixed top-0 left-0 z-[9999] flex flex-col bg-white w-full h-screen items-start p-6"
>
	<slot />
</div>
