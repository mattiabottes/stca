<script>
	let counter = 0;

	const handleClick = () => counter++;
</script>

<div class="h-screen flex flex-col justify-center items-center gap-8">
	<span class="text-2xl font-semibold text-blue-500">Hurray!</span>
	<span>{counter} clicks</span>

	<button
		class="p-2 rounded-lg bg-gray-100 active:opacity-60 transition-opacity"
		on:click={handleClick}
	>
		<i class="ri-add-line" /> Add click
	</button>
</div>
