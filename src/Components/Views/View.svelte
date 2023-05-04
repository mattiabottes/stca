<script>
	import { cubicOut } from 'svelte/easing';

	const slideLeft = () => {
		return {
			duration: 250,
			easing: cubicOut,
			css: (t, u) => `opacity: {${u + 0.4}}; transform: translateX(${u * 100}%)`
		};
	};
</script>

<div
	transition:slideLeft
	class="fixed top-0 left-0 w-full h-screen z-[99999] bg-blue"
	style="box-shadow: 0px 0px 20px rgba(0,0,0,0.2)"
>
	<slot />
</div>
