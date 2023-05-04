<script>
	import { onMount } from 'svelte';

	import { initializeApp } from 'firebase/app';
	import { getDatabase, ref, get } from 'firebase/database';
	import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
	import firebaseConfig from '../../libs/firebaseConfig.json';

	import AppBar from '../AppBar.svelte';
	import AppBarTitle from '../AppBarTitle.svelte';
	import AppBody from '../AppBody.svelte';
	import Button from '../Button.svelte';
	import FabButton from '../FabButton.svelte';
	import AddEvent from './AddEvent.svelte';

	import Spinner from '../Spinner.svelte';
	import { UserData } from '../../libs/stores';
	import Event from './Event.svelte';

	const app = initializeApp(firebaseConfig);
	const auth = getAuth();
	const database = getDatabase(app);

	const years = [0, 1, 2, 3, 4].map((item) => new Date().getFullYear() - item);

	let events = null;
	let selectedYear = new Date().getFullYear();
	let selectedEvent = {};
	let showAddEventView = false;
	let showEventView = false;

	const showEvent = (event = {}) => {
		selectedEvent = event;
		showEventView = true;
	};

	const fetchEvents = async () => {
		events = null;

		const snapshot = await get(ref(database, `events/${$UserData.uid}/${selectedYear}`));
		if (snapshot.exists()) {
			const obj = snapshot.val();

			events = [];
			for (const key of Object.keys(obj)) {
				events = [...events, { id: key, ...obj[key] }];
			}
			events = events.sort((a, b) => (a.date - b.date ? 1 : -1)); //sort by date
		} else {
			events = [];
		}
	};

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				$UserData = user;

				fetchEvents();
			}
		});
	});
</script>

<AppBar>
	<AppBarTitle title="Home" />
	<button class="w-10 h-10 bg-[#a7a7a9] rounded-full">
		<i class="ri-user-fill text-2xl" />
	</button>
</AppBar>
<AppBody>
	<select
		bind:value={selectedYear}
		on:change={fetchEvents}
		class="h-12 mb-4 bg-blue w-full px-2 text-base border border-white rounded-lg"
	>
		{#each years as year}
			<option value={year} selected={year === selectedYear}>{year}</option>
		{/each}
	</select>

	{#if !events}
		<div class="h-20 flex items-center justify-center">
			<Spinner />
		</div>
	{:else if events.length === 0}
		<span class="opacity-60">No data found.</span>
	{:else}
		{#each events as event}
			<Button on:click={() => showEvent(event)}>{event.race}</Button>
		{/each}
	{/if}

	<FabButton on:click={() => (showAddEventView = true)} icon="add" />

	{#if showAddEventView}
		<AddEvent year={selectedYear} bind:events bind:show={showAddEventView} />
	{/if}

	{#if showEventView}
		<Event bind:show={showEventView} {...selectedEvent} />
	{/if}
</AppBody>
