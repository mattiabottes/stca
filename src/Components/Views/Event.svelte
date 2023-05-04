<script>
	import { onMount } from 'svelte';
	import AppBar from '../AppBar.svelte';
	import AppBarButton from '../AppBarButton.svelte';
	import AppBarTitle from '../AppBarTitle.svelte';
	import AppBody from '../AppBody.svelte';
	import Button from '../Button.svelte';
	import Runs from './Runs.svelte';
	import View from './View.svelte';
	import { NavigationStack } from '../../libs/stores';

	export let show = false;
	export let id = '';
	export let car = '';
	export let codriver = '';
	export let team = '';
	export let race = '';

	let showRunsView = false;
	let selectedType = '';

	const showRuns = (type = '') => {
		selectedType = type;
		showRunsView = true;
	};

	const dismissView = () => {
		$NavigationStack[$NavigationStack.length - 1]();
		$NavigationStack.pop();
	};

	onMount(() => {
		$NavigationStack.push(() => (show = false));
	});
</script>

<View>
	<AppBar>
		<AppBarButton on:click={dismissView} icon="arrow-left-s" />
		<AppBarTitle title={race} />
	</AppBar>
	<AppBody margin={false}>
		<div class="flex h-full flex-col">
			<div class="flex-1 py-2 px-4">
				<Button on:click={() => showRuns('test')}>TEST</Button>
				<Button on:click={() => showRuns('shakedown')}>SHAKEDOWN</Button>
				<Button on:click={() => showRuns('race')}>RACE</Button>
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
				<!-- <button class="mt-2" on:click={() => (show = false)}>
					<i class="ri-home-fill text-blue text-3xl active:opacity-60 transition-all" />
				</button> -->
			</div>
		</div>
	</AppBody>
</View>

{#if showRunsView}
	<Runs bind:show={showRunsView} type={selectedType} {car} {codriver} {race} {team} eventId={id} />
{/if}
