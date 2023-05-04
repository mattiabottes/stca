<script>
	import { initializeApp } from 'firebase/app';
	import { getDatabase, ref, get, set } from 'firebase/database';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import firebaseConfig from '../../libs/firebaseConfig.json';

	import AppBar from '../AppBar.svelte';
	import AppBarButton from '../AppBarButton.svelte';
	import AppBarTitle from '../AppBarTitle.svelte';
	import AppBody from '../AppBody.svelte';
	import View from './View.svelte';
	import { onMount } from 'svelte';
	import { uuidv4 } from '../../libs/utils';
	import Button from '../Button.svelte';
	import Run from './Run.svelte';
	import { NavigationStack } from '../../libs/stores';

	const app = initializeApp(firebaseConfig);
	const auth = getAuth();
	const database = getDatabase(app);

	export let car = '';
	export let race = '';
	export let codriver = '';
	export let team = '';
	export let type = 'test';
	export let eventId = '';
	export let show = false;
	export let runId = '';
	export let runName = '';

	let user = null;
	let runs = [];
	let showRunView = false;

	const showRun = (run) => {
		runId = run.id;
		runName = run.name;

		showRunView = true;
	};

	const dismissView = () => {
		$NavigationStack[$NavigationStack.length - 1]();
		$NavigationStack.pop();
	};

	onMount(() => {
		$NavigationStack.push(() => (show = false));

		onAuthStateChanged(auth, async (res) => {
			user = res;

			if (user) {
				const snapshot = await get(ref(database, `${type}/${user.uid}/${eventId}`));
				if (snapshot.exists()) {
					const obj = snapshot.val();

					for (const key of Object.keys(obj)) {
						runs = [...runs, { ...obj[key] }];
					}
				} else {
					const runId = uuidv4();
					const run = {
						id: runId,
						index: 0,
						name: 'Run 1'
					};

					runs = [...runs, run];

					set(ref(database, `${type}/${user.uid}/${eventId}/${runId}`), run);
				}
			}
		});
	});
</script>

<View>
	<AppBar>
		<AppBarButton on:click={dismissView} icon="arrow-left-s" />
		<AppBarTitle title={race} subtitle={type.toUpperCase()} />
	</AppBar>

	<AppBody margin={false}>
		<div class="flex h-full flex-col">
			<div class="flex-1 p-4">
				{#each runs as run}
					<Button on:click={() => showRun(run)}>{run.name}</Button>
				{/each}
				<Button border={false} backgroundColor="lightblue">
					<i class="ri-add-line text-aqua text-2xs" />
				</Button>
			</div>
			<div class="bg-aqua flex flex-col gap-4 p-6 rounded-t-[30px]">
				<div class="flex gap-4">
					<span
						class="flex-1 whitespace-nowrap overflow-hidden bg-lightaqua text-blue text-ellipsis text-sm flex items-center justify-center rounded-md py-1"
					>
						{car}
					</span>
					<span
						class="flex-1 whitespace-nowrap overflow-hidden bg-lightaqua text-blue text-ellipsis text-sm flex items-center justify-center rounded-md py-1"
					>
						{codriver}
					</span>
				</div>
				<div class="flex gap-4">
					<span
						class="flex-1 whitespace-nowrap overflow-hidden bg-lightaqua text-blue text-ellipsis text-sm flex items-center justify-center rounded-md py-1"
					>
						{team}
					</span>
					<span
						class="flex-1 whitespace-nowrap overflow-hidden bg-lightaqua text-blue text-ellipsis text-sm flex items-center justify-center rounded-md py-1"
					>
						{race}
					</span>
				</div>
			</div>
		</div>
	</AppBody>
</View>

{#if showRunView}
	<Run bind:show={showRunView} {eventId} {car} {race} {codriver} {team} {type} {runId} {runName} />
{/if}
