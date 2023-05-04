<script>
	import { onMount } from 'svelte';

	import { initializeApp } from 'firebase/app';
	import { getDatabase, ref, set } from 'firebase/database';
	import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
	import firebaseConfig from '../../libs/firebaseConfig.json';

	import AppBar from '../AppBar.svelte';
	import AppBarButton from '../AppBarButton.svelte';
	import AppBarTitle from '../AppBarTitle.svelte';
	import AppBody from '../AppBody.svelte';
	import View from './View.svelte';
	import Spinner from '../Spinner.svelte';
	import Button from '../Button.svelte';
	import { uuidv4 } from '../../libs/utils';
	import InputGroup from '../InputGroup.svelte';
	import { NavigationStack } from '../../libs/stores';

	const app = initializeApp(firebaseConfig);
	const auth = getAuth();
	const database = getDatabase(app);

	export let show = false;
	export let events = [];
	export let year = new Date().getFullYear();

	let car = '';
	let codriver = '';
	let race = '';
	let team = '';
	let user = null;
	let loading = false;

	const validateEvent = () => {
		if (car.trim() === '') return false;
		if (codriver.trim() === '') return false;
		if (race.trim() === '') return false;
		if (team.trim() === '') return false;

		return true;
	};

	const addEvent = async () => {
		if (!user) return;
		if (!validateEvent()) return;

		loading = true;

		const eventId = uuidv4();
		const date = new Date().getTime();
		const event = { id: eventId, car, codriver, race, team, date };

		await set(ref(database, `events/${user.uid}/${year}/${eventId}`), event);

		events = [...events, event];

		show = false;
	};

	const dismissView = () => {
		$NavigationStack[$NavigationStack.length - 1]();
		$NavigationStack.pop();
	};

	onMount(() => {
		$NavigationStack.push(() => (show = false));

		onAuthStateChanged(auth, async (res) => {
			user = res;
		});
	});
</script>

<View>
	<AppBar>
		<AppBarButton on:click={dismissView} icon="arrow-left-s" />
		<AppBarTitle title="Add Event" subtitle={year.toString()} />
	</AppBar>

	<AppBody>
		<InputGroup backgroundColor="blue" title="Rally car" bind:value={car} />
		<InputGroup backgroundColor="blue" title="Co Driver" bind:value={codriver} />
		<InputGroup backgroundColor="blue" title="Race" bind:value={race} />
		<InputGroup backgroundColor="blue" title="Team" bind:value={team} />
		<div class="mt-8">
			{#if !loading}
				<button
					on:click={addEvent}
					class="h-12 w-full rounded-lg border-2 border-aqua text-white active:bg-aqua active:text-blue transition-all"
				>
					Add Event
				</button>
			{:else}
				<Button border={false} backgroundColor="aqua" color="blue">
					<Spinner color="blue" size="md" />
				</Button>
			{/if}
		</div>
	</AppBody>
</View>
