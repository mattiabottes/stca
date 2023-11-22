<script>
	import { onMount } from 'svelte';

	import * as pdfjs from 'pdfjs-dist';
	pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.js', import.meta.url);

	import Spinner from './Spinner.svelte';

	let loading = true;
	let pdf = null;
	let pages = [];

	export let path = '';

	const renderPage = (canvas, index = 0) => {
		if (!canvas) return;
		if (!pdf) return;

		pdf.getPage(index).then((page) => {
			const viewport = page.getViewport({ scale: 1.2 });
			const outputScale = window.devicePixelRatio || 1;

			const context = canvas.getContext('2d');

			canvas.width = Math.floor(viewport.width * outputScale);
			canvas.height = Math.floor(viewport.height * outputScale);
			canvas.style.width = Math.floor(viewport.width) + 'px';
			canvas.style.height = Math.floor(viewport.height) + 'px';

			const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

			const renderContext = {
				canvasContext: context,
				transform: transform,
				viewport: viewport
			};
			page.render(renderContext);
		});
	};

	onMount(() => {
		if (!path) return;

		const task = pdfjs.getDocument(path);
		task.promise.then((e) => {
			pdf = e;
			pages = [];
			for (let i = 0; i < pdf._pdfInfo.numPages; i++) {
				pages = [...pages, i + 1];
			}

			loading = false;
		});
	});
</script>

{#if loading}
	<div class="w-full h-full flex items-center justify-center">
		<Spinner />
	</div>
{:else}
	<div class="relative w-full bg-gray-100 h-full overflow-auto">
		<div
			style="transform: translateX(-50%)"
			class="py-3 absolute top-0 left-[50%] flex flex-col gap-4"
		>
			{#each pages as page}
				<canvas use:renderPage={page} />
			{/each}
		</div>
	</div>
{/if}
