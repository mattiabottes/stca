<script>
	import SignaturePad from 'signature_pad/dist/signature_pad.umd';
	import Spinner from '../ui/Spinner.svelte';
	import View from '../ui/View.svelte';

	let width = 0;
	let height = 0;
	let signaturePad = null;

	export let loading = false;

	export let signature = '';
	export let show = false;
	export let data = {
		vis_nome: {
			value: 'Nome'
		},
		vis_cognome: {
			value: 'Cognome'
		}
	};

	const initializeSignature = (canvas) => {
		width = window.innerWidth - 48;
		height = window.innerHeight / 2 - 80;

		signaturePad = new SignaturePad(canvas);

		return {
			destroy() {
				if (!signaturePad) return;

				signaturePad.off();
			}
		};
	};

	const confirmSignature = () => {
		if (!signaturePad) return;

		signaturePad.off();

		loading = true;

		signature = signaturePad.toDataURL();

		//show = false;
	};
</script>

<View>
	<div class="w-full h-full justify-center flex flex-col gap-4">
		<div>
			<button disabled={loading} on:click={() => (show = false)}>
				<i class="ri-arrow-left-line text-3xl opacity-60" />
			</button>
		</div>
		<span class="font-semibold">
			{data['vis_nome'].value}
			{data['vis_cognome'].value},
		</span>
		<canvas
			id="signature-canvas"
			use:initializeSignature
			{width}
			{height}
			class="border-b border-gray-400"
		/>
		<span class="py-2 opacity-60 text-center">Firma qui sopra</span>
		<div class="flex justify-center gap-4 p-6">
			<button
				on:click={confirmSignature}
				disabled={loading}
				class:opacity-60={loading}
				class="flex items-center justify-center w-16 h-16 text-3xl bg-green-500 text-white rounded-full"
			>
				{#if loading}
					<Spinner color="#fff" size="sm" />
				{:else}
					<i class="ri-check-line" />
				{/if}
			</button>
			<button
				disabled={loading}
				class:opacity-60={loading}
				on:click={() => {
					signaturePad.clear();
				}}
				class="w-16 h-16 text-3xl bg-red-500 text-white rounded-full"
			>
				<i class="ri-close-line" />
			</button>
		</div>
	</div>
</View>
