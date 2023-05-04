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
	import InputControl from '../InputControl.svelte';
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
	let setup = {
		springs: ['', ''],
		swaybars: ['', ''],
		height: ['', ''],
		dampers: ['', ''],
		lowSpeed: ['', ''],
		highSpeed: ['', ''],
		rebound: ['', ''],
		allignment: ['', ''],
		camber: ['', ''],
		differentials: ['', ''],
		gearbox: '',
		spare: '',
		miscellaneous: ''
	};

	$: setup && saveToFirebase();

	let showMenu = false;

	const saveToFirebase = () => {
		if (!user) return;

		const path = `${type}/${user.uid}/${eventId}/${runId}/setup`;
		set(ref(database, path), setup);
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
				const path = `${type}/${user.uid}/${eventId}/${runId}/setup`;

				const snapshot = await get(ref(database, path));
				if (snapshot.exists()) {
					const obj = snapshot.val();
					setup = obj;
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
		<div class="text-lg font-medium mb-2">SETUP</div>

		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">Springs</span>
			<div class="flex gap-4">
				<InputControl bind:value={setup.springs[0]} />
				<InputControl bind:value={setup.springs[1]} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">Swaybars</span>
			<div class="flex gap-4">
				<InputControl bind:value={setup.swaybars[0]} />
				<InputControl bind:value={setup.swaybars[1]} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">Height</span>
			<div class="flex gap-4">
				<InputControl bind:value={setup.height[0]} />
				<InputControl bind:value={setup.height[1]} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">Dampers</span>
			<div class="flex gap-4">
				<InputControl bind:value={setup.dampers[0]} />
				<InputControl bind:value={setup.dampers[1]} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">Low speed compression</span>
			<div class="flex gap-4">
				<InputControl bind:value={setup.lowSpeed[0]} />
				<InputControl bind:value={setup.lowSpeed[1]} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">High speed compression</span>
			<div class="flex gap-4">
				<InputControl bind:value={setup.highSpeed[0]} />
				<InputControl bind:value={setup.highSpeed[1]} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">Rebound</span>
			<div class="flex gap-4">
				<InputControl bind:value={setup.rebound[0]} />
				<InputControl bind:value={setup.rebound[1]} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">Allignment</span>
			<div class="flex gap-4">
				<InputControl bind:value={setup.allignment[0]} />
				<InputControl bind:value={setup.allignment[1]} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">Camber</span>
			<div class="flex gap-4">
				<InputControl bind:value={setup.camber[0]} />
				<InputControl bind:value={setup.camber[1]} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">Differentials</span>
			<div class="flex gap-4">
				<InputControl bind:value={setup.differentials[0]} />
				<InputControl bind:value={setup.differentials[1]} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">Gearbox</span>
			<div class="flex">
				<InputControl bind:value={setup.gearbox} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-4">
			<span class="text-sm opacity-60">Spare</span>
			<div class="flex">
				<InputControl bind:value={setup.spare} />
			</div>
		</div>
		<div class="flex flex-col gap-2 mb-20">
			<span class="text-sm opacity-60">Miscellaneous</span>
			<div class="flex">
				<InputControl bind:value={setup.miscellaneous} />
			</div>
		</div>

		<FabButton on:click={() => (showMenu = !showMenu)} icon="function" />

		{#if showMenu}
			<RunMenu />
		{/if}
	</AppBody>
</View>
