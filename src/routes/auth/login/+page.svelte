<!-- // src/routes/auth/+page.svelte -->
<script lang="ts">
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	let email: string;
	let password: string;

	const handleSignIn = async () => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error) {
			console.error(error);
			const t: ToastSettings = {
				message: error.message,
				timeout: 5000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		}
	};

	const route = $page.url.searchParams.get('redirect') ?? '/';
	$: if (data.session) {
		goto(route);
	}
</script>

<div class="container max-w-sm mx-auto p-4 pt-32 mt-4 flex flex-col gap-4">
	<h2 class="text-7xl font-bold text-center">Sign in</h2>

	<form on:submit={handleSignIn} class="flex flex-col gap-2 mt-4">
		<div class="w-full">
			<label for="email" class="label">Email</label>
			<input class="w-full input" type="email" name="email" bind:value={email} />
		</div>
		<div class="w-full">
			<label for="password" class="label">Password</label>
			<input type="password" class="input" name="password" bind:value={password} />
		</div>
		<button type="submit" class="mt-4">Sign In</button>
		<span class="text-center">
			or <a class="underline cursor-pointer" href={'sign-up/?redirect=' + route}>
				create an account
			</a><span /></span
		>
	</form>
</div>

<style>
	button {
		@apply flex flex-row items-center justify-center p-4 w-full;
		@apply border border-surface-900-50-token bg-surface-100-800-token rounded-sm shadow-lg;
	}

	button:hover {
		@apply bg-surface-200-700-token;
	}

	label {
		@apply text-surface-700-200-token text-sm;
	}
	input {
		@apply border border-surface-900 bg-primary-50 rounded shadow-lg w-full;
	}
</style>
