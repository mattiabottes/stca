<script>
	import { onMount } from 'svelte';

	import { getDateTime } from '../lib/datetime';
	import Clock from '../lib/components/ui/Clock.svelte';
	import { FormattedDate } from '../lib/stores';
	import { sendNFC } from '$lib/api';

	let isBusy = false;
	let nfcId = '';

	const toHexString = (byteArray) => {
		return Array.from(byteArray, (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2))
			.join('')
			.toUpperCase();
	};

	const handleNFCDiscovery = async (e) => {
		if (isBusy) {
			return;
		}

		isBusy = true;
		nfcId = toHexString(e.tag.id);

		const res = await sendNFC(nfcId);

		console.log('nfc: ', nfcId);
		console.log('res: ', res);

		isBusy = false;
	};

	onMount(() => {
		getDateTime();

		if (window.cordova && window.nfc) {
			nfc.addTagDiscoveredListener(handleNFCDiscovery, null, function () {
				console.log('errore');
			});
		}
	});
</script>

<main class="relative flex flex-col h-screen w-full overflow-hidden">
	<div class="flex flex-col gap-3 items-center justify-center flex-1">
		<div class="text-lg text-center opacity-60">
			<i class="fa fa-map-marker" />
			{$FormattedDate}
		</div>
		<span class="flex justify-center font-semibold text-8xl text-blue-500">
			<Clock />
		</span>
	</div>
	<div class="flex flex-col justify-end flex-[1.5]">
		<div class="flex flex-col items-center justify-center py-3">
			<span class="text-lg opacity-60">Avvicina la tessera</span>
			<i class="far fa-chevron-down animate-slide text-blue-500 text-8xl" />
		</div>
	</div>

	<div
		class="circles absolute bottom-[-50px] left-[50%] transform-translate-x[-50%] z-[-1] opacity-50"
	>
		<div
			class="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-[1000px] h-[1000px] rounded-full bg-blue-50"
		/>

		<div
			class="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-[600px] h-[600px] rounded-full bg-blue-100"
		/>

		<div
			class="absolute circle-sm top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-[300px] h-[300px] rounded-full bg-blue-200 opacity-[0.75]"
		/>
	</div>
</main>

<style>
	.animate-slide {
		opacity: 0.7;
		animation: slideAnimation 2s ease infinite;
		transform: translateZ(0);
	}

	@keyframes slideAnimation {
		50% {
			transform: translateY(20px);
			opacity: 0.9;
		}
	}
</style>
