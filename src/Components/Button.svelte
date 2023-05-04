<script>
	export let border = true;
	export let backgroundColor = 'blue';
	export let color = 'white';
</script>

<button
	on:click
	class:border-aqua={border}
	class:border-2={border}
	class:bg-blue={backgroundColor === 'blue'}
	class:bg-aqua={backgroundColor === 'aqua'}
	class:bg-white={backgroundColor === 'white'}
	class:bg-lightblue={backgroundColor === 'lightblue'}
	class:text-white={color === 'white'}
	class:text-blue={color === 'blue'}
	class="flex items-center justify-center h-12 text-lg mb-4 w-full font-medium rounded-lg active:text-blue active:bg-aqua transition-all"
>
	<slot />
</button>
