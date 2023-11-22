<script>
	import { onMount } from 'svelte';

	import { Preferences } from '@capacitor/preferences';
	import { Capacitor } from '@capacitor/core';
	import { StatusBar } from '@capacitor/status-bar';
	import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

	import Home from '../lib/components/views/Home.svelte';
	import Configure from '../lib/components/views/Configure.svelte';
	import { DeviceId, Settings, ToastMessage } from '$lib/stores';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { getSettingsFromServer } from '$lib/api';
	import Toast from '$lib/components/ui/Toast.svelte';

	let loading = true;
	let socket = null;

	const getDeviceId = async () => {
		const { value } = await Preferences.get({ key: 'deviceId' });
		return value ? value : '';
	};

	const updateSettings = async () => {
		const settings = await getSettingsFromServer($DeviceId);
		if (settings) $Settings = settings;

		return;
	};

	const downloadFile = async (file = '') => {
		if (!file) return;

		await Filesystem.downloadFile({
			url: `https://timbratori.cedolino.net/dwn_ospiti.asp?nomefile=${file}&deviceId=${$DeviceId}`,
			path: file,
			directory: Directory.Data
		});

		return true;
	};

	const handleMessage = async (e) => {
		if (!e.data) return;

		const { data } = e;

		try {
			const json = JSON.parse(data);
			const [from, message] = json;

			if (from === 'server') {
				if (message === 'settings') {
					updateSettings();
				}

				if (message === 'file') {
					await updateSettings();

					const file = json[2];

					downloadFile(file);
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	onMount(async () => {
		if (Capacitor.isNative) {
			window.screen.orientation.lock('landscape');
			StatusBar.hide();
		}

		$DeviceId = await getDeviceId();
		if ($DeviceId) {
			await updateSettings();

			if ($Settings.guestFields) {
				const files = $Settings.guestFields.filter((item) => item.type === 'file');

				for (const file of files) {
					await downloadFile(file.attachment);
				}
			}

			if (socket) {
				socket.close();
			}

			socket = new WebSocket(`wss://srv.cedolino.net:23808/${$DeviceId}`);
			socket.onmessage = handleMessage;
		}

		loading = false;
	});
</script>

{#if loading}
	<div class="w-full h-screen flex items-center justify-center">
		<Spinner />
	</div>
{:else if $DeviceId}
	<Home />
{:else if !$DeviceId}
	<Configure />
{/if}

{#if $ToastMessage.show}
	<p>prova</p>
	<Toast />
{/if}
