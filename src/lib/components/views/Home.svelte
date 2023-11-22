<script>
	import QrCodeMask from '../ui/QRCodeMask.svelte';
	import GuestData from './GuestData.svelte';

	import { BarcodeScanner, BarcodeFormat, LensFacing } from '@capacitor-mlkit/barcode-scanning';
	import { Capacitor } from '@capacitor/core';
	import { getGuestDataByUid, signOutGuest } from '$lib/api';
	import { Settings, ToastMessage } from '$lib/stores';
	import ChooseGuestType from './ChooseGuestType.svelte';
	import GuestList from './GuestList.svelte';
	import Signature from './Signature.svelte';

	let isGuestDataVisible = false;
	$: hasViewShown(isGuestDataVisible);

	let isChooseGuestTypeVisible = false;

	let isGuestListVisible = false;
	$: hasViewShown(isGuestListVisible);

	let isSignatureVisible = false;
	$: hasViewShown(isSignatureVisible);

	let scanned = false;
	let scanStarted = false;
	let guestData = {};
	let guestType = 'guest';
	let signature = '';
	$: handleSignOut(signature);

	const hasViewShown = (shown = false) => {
		if (!shown && scanStarted) return;

		!shown ? startScan() : stopScan();

		if (!shown) guestData = {};
	};

	const handleScan = async (event) => {
		if (scanned) return;

		scanned = true;

		const uid = event.barcode.rawValue;
		const result = await checkGuestData(uid);
		if (result) stopScan();

		scanned = false;
	};

	const startScan = async () => {
		console.log('start scan...');

		scanStarted = true;

		if (!Capacitor.isNative) {
			return;
		}

		document.querySelector('body')?.classList.add('barcode-scanner-active');

		let result = await checkPermissions();
		if (result !== 'granted') result = await requestPermissions();
		if (result !== 'granted') {
			document.querySelector('body')?.classList.remove('barcode-scanner-active');
			return;
		}

		await BarcodeScanner.startScan({ lensFacing: LensFacing.Front, formats: BarcodeFormat.QrCode });
		await BarcodeScanner.addListener('barcodeScanned', handleScan);
	};

	const stopScan = async () => {
		console.log('stop scan...');

		scanStarted = false;

		if (!Capacitor.isNative) {
			return;
		}

		document.querySelector('body')?.classList.remove('barcode-scanner-active');

		await BarcodeScanner.removeAllListeners();
		await BarcodeScanner.stopScan();
	};

	const checkPermissions = async () => {
		const { camera } = await BarcodeScanner.checkPermissions();
		return camera;
	};

	const requestPermissions = async () => {
		const { camera } = await BarcodeScanner.requestPermissions();
		return camera;
	};

	const checkGuestData = async (uid = '') => {
		const response = await getGuestDataByUid($Settings.companyCode, uid);

		if (!response) return false;
		if (response.result === 'KO') return false;

		guestData = {
			uid,
			vis_nome: {
				value: response.name
			},
			vis_cognome: {
				value: response.lastname
			}
		};

		if (!response.signin) {
			isGuestDataVisible = true;
			return;
		}

		//TODO: open signature view
		isSignatureVisible = true;

		return true;
	};

	const showGuestData = () => {
		if ($Settings.carrier) {
			isChooseGuestTypeVisible = true;
		} else {
			isGuestDataVisible = true;
		}
	};

	const handleSignOut = async () => {
		if (!signature) return;

		const response = await signOutGuest($Settings.companyCode, guestData.uid, signature);

		if (response === 'OK') {
			$ToastMessage = {
				message: 'Uscita registrata correttamente',
				type: 'success',
				show: true
			};
		}

		signature = '';
		isSignatureVisible = false;
	};

	const handleChooseGuestType = (type) => {
		guestType = type;

		isChooseGuestTypeVisible = false;
		isGuestDataVisible = true;
	};
</script>

<div data-target="barcode" class="absolute top-0 left-0 bg-gray-800 w-full h-screen z-[-1]" />
<div
	data-target="barcode"
	style="background: linear-gradient(transparent, #000)"
	class="absolute bottom-0 left-0 w-full h-[66%] z-[-1]"
/>
<div
	data-target="barcode"
	class="flex w-full h-screen text-white items-center justify-center flex-col gap-16"
>
	<div class="flex flex-col gap-12 items-center justify-center">
		<QrCodeMask />
		<span class="text-2xl font-semibold">Scansiona il codice che hai ricevuto</span>
	</div>
	<span class="text-xl opacity-60">oppure</span>
	<div class="flex gap-8">
		<button on:click={showGuestData} class="p-4 bg-green-500 text-xl font-semibold rounded-2xl">
			Registra entrata
		</button>
		<button
			on:click={() => (isGuestListVisible = true)}
			class="p-6 bg-red-500 text-xl font-semibold rounded-2xl">Registra uscita</button
		>
	</div>
</div>

{#if isChooseGuestTypeVisible}
	<ChooseGuestType {handleChooseGuestType} bind:show={isChooseGuestTypeVisible} />
{/if}

{#if isGuestDataVisible}
	<GuestData {guestType} data={guestData} bind:show={isGuestDataVisible} />
{/if}

{#if isGuestListVisible}
	<GuestList bind:show={isGuestListVisible} />
{/if}

{#if isSignatureVisible}
	<Signature bind:signature data={guestData} bind:show={isSignatureVisible} />
{/if}
