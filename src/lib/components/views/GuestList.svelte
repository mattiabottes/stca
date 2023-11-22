<script>
	import { onMount } from 'svelte';
	import View from '../ui/View.svelte';
	import { getGuestsFromServer, signOutGuest } from '$lib/api';
	import { Settings, ToastMessage } from '$lib/stores';
	import Spinner from '../ui/Spinner.svelte';
	import Signature from './Signature.svelte';

	let loading = true;
	let guestList = [];
	let guestFilteredList = [];
	let searchQuery = '';
	let isSignatureVisible = false;
	let signature = '';
	let guestData = {};

	$: filterGuests(searchQuery);
	$: handleSignOut(signature);

	export let show = false;

	onMount(async () => {
		guestList = await getGuestsFromServer($Settings.companyCode);
		guestFilteredList = guestList;

		loading = false;
	});

	const handleBack = () => {
		show = false;
	};

	const filterGuests = (q = '') => {
		if (!guestList) return;

		const list = guestList.map((item) => {
			return { ...item, query: `${item.vis_nome} ${item.vis_cognome}` };
		});

		guestFilteredList = list.filter(({ query }) =>
			query.toLowerCase().includes(searchQuery.toLowerCase())
		);
	};

	const showSignatureView = (guest) => {
		guestData = {
			codice: guest.codice,
			vis_nome: {
				value: guest.vis_nome
			},
			vis_cognome: {
				value: guest.vis_cognome
			}
		};

		isSignatureVisible = true;
	};

	const handleSignOut = async () => {
		if (!signature) return;

		const response = await signOutGuest($Settings.companyCode, guestData.codice, signature);

		if (response === 'OK') {
			$ToastMessage = {
				message: 'Uscita registrata correttamente',
				type: 'success',
				show: true
			};
		}

		signature = '';
		isSignatureVisible = false;
		show = false;
	};
</script>

<View>
	<form class="flex flex-1 flex-col py-4 gap-8 w-full">
		<div class="flex items-center gap-4">
			<button tabindex="-1" on:click={handleBack}>
				<i class="ri-arrow-left-line text-3xl opacity-60" />
			</button>
			<span class="text-2xl opacity-60 font-medium">Registra uscita</span>
		</div>
		<div class="flex flex-col gap-4">
			<div class="flex p-2 mx-4 items-center gap-3 bg-gray-100 rounded-lg">
				<i class="far fa-search opacity-40" />
				<input
					bind:value={searchQuery}
					type="text"
					class="w-full text-xl bg-transparent"
					placeholder="Cerca il tuo nominativo..."
				/>
			</div>
			<div class="flex-1 px-4 pt-2 flex flex-col overflow-auto">
				{#if loading}
					<div class="flex items-center justify-center p-20"><Spinner /></div>
				{:else if guestList.length === 0}
					<div class="p-4 text-center opacity-60">Nessun ospite registrato</div>
				{:else}
					{#each guestFilteredList as guest}
						<button
							on:click={() => showSignatureView(guest)}
							class="flex items-center gap-4 py-2 active:opacity-60 transition-opacity"
						>
							<div
								class="w-16 h-16 rounded-full bg-blue-50 text-blue-500 uppercase font-semibold text-2xl flex items-center justify-center"
							>
								{guest.vis_nome[0]}
							</div>
							<span class="text-xl capitalize">
								{guest.vis_nome.toLowerCase()}
								{guest.vis_cognome.toLowerCase()}
							</span>
						</button>
					{/each}
				{/if}
			</div>
		</div>
	</form>
</View>

{#if isSignatureVisible}
	<Signature bind:signature bind:show={isSignatureVisible} data={guestData} />
{/if}
