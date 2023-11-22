<script>
	import { onDestroy, onMount } from 'svelte';

	import QRCode from 'qrcode';

	import FilePreview from '../ui/FilePreview.svelte';
	import View from '../ui/View.svelte';
	import Signature from './Signature.svelte';

	import { DeviceId, Settings, ToastMessage } from '$lib/stores';
	import { getUid, signUpGuest, checkQrCode, saveQrCode } from '$lib/api';

	export let data = {};
	export let guestType = 'guest';
	export let show = false;

	let confirmed = false;
	let error = '';
	let fields = [];
	let index = 0;
	let selectedSuggestion = '';
	let signature = '';
	let isSignatureVisible = false;
	let suggestions = [];
	let value = '';
	let mode = 'qrcode';
	$: handleMode(mode);

	let checkQrCodeInterval = null;
	let isQrCodeLoaded = false;
	let image = null;

	const focusField = () => {
		const item = document.querySelector("[data-type='field']");
		if (item) item.focus();
	};

	const handleNext = () => {
		const field = fields[index];

		if (!value.trim() && field.required) {
			error = 'Campo obbligatorio';
			return;
		}

		if (!confirmed && field.confirm) {
			error = "Conferma l'avvenuta lettura";
			return;
		}

		const step = {
			confirmed,
			value: selectedSuggestion ? selectedSuggestion : value
		};

		data[field.name] = step;

		if (index === fields.length - 1) {
			isSignatureVisible = true;

			return;
		}

		index++;
		error = '';
		value = '';
		selectedSuggestion = '';
		suggestions = [];
		confirmed = false;

		focusField();
	};

	const handleBack = () => {
		if (index === 0) {
			show = false;
			return;
		}

		index--;

		const field = fields[index];

		if (!field) return;

		const step = data[field.name];

		value = field.type === 'search' ? step.value.split(';')[0] : step.value;

		selectedSuggestion = '';
		suggestions = [];
		confirmed = step.confirmed;

		focusField();
	};

	const handleInput = async (value) => {
		const field = fields[index];

		if (!field) return;

		if (field.type !== 'search') return;

		try {
			const res = await fetch(
				`https://timbratori.cedolino.net/${field.autocomplete}&q=${value}&deviceId=${$DeviceId}`
			);
			const json = await res.json();
			suggestions = json;

			console.log(suggestions);
		} catch (err) {
			console.log(err);
		}
	};

	const handleEnd = async (signature = '') => {
		if (!signature) return;

		console.log(data, signature);

		let values = {};
		Object.keys(data).forEach((key) => {
			const { value } = data[key];
			values[key] = value;
		});

		const guest = {
			...values,
			azi: $Settings.companyCode,
			vis_codice: !data.uid ? getUid() : data.uid,
			vis_firma: signature
		};

		const response = await signUpGuest(guest);

		if (response === 'OK') {
			$ToastMessage = {
				message: 'Entrata registrata correttamente',
				type: 'success',
				show: true
			};
		}

		signature = '';
		isSignatureVisible = false;
		show = false;
	};

	$: handleInput(value);

	$: handleEnd(signature);

	const filterFields = () => {
		let filteredFields = !data.uid
			? $Settings.guestFields
			: $Settings.guestFields.filter((item) => item.confirm);

		if (guestType === 'carrier') {
			filteredFields = filteredFields.filter((item) => item.carrier);
		}

		return filteredFields;
	};

	const handleLoadImage = () => (isQrCodeLoaded = image.complete);

	const handleDestroyQrCode = () => {
		console.log('destroyed');

		if (checkQrCodeInterval) clearInterval(checkQrCodeInterval);
		if (!image) return;

		image.removeEventListener('load', handleLoadImage);
	};

	const initializeQrCode = async (node) => {
		const guestUid = getUid();
		const companyCode = $Settings.companyCode;

		await saveQrCode(companyCode, guestUid);

		const url = `https://timbratori.cedolino.net/acc_visqrcode.asp?params=${companyCode};${guestUid};${guestType}`;

		const data = await QRCode.toDataURL(url, {
			color: {
				light: '#f5f5f7'
			}
		});

		image = node;
		image.src = data;
		image.addEventListener('load', handleLoadImage);

		checkQrCodeInterval = setInterval(async () => {
			const result = await checkQrCode(companyCode, guestUid);

			if (result === 'S' || result === 'F') {
				clearInterval(checkQrCodeInterval);
				show = false;
			}
		}, 3 * 1000);

		return {
			destroy() {
				handleDestroyQrCode();
			}
		};
	};

	const handleMode = (mode = '') => {
		if (mode === 'form') {
			handleDestroyQrCode();
		}
	};

	onMount(async () => {
		fields = filterFields();

		Settings.subscribe(() => {
			fields = filterFields();
		});

		//TODO unsubscribe
	});

	onDestroy(() => {
		handleDestroyQrCode();
	});
</script>

<View>
	{#if mode === 'qrcode'}
		<form class="flex flex-1 flex-col py-4 gap-8 w-full">
			<div class="absolute flex items-center gap-4">
				<button tabindex="-1" on:click={handleBack}>
					<i class="ri-arrow-left-line text-3xl opacity-60" />
				</button>
			</div>
			<div class="flex-1 flex flex-col px-48 gap-8 items-center justify-center">
				<span class="text-xl text-center">
					Scannerizza il codice QR e compila i dati per registrare l'ingresso dal tuo dispositivo
				</span>
				<div class="w-[200px] h-[200px] rounded-lg overflow-hidden">
					<img
						alt="qrcode"
						class:hidden={!isQrCodeLoaded}
						class="w-[200px] h-[200px]"
						use:initializeQrCode
					/>
				</div>
				<span class="text-lg opacity-60">oppure</span>
				<button
					on:click={() => (mode = 'form')}
					class="p-4 rounded-lg bg-blue-500 text-lg text-white font-semibold"
				>
					Compila i dati premendo qui
				</button>
			</div>
		</form>
	{:else if Object.keys(fields).length > 0}
		<form class="flex flex-1 flex-col py-4 gap-8 w-full">
			<div class="flex items-center gap-4">
				<button tabindex="-1" on:click={handleBack}>
					<i class="ri-arrow-left-line text-3xl opacity-60" />
				</button>
				<span class="text-3xl text-blue-500 font-semibold">
					{fields[index].title}
					{#if !fields[index].required && !fields[index].confirm}
						<span class="opacity-60 text-base font-regular text-black"
							>(campo non obbligatorio)</span
						>
					{/if}
				</span>
			</div>
			{#if fields[index].type === 'input' || fields[index].type === 'search' || fields[index].type === 'select'}
				<div class="relative">
					{#if fields[index].type === 'input' || fields[index].type === 'search'}
						<input
							data-type="field"
							bind:value
							class="text-2xl py-3 border-b border-gray-300 w-full"
							autofocus
							placeholder={fields[index].placeholder}
							type="text"
						/>
					{:else}
						<select bind:value class="text-2xl py-3 border-b border-gray-300 w-full">
							{#each fields[index].values as item}
								<option value={item.code}>{item.description}</option>
							{/each}
						</select>
					{/if}
					<div class="h-24 pt-10 flex gap-8 items-center">
						{#each suggestions as suggestion}
							<button
								on:click={() => {
									selectedSuggestion = suggestion.label;
									value = suggestion.value;

									handleNext();
								}}
								class="flex p-2 bg-gray-100 rounded-full items-center active:bg-blue-200 transition-all"
							>
								<img
									alt="profile"
									class="w-14 h-14 rounded-full object-cover"
									src="https://timbratori.cedolino.net/foto.asp?azi={suggestion.companyCode}&ndip={suggestion.employeeCode}&deviceId={$DeviceId}"
								/>
								<div class="flex flex-col items-start gap-1 whitespace-nowrap px-4">
									<span class="capitalize">{suggestion.value}</span>
									<span class="text-sm opacity-60">Staff</span>
								</div>
							</button>
						{/each}
					</div>
					{#if error}
						<div
							style="transform: translateX(-50%)"
							class="absolute top-[70px] left-[50%] p-4 bg-red-100 text-red-500 text-xl rounded-lg"
						>
							<div
								style="transform: translateX(-50%)"
								class="absolute top-[-12px] left-[50%] triangle"
							/>
							{error}
						</div>
					{/if}
					<div class="absolute right-0 bottom-0 flex justify-between">
						<button
							type="button"
							on:click={handleNext}
							class="w-16 h-16 bg-blue-500 text-white rounded-full text-2xl"
						>
							<i class="ri-arrow-right-line" />
						</button>
					</div>
				</div>
			{:else if fields[index].type === 'file'}
				<FilePreview file={fields[index]} />
				<div class="flex justify-between items-center">
					<label class="relative">
						{#if fields[index].confirm}
							<input bind:checked={confirmed} type="checkbox" />
							Conferma avvenuta lettura
						{/if}

						{#if error}
							<div
								style="transform: translateX(-50%)"
								class="absolute whitespace-nowrap text-center top-[40px] left-[50%] p-2 bg-red-100 text-red-500 text-lg rounded-lg"
							>
								<div
									style="transform: translateX(-50%)"
									class="absolute top-[-12px] left-[50%] triangle"
								/>
								{error}
							</div>
						{/if}
					</label>
					<button
						type="button"
						on:click={handleNext}
						class="w-16 h-16 bg-blue-500 text-white rounded-full text-2xl"
					>
						<i class="ri-arrow-right-line" />
					</button>
				</div>
			{/if}
		</form>
	{/if}
</View>

{#if isSignatureVisible}
	<Signature bind:signature {data} bind:show={isSignatureVisible} />
{/if}

<style>
	.triangle {
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 12px 12px 12px;
		border-color: transparent transparent #fee2e2 transparent;
	}
</style>
