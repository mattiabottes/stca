<script>
	export let full = false;
	export let margin = true;
</script>

<div
	class:h-[calc(100vh-56px)]={!full}
	class:h-full={full}
	class:py-2={margin}
	class:px-4={margin}
	class="text-white overflow-auto py-2 px-4"
>
	<slot />
</div>
