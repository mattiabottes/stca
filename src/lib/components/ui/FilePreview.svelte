<script>
	import { DeviceId } from '$lib/stores';
	import { Directory, Filesystem } from '@capacitor/filesystem';
	import { Capacitor } from '@capacitor/core';
	import Spinner from './Spinner.svelte';
	import PdfViewer from './PDFViewer.svelte';

	export let file = { attachment: '' };
	let contentType = '';
	let filePath = '';

	let loading = true;

	const getContentType = (extension = '') => {
		// Crea un oggetto con le estensioni e i relativi mime type
		const extensions = {
			jpg: 'image/jpeg',
			png: 'image/png',
			gif: 'image/gif',
			mp4: 'video/mp4',
			webm: 'video/webm',
			mp3: 'audio/mpeg',
			wav: 'audio/wav',
			txt: 'text/plain',
			pdf: 'application/pdf',
			docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
		};

		// Controlla se l'estensione è presente nell'oggetto
		return extensions[extension.toLowerCase()];
	};

	const getFileExtension = (path = '') => {
		return path.split('.').slice(-1)[0];
	};

	const handleLoaded = () => {
		loading = false;
	};

	const loadFile = async () => {
		if (filePath.includes(file.attachment)) {
			return;
		}

		loading = true;

		if (!file) return;
		if (!file.attachment) return;

		if (!Capacitor.isNative) {
			filePath = `https://timbratori.cedolino.net/dwn_ospiti.asp?nomefile=${file.attachment}&deviceId=${$DeviceId}`;
		} else {
			try {
				const { uri } = await Filesystem.getUri({
					path: file.attachment,
					directory: Directory.Data
				});

				filePath = Capacitor.convertFileSrc(uri);
			} catch (err) {
				filePath = `https://timbratori.cedolino.net/dwn_ospiti.asp?nomefile=${file.attachment}&deviceId=${$DeviceId}`;
			}
		}

		const extension = getFileExtension(file.attachment);
		contentType = getContentType(extension);
	};

	$: loadFile(file);
</script>

<div class="flex-1 relative overflow-hidden">
	{#if contentType.includes('pdf')}
		<div class="w-full h-full max-h-[calc(100vh-272px)]">
			<PdfViewer path={filePath} />
		</div>
		<!-- svelte-ignore a11y-missing-attribute -->
	{:else if contentType.includes('image') || contentType.includes('video')}
		<div class="relative w-full h-full flex items-center justify-center">
			{#if contentType.includes('image')}
				<img
					on:load={handleLoaded}
					class:hidden={loading}
					class="absolute top-0 left-0 w-full h-full object-contain"
					src={filePath}
					alt="allegato"
				/>
			{:else}
				<!-- svelte-ignore a11y-media-has-caption -->
				<video
					on:loadeddata={handleLoaded}
					class:hidden={loading}
					autoplay
					loop
					class="absolute top-0 left-0 w-full h-full object-contain"
					src={filePath}
				/>
			{/if}
			{#if loading}
				<Spinner />
			{/if}
		</div>
	{:else}
		<p>Formato non supportato</p>
	{/if}
</div>
