<script>
	import { onMount } from 'svelte';

	import { initializeApp } from 'firebase/app';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import firebaseConfig from '../libs/firebaseConfig.json';

	import { App } from '@capacitor/app';
	import { StatusBar } from '@capacitor/status-bar';

	import MenuButton from '../Components/MenuButton.svelte';
	import AppBar from '../Components/AppBar.svelte';
	import AppBarTitle from '../Components/AppBarTitle.svelte';
	import AppBarButton from '../Components/AppBarButton.svelte';
	import AppBody from '../Components/AppBody.svelte';
	import Button from '../Components/Button.svelte';
	import Login from '../Components/Views/Login.svelte';
	import Home from '../Components/Views/Home.svelte';
	import Menu from '../Components/Menu.svelte';
	import { NavigationStack, UserData } from '../libs/stores';
	import Spinner from '../Components/Spinner.svelte';

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const auth = getAuth();

	let loaded = false;
	let showMenu = false;
	let logged = false;

	let showLoginView = false;

	const onBackButton = () => {
		if ($NavigationStack.length === 0) {
			$NavigationStack = [];
			App.minimizeApp();
		} else {
			$NavigationStack[$NavigationStack.length - 1]();
			$NavigationStack.pop();
		}
	};

	onMount(() => {
		StatusBar.setBackgroundColor({ color: '#020b44' });

		App.addListener('backButton', onBackButton);

		onAuthStateChanged(auth, async (user) => {
			logged = !!user;
			loaded = true;

			if (user) {
				$UserData = user;
			}
		});
	});
</script>

<main class="bg-blue h-screen">
	{#if loaded}
		{#if !logged}
			<div data-menu={showMenu}>
				<AppBar>
					<AppBarTitle title="Home" />
					<AppBarButton on:click={() => (showMenu = !showMenu)} icon="menu" />
				</AppBar>
				<AppBody>
					<Button on:click={() => (showLoginView = true)}>Sign in</Button>
				</AppBody>
			</div>

			<Menu active={!logged && showMenu}>
				<MenuButton title="About Us" />
				<MenuButton title="Tutorial" />
				<MenuButton title="Pricing" />
				<MenuButton title="Contacts" />
			</Menu>

			{#if showLoginView}
				<Login bind:logged bind:show={showLoginView} />
			{/if}
		{:else}
			<Home />
		{/if}
	{:else}
		<div class="w-full h-full bg-blue flex items-center justify-center">
			<Spinner />
		</div>
	{/if}
</main>

<style>
	:global(*) {
		-webkit-tap-highlight-color: rgba(
			0,
			0,
			0,
			0
		); /* make transparent link selection, adjust last value opacity 0 to 1.0 */
		box-sizing: border-box;
	}

	:global(*):focus {
		outline: 0;
	}

	:global(body) {
		-webkit-touch-callout: none; /* prevent callout to copy image, etc when tap to hold */
		-webkit-text-size-adjust: none; /* prevent webkit from resizing text to fit */
		-webkit-user-select: none; /* prevent copy paste, to allow, change 'none' to 'text' */
	}

	[data-menu] {
		transition: transform 150ms ease;
	}

	[data-menu='true'] {
		transform: translateX(-80%);
	}
</style>
