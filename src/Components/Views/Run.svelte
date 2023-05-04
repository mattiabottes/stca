<script>
	import { onMount } from 'svelte';
	import { NavigationStack, RunSection } from '../../libs/stores';
	import AppBar from '../AppBar.svelte';
	import AppBarButton from '../AppBarButton.svelte';
	import AppBarTitle from '../AppBarTitle.svelte';
	import AppBody from '../AppBody.svelte';
	import Button from '../Button.svelte';
	import Impressions from './Impressions.svelte';
	import Info from './Info.svelte';
	import Setup from './Setup.svelte';
	import Tyres from './Tyres.svelte';
	import View from './View.svelte';

	export let car = '';
	export let race = '';
	export let codriver = '';
	export let team = '';
	export let type = '';
	export let eventId = '';
	export let runId = '';
	export let runName = '';
	export let show = false;

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
		<AppBarTitle title={race} subtitle="{type.toUpperCase()} - {runName}" />
	</AppBar>
	<AppBody margin={false}>
		<div class="flex h-full flex-col">
			<div class="flex-1 p-4">
				<Button on:click={() => ($RunSection = 'tyres')}>Tyres</Button>
				<Button on:click={() => ($RunSection = 'setup')}>Setup</Button>
				<Button on:click={() => ($RunSection = 'impressions')}>Impressions</Button>
				<Button on:click={() => ($RunSection = 'info')}>Info</Button>
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

{#if $RunSection === 'tyres'}
	<Tyres {eventId} {race} {type} {runId} {runName} />
{/if}

{#if $RunSection === 'setup'}
	<Setup {eventId} {race} {type} {runId} {runName} />
{/if}

{#if $RunSection === 'impressions'}
	<Impressions {eventId} {race} {type} {runId} {runName} />
{/if}

{#if $RunSection === 'info'}
	<Info {eventId} {race} {type} {runId} {runName} />
{/if}
