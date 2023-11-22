<script>
	import View from '../ui/View.svelte';

	export let show = false;

	export let handleChooseGuestType = (type = '') => {};

	const handleBack = () => (show = false);
</script>

<View>
	<form class="flex flex-1 flex-col py-8 gap-8 w-full">
		<div class="flex items-center gap-4">
			<button tabindex="-1" on:click={handleBack}>
				<i class="ri-arrow-left-line text-3xl opacity-60" />
			</button>
			<span class="text-2xl opacity-60 font-medium">Qual è il tuo ruolo?</span>
		</div>
		<div class="py-16 flex gap-16 justify-center">
			<div class="flex flex-col gap-4 items-center">
				<button
					on:click={() => handleChooseGuestType('guest')}
					class="bg-blue-100 p-10 flex items-center rounded-2xl fill-blue-500 active:fill-white active:bg-blue-500 transition-all"
				>
					<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
						<path
							d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
						/>
					</svg>
				</button>
				<span class="text-xl opacity-60 font-semibold">Ospite</span>
			</div>

			<div class="flex flex-col items-center gap-4">
				<button
					on:click={() => handleChooseGuestType('carrier')}
					class="bg-blue-100 p-10 flex items-center rounded-2xl"
				>
					<svg
						class="fill-blue-500"
						width="128"
						height="128"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 512"
					>
						<path
							d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
						/>
					</svg>
				</button>
				<span class="text-xl opacity-60 font-semibold">Trasportatore</span>
			</div>
		</div>
	</form>
</View>
