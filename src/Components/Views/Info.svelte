<script>
	import { onMount } from 'svelte';

	import { initializeApp } from 'firebase/app';
	import { getDatabase, ref, get, set } from 'firebase/database';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import firebaseConfig from '../../libs/firebaseConfig.json';

	import AppBar from '../AppBar.svelte';
	import AppBarButton from '../AppBarButton.svelte';
	import AppBarTitle from '../AppBarTitle.svelte';
	import AppBody from '../AppBody.svelte';
	import FabButton from '../FabButton.svelte';
	import InputGroup from '../InputGroup.svelte';
	import View from './View.svelte';
	import { NavigationStack, RunSection } from '../../libs/stores';
	import RunMenu from '../RunMenu.svelte';

	const app = initializeApp(firebaseConfig);
	const auth = getAuth();
	const database = getDatabase(app);

	export let race = '';
	export let type = '';
	export let eventId = '';
	export let runId = '';
	export let runName = '';
	let user = null;
	let info = {
		location: '',
		weather: '',
		temperature: '',
		terrain: '',
		streetConditions: ''
	};

	$: info && saveToFirebase();

	let showMenu = false;

	const saveToFirebase = () => {
		if (!user) return;

		const path = `${type}/${user.uid}/${eventId}/${runId}/info`;
		set(ref(database, path), info);
	};

	const dismissView = () => {
		$NavigationStack[$NavigationStack.length - 1]();
		$NavigationStack.pop();
	};

	onMount(() => {
		$NavigationStack.push(() => ($RunSection = ''));

		onAuthStateChanged(auth, async (res) => {
			user = res;

			if (user) {
				const path = `${type}/${user.uid}/${eventId}/${runId}/info`;

				const snapshot = await get(ref(database, path));
				if (snapshot.exists()) {
					const obj = snapshot.val();
					info = obj;
				}
			}
		});
	});
</script>

<View>
	<AppBar>
		<AppBarButton on:click={dismissView} icon="arrow-left-s" />
		<AppBarTitle title={race} subtitle={`${type.toUpperCase()} - ${runName}`} />
	</AppBar>
	<AppBody>
		<div class="text-lg font-medium mb-2">INFO</div>
		<InputGroup bind:value={info.location} title="Location" backgroundColor="blue" color="white" />
		<InputGroup bind:value={info.weather} title="Weather" backgroundColor="blue" color="white" />
		<InputGroup
			bind:value={info.temperature}
			title="Temperature"
			backgroundColor="blue"
			color="white"
		/>
		<InputGroup bind:value={info.fondo} title="Terrain" backgroundColor="blue" color="white" />
		<InputGroup
			bind:value={info.streetConditions}
			title="Street Conditions"
			backgroundColor="blue"
			color="white"
		/>

		<FabButton on:click={() => (showMenu = !showMenu)} icon="function" />

		{#if showMenu}
			<RunMenu />
		{/if}
	</AppBody>
</View>
