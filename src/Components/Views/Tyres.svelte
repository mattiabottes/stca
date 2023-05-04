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
	import InputGroup from '../InputGroup.svelte';
	import View from './View.svelte';
	import FabButton from '../FabButton.svelte';
	import RunMenu from '../RunMenu.svelte';
	import { NavigationStack, RunSection } from '../../libs/stores';

	const app = initializeApp(firebaseConfig);
	const auth = getAuth();
	const database = getDatabase(app);

	export let race = '';
	export let type = '';
	export let eventId = '';
	export let runId = '';
	export let runName = '';

	let editValue = false;

	let startDate = '';
	let finishDate = '';

	let startSettings = {
		front: {
			compound: {
				L: '',
				R: ''
			},
			temperature: {
				L: '',
				R: ''
			},
			pressure: {
				L: '',
				R: ''
			}
		},
		rear: {
			compound: {
				L: '',
				R: ''
			},
			temperature: {
				L: '',
				R: ''
			},
			pressure: {
				L: '',
				R: ''
			}
		}
	};

	let finishSettings = {
		front: {
			compound: {
				L: '',
				R: ''
			},
			temperature: {
				L: '',
				R: ''
			},
			pressure: {
				L: '',
				R: ''
			}
		},
		rear: {
			compound: {
				L: '',
				R: ''
			},
			temperature: {
				L: '',
				R: ''
			},
			pressure: {
				L: '',
				R: ''
			}
		}
	};

	let settingValue = '';
	let selectedSetting = [];
	let user = null;

	let showMenu = false;

	const getValue = (settings, y, x, direction) => {
		const value =
			settings === 'start' ? startSettings[y][x][direction] : finishSettings[y][x][direction];

		return value;
	};

	const focusInput = (id = '') => {
		const input = document.getElementById(id);
		if (input) {
			input.focus();
		}
	};

	const showEditValueInput = (settings = 'start', y = 'front', x = 'compound', direction = 'L') => {
		selectedSetting = [settings, y, x, direction];

		settingValue = getValue(settings, y, x, direction);
		focusInput('editValueInput');

		editValue = true;
	};

	const applyEdit = () => {
		const [settings, y, x, direction] = selectedSetting;

		if (settings === 'start') {
			startSettings[y][x][direction] = settingValue;
		} else {
			finishSettings[y][x][direction] = settingValue;
		}

		saveToFirebase();

		editValue = false;
	};

	const initEditValue = (node) => {
		const [settings, y, x, direction] = selectedSetting;

		node.focus();
		focusInput(node.id);
	};

	const saveToFirebase = () => {
		if (!user) return;

		const data = {
			startDate,
			finishDate,
			startSettings,
			finishSettings
		};

		const path = `${type}/${user.uid}/${eventId}/${runId}/tyres`;

		set(ref(database, path), data);
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
				const path = `${type}/${user.uid}/${eventId}/${runId}/tyres`;

				const snapshot = await get(ref(database, path));
				if (snapshot.exists()) {
					const obj = snapshot.val();
					console.log(obj);

					startDate = obj.startDate;
					finishDate = obj.finishDate;
					startSettings = obj.startSettings;
					finishSettings = obj.finishSettings;
				}
			}
		});
	});
</script>

<View>
	<AppBar>
		<AppBarButton on:click={dismissView} icon="arrow-left-s" />
		<AppBarTitle title={race} subtitle="{type.toUpperCase()} - {runName}" />
	</AppBar>
	<AppBody>
		<div class="text-lg font-medium mb-2">TYRES</div>
		<InputGroup
			backgroundColor="blue"
			color="white"
			title="Start"
			type="date"
			bind:value={startDate}
			on:change={saveToFirebase}
		/>
		<div class="relative my-8 mx-4 flex flex-col gap-2 mb-12">
			<div
				style="left: 50%; transform: translateX(-50%); width: 1px"
				class="absolute bg-aqua h-full"
			/>
			<div
				style="top: 50%; transform: translateY(-50%); height: 1px"
				class="absolute bg-aqua w-full"
			/>
			<div
				style="left: 50%; transform: translateX(-50%); top: -20px"
				class="absolute text-aqua text-xs"
			>
				FRONT
			</div>
			<div
				style="top: 50%; transform: translateY(-50%); left: -28px"
				class="absolute text-aqua text-xs"
			>
				LEFT
			</div>
			<div
				style="left: 50%; transform: translateX(-50%); bottom: -20px"
				class="absolute text-aqua text-xs"
			>
				REAR
			</div>
			<div
				style="top: 50%; transform: translateY(-50%); right: -28px"
				class="absolute text-aqua text-xs"
			>
				RIGHT
			</div>
			<div class="flex gap-4">
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Compound</span>
						<div
							on:click={() => showEditValueInput('start', 'front', 'compound', 'L')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.front.compound.L}
						</div>
					</div>
				</div>
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Compound</span>
						<div
							on:click={() => showEditValueInput('start', 'front', 'compound', 'R')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.front.compound.R}
						</div>
					</div>
				</div>
			</div>
			<div class="flex gap-4">
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Temperature</span>
						<div
							on:click={() => showEditValueInput('start', 'front', 'temperature', 'L')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.front.temperature.L}
						</div>
					</div>
				</div>
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Temperature</span>
						<div
							on:click={() => showEditValueInput('start', 'front', 'temperature', 'R')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.front.temperature.R}
						</div>
					</div>
				</div>
			</div>
			<div class="flex gap-4 pb-8">
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Pressure</span>
						<div
							on:click={() => showEditValueInput('start', 'front', 'pressure', 'L')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.front.pressure.L}
						</div>
					</div>
				</div>
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Pressure</span>
						<div
							on:click={() => showEditValueInput('start', 'front', 'pressure', 'R')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.front.pressure.R}
						</div>
					</div>
				</div>
			</div>
			<div class="flex gap-4">
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Compound</span>
						<div
							on:click={() => showEditValueInput('start', 'rear', 'compound', 'L')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.rear.compound.L}
						</div>
					</div>
				</div>
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Compound</span>
						<div
							on:click={() => showEditValueInput('start', 'rear', 'compound', 'R')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.rear.compound.R}
						</div>
					</div>
				</div>
			</div>
			<div class="flex gap-4">
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Temperature</span>
						<div
							on:click={() => showEditValueInput('start', 'rear', 'temperature', 'L')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.rear.temperature.L}
						</div>
					</div>
				</div>
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Temperature</span>
						<div
							on:click={() => showEditValueInput('start', 'rear', 'temperature', 'R')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.rear.temperature.R}
						</div>
					</div>
				</div>
			</div>
			<div class="flex gap-4 pb-4">
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Pressure</span>
						<div
							on:click={() => showEditValueInput('start', 'rear', 'pressure', 'L')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.rear.pressure.L}
						</div>
					</div>
				</div>
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Pressure</span>
						<div
							on:click={() => showEditValueInput('start', 'rear', 'pressure', 'R')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{startSettings.rear.pressure.R}
						</div>
					</div>
				</div>
			</div>
		</div>
		<InputGroup
			backgroundColor="blue"
			color="white"
			title="Finish"
			type="date"
			bind:value={finishDate}
			on:change={saveToFirebase}
		/>
		<div class="relative my-8 mx-4 flex flex-col gap-2">
			<div
				style="left: 50%; transform: translateX(-50%); width: 1px"
				class="absolute bg-aqua h-full"
			/>
			<div
				style="top: 50%; transform: translateY(-50%); height: 1px"
				class="absolute bg-aqua w-full"
			/>
			<div
				style="left: 50%; transform: translateX(-50%); top: -20px"
				class="absolute text-aqua text-xs"
			>
				FRONT
			</div>
			<div
				style="top: 50%; transform: translateY(-50%); left: -28px"
				class="absolute text-aqua text-xs"
			>
				LEFT
			</div>
			<div
				style="left: 50%; transform: translateX(-50%); bottom: -20px"
				class="absolute text-aqua text-xs"
			>
				REAR
			</div>
			<div
				style="top: 50%; transform: translateY(-50%); right: -28px"
				class="absolute text-aqua text-xs"
			>
				RIGHT
			</div>
			<div class="flex gap-4">
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Temperature</span>
						<div
							on:click={() => showEditValueInput('finish', 'front', 'temperature', 'L')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{finishSettings.front.temperature.L}
						</div>
					</div>
				</div>
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Temperature</span>
						<div
							on:click={() => showEditValueInput('finish', 'front', 'temperature', 'R')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{finishSettings.front.temperature.R}
						</div>
					</div>
				</div>
			</div>
			<div class="flex gap-4 pb-8">
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Pressure</span>
						<div
							on:click={() => showEditValueInput('finish', 'front', 'pressure', 'L')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{finishSettings.front.pressure.L}
						</div>
					</div>
				</div>
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Pressure</span>
						<div
							on:click={() => showEditValueInput('finish', 'front', 'pressure', 'R')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{finishSettings.front.pressure.R}
						</div>
					</div>
				</div>
			</div>
			<div class="flex gap-4">
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Temperature</span>
						<div
							on:click={() => showEditValueInput('finish', 'rear', 'temperature', 'L')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{finishSettings.rear.temperature.L}
						</div>
					</div>
				</div>
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Temperature</span>
						<div
							on:click={() => showEditValueInput('finish', 'rear', 'temperature', 'R')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{finishSettings.rear.temperature.R}
						</div>
					</div>
				</div>
			</div>
			<div class="flex gap-4 pb-4">
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Pressure</span>
						<div
							on:click={() => showEditValueInput('finish', 'rear', 'pressure', 'L')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{finishSettings.rear.pressure.L}
						</div>
					</div>
				</div>
				<div class="flex-1">
					<div class="flex flex-col gap-2">
						<span class="text-sm opacity-60">Pressure</span>
						<div
							on:click={() => showEditValueInput('finish', 'rear', 'pressure', 'R')}
							class="w-full border border-white rounded-lg p-2 h-10"
						>
							{finishSettings.rear.pressure.R}
						</div>
					</div>
				</div>
			</div>
		</div>

		<FabButton on:click={() => (showMenu = !showMenu)} icon="function" />

		{#if showMenu}
			<RunMenu />
		{/if}
	</AppBody>
</View>

{#if editValue}
	<div class="flex flex-col fixed left-0 z-[99999] bottom-0 h-full w-full">
		<div on:click={() => (editValue = false)} class="flex-1" />
		<div class="flex h-14 w-full bg-lightblue p-2">
			<input
				id="editValueInput"
				bind:value={settingValue}
				use:initEditValue
				type="text"
				class="bg-transparent text-white h-full w-full"
			/>
			<button on:click={applyEdit} class="w-10 h-10 text-xl flex items-center justify-center">
				<i class="ri-check-line" />
			</button>
		</div>
	</div>
{/if}
