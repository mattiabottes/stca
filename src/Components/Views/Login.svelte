<script>
	import { initializeApp } from 'firebase/app';
	import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
	import firebaseConfig from '../../libs/firebaseConfig.json';

	initializeApp(firebaseConfig);
	const auth = getAuth();

	import AppBar from '../AppBar.svelte';
	import AppBody from '../AppBody.svelte';
	import Button from '../Button.svelte';
	import CreateAccount from './CreateAccount.svelte';
	import View from './View.svelte';

	export let show = false;
	export let logged = false;

	let email = '';
	let password = '';
	let showCreateAccountView = false;

	const login = () => {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				logged = true;
				show = false;
			})
			.catch((error) => {
				const errorCode = error.code;
				if (errorCode === 'auth/invalid-email') alert('Invalid email address');
				if (errorCode === 'auth/user-not-found') alert('User not found');
				if (errorCode === 'auth/wrong-password') alert('Wrong password');
				if (errorCode === 'auth/internal-error') alert('Internal error');
			});
	};
</script>

<View>
	<AppBar />
	<AppBody margin={false}>
		<div class="flex h-full flex-col">
			<div class="flex-[1] bg-blue flex flex-col items-start justify-end ">
				<button on:click={() => (show = false)} class="px-2 text-3xl">
					<i class="ri-arrow-left-s-line" />
				</button>
				<div class="flex flex-col gap-2 pt-2 p-4">
					<span class="text-2xl font-semibold">Sign in</span>
					<span class="opacity-60">Sign in to your account</span>
				</div>
			</div>
			<div class="flex-[5] bg-blue flex flex-col p-4 gap-4">
				<input
					bind:value={email}
					class="h-12 text-white bg-transparent border border-gray px-2 rounded-lg w-full focus:border-2 focus:border-aqua transition-all"
					type="email"
					placeholder="E-mail"
				/>
				<input
					bind:value={password}
					class="h-12 text-white bg-transparent border border-gray px-2 rounded-lg w-full focus:border-2 focus:border-aqua transition-all"
					type="password"
					placeholder="Password"
				/>
				<Button on:click={login} backgroundColor="aqua" color="blue">Login</Button>
				<div class="flex-1 flex justify-center items-end gap-1">
					<span class="text-white">Don't have an account?</span>
					<button on:click={() => (showCreateAccountView = true)} class="text-aqua"
						>Create account</button
					>
				</div>
			</div>
		</div>
	</AppBody>
</View>

{#if showCreateAccountView}
	<CreateAccount bind:show={showCreateAccountView} />
{/if}

<style>
	[data-menu] {
		transition: transform 150ms ease;
	}

	[data-menu='true'] {
		transform: translateX(-80%);
	}
</style>
