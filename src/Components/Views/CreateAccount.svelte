<script>
	import { initializeApp } from 'firebase/app';
	import { getDatabase, set, ref } from 'firebase/database';
	import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
	import firebaseConfig from '../../libs/firebaseConfig.json';

	import AppBar from '../AppBar.svelte';
	import AppBody from '../AppBody.svelte';
	import Button from '../Button.svelte';
	import View from './View.svelte';
	import { onMount } from 'svelte';
	import { NavigationStack } from '../../libs/stores';

	const app = initializeApp(firebaseConfig);
	const database = getDatabase(app);

	const roles = {
		D: {
			description: 'Driver'
		},
		C: {
			description: 'Co Driver'
		},
		E: {
			description: 'Engineer'
		}
	};

	export let show = false;

	let section = 0;
	let role = '';

	let firstName = '';
	let lastName = '';
	let dateOfBirth = '';
	let email = '';
	let password = '';

	const chooseRole = (selectedRole) => {
		role = selectedRole;
		section = 1;
	};

	const validateForm = () => {
		if (firstName.trim() === '') return false;
		if (lastName.trim() === '') return false;
		if (dateOfBirth.trim() === '') return false;
		if (email.trim() === '') return false;
		if (password.trim() === '') return false;

		return true;
	};

	const createAccount = () => {
		const isFormValid = validateForm();
		if (!isFormValid) return;

		const auth = getAuth();
		createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				const user = userCredential.user;
				console.log(user);
				await writeUserData(user.uid, firstName, lastName, email, dateOfBirth, role);

				dismissView();
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
			});
	};

	const writeUserData = async (userId, firstName, lastName, email, dateOfBirth, role) => {
		await set(ref(database, `users/${userId}`), {
			firstName,
			lastName,
			email,
			dateOfBirth,
			role
		});

		return true;
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
	<AppBar />
	<AppBody margin={false}>
		<div class="flex h-full flex-col">
			<div class="flex-[1] bg-blue flex flex-col items-start justify-end ">
				<button on:click={dismissView} class="px-2 text-3xl">
					<i class="ri-arrow-left-s-line" />
				</button>
				<div class="flex flex-col gap-2 pt-2 p-4">
					<span class="text-2xl font-semibold">Create account</span>
					<span class="opacity-60">Create your account</span>
				</div>
			</div>
			<div class="flex-[5] bg-blue flex flex-col p-4 gap-4">
				{#if section === 0}
					<span class="text-lg font-medium">Which is your role?</span>
					<div class="flex flex-col gap-2">
						{#each Object.keys(roles) as key}
							<Button
								on:click={() => chooseRole(key)}
								border={false}
								backgroundColor={role === key ? 'aqua' : 'white'}
								color="blue">{roles[key].description}</Button
							>
						{/each}
					</div>
				{:else if section === 1}
					<span class="text-lg font-medium">
						Role:
						<button
							on:click={() => (section = 0)}
							class="text-aqua active:opacity-60 transition-all"
						>
							{roles[role].description} <i class="ri-edit-line" />
						</button>
					</span>

					<input
						class="h-12 text-white bg-transparent border border-gray px-2 rounded-lg w-full focus:border-2 focus:border-aqua transition-all"
						type="text"
						bind:value={firstName}
						placeholder="First Name"
					/>
					<input
						class="h-12 text-white bg-transparent border border-gray px-2 rounded-lg w-full focus:border-2 focus:border-aqua transition-all"
						type="text"
						bind:value={lastName}
						placeholder="Last Name"
					/>
					<input
						class="h-12 text-white bg-transparent border border-gray px-2 rounded-lg w-full focus:border-2 focus:border-aqua transition-all"
						type="date"
						bind:value={dateOfBirth}
						placeholder="Date of Birth"
					/>
					<input
						class="h-12 text-white bg-transparent border border-gray px-2 rounded-lg w-full focus:border-2 focus:border-aqua transition-all"
						type="email"
						bind:value={email}
						placeholder="E-mail"
					/>
					<input
						class="h-12 text-white bg-transparent border border-gray px-2 rounded-lg w-full mb-2 focus:border-2 focus:border-aqua transition-all"
						type="password"
						bind:value={password}
						placeholder="Password"
					/>
					<Button on:click={createAccount} backgroundColor="aqua" color="blue">
						Create your account
					</Button>
				{/if}
				<div class="flex-1 flex justify-center items-end gap-1">
					<span class="text-white">Already have an account?</span>
					<button on:click={dismissView} class="text-aqua">Sign in</button>
				</div>
			</div>
		</div>
	</AppBody>
</View>

<style>
	[data-menu] {
		transition: transform 150ms ease;
	}

	[data-menu='true'] {
		transform: translateX(-80%);
	}
</style>
