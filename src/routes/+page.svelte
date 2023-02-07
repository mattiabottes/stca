<script>
	let hello = 'Hello';
	let world = 'world';

	const toggleTitle = () => {
		if (hello === 'Hello') {
			hello = 'Ciao';
			world = 'mondo';
		} else {
			hello = 'Hello';
			world = 'world';
		}
	};
</script>

<main>
	<div class="p-6 flex flex-col h-screen items-center justify-center">
		<p class="text-3xl font-semibold mb-4">
			{hello} <span class="text-green-500 underline">{world}</span>
		</p>
		<p class="text-lg text-center opacity-80">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua.
		</p>
		<button
			on:click={toggleTitle}
			class="bg-green-500 text-white m-8 px-4 py-2 rounded-md active:opacity-60 transition-all"
		>
			Click me!
		</button>
	</div>
</main>

<style>
	:global(*) {
		-webkit-tap-highlight-color: rgba(
			0,
			0,
			0,
			0
		); /* make transparent link selection, adjust last value opacity 0 to 1.0 */
		box-sizing: border-box;
	}

	:global(*):focus {
		outline: 0;
	}

	:global(body) {
		-webkit-touch-callout: none; /* prevent callout to copy image, etc when tap to hold */
		-webkit-text-size-adjust: none; /* prevent webkit from resizing text to fit */
		-webkit-user-select: none; /* prevent copy paste, to allow, change 'none' to 'text' */
	}
</style>
