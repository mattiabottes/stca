<script>
	const height = window.innerHeight;
	const size = height / 2 - 150;
</script>

<div style="height: {size}px; width: {size}px" class="relative">
	<div
		style="border-radius: 60px 0px 0px 0px"
		class="absolute top-0 left-0 w-[40%] h-[40%] border-l-2 border-t-2 border-white"
	/>
	<div
		style="border-radius: 0px 60px 0px 0px"
		class="absolute top-0 right-0 w-[40%] h-[40%] border-r-2 border-t-2 border-white"
	/>
	<div
		style="border-radius: 0px 0px 0px 60px"
		class="absolute bottom-0 left-0 w-[40%] h-[40%] border-l-2 border-b-2 border-white"
	/>
	<div
		style="border-radius: 0px 0px 60px 0px"
		class="absolute bottom-0 right-0 w-[40%] h-[40%] border-r-2 border-b-2 border-white"
	/>
</div>
