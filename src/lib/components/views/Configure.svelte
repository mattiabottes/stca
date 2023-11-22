<script>
	import { Preferences } from '@capacitor/preferences';

	import { DeviceId } from '$lib/stores';
	import { getSettingsFromServer } from '../../api';
	import Spinner from '../ui/Spinner.svelte';

	let value = '';

	let loading = false;
	let title = 'Ciao, configura il dispositivo';

	const handleChange = async () => {
		//02392607-27FE-4FF3-B5A2-159F3DE24203

		if (value.length === 36) {
			title = 'Ricerca impostazioni in corso...';
			loading = true;

			const settings = await getSettingsFromServer(value);

			loading = false;

			if (!settings) {
				title = 'Codice univoco errato, riprova';
			} else {
				console.log(settings);

				await Preferences.set({
					key: 'deviceId',
					value
				});

				$DeviceId = value;
			}
		}
	};
</script>

<div class="w-full h-screen flex items-center justify-center flex-col gap-8">
	<span class="text-blue-500 text-3xl font-semibold">
		{title}
	</span>
	<div class="flex flex-row h-8 justify-center items-center">
		{#if loading}
			<Spinner size="sm" color="gray" />
		{:else}
			<input
				bind:value
				on:input={handleChange}
				class="flex flex-1 text-lg py-2 text-center w-[400px]"
				type="text"
				placeholder="Inserisci il codice univoco del dispositivo toccando qui"
			/>
		{/if}
	</div>
</div>
