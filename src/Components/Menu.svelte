<script>
	export let active = false;
</script>

<div
	data-active={active}
	class="menu flex flex-col top-0 right-0 w-[80%] fixed bg-aqua text-blue h-screen overflow-auto"
>
	<slot />
</div>

<style>
	.menu {
		transition: transform 150ms ease;
		transform: translateX(100%);
	}

	.menu[data-active='true'] {
		transform: translateX(0%);
	}
</style>
