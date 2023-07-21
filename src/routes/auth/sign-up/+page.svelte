<!-- // src/routes/auth/+page.svelte -->
<script lang="ts">
	import { Toast, toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	const route = $page.url.searchParams.get('redirect') ?? '/';
	$: if (data.session) {
		goto(route);
	}

	let email: string;
	let password: string;
	let display_name: string;

	const handleSignUp = async () => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${location.origin}/auth/callback`,
				data: {
					display_name
				}
			}
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
</script>

<div class="h-full">
	<div class="container max-w-sm mx-auto p-4 pt-32 mt-4 flex flex-col justify-center gap-4">
		<h2 class="text-7xl font-bold text-center">Sign up</h2>
		<form on:submit={handleSignUp} class="flex flex-col gap-2 mt-4">
			<div class="w-full">
				<label for="email">Email</label>
				<input class="w-full" type="email" name="email" required bind:value={email} />
			</div>
			<div class="w-full">
				<label for="password">Password</label>
				<input type="password" name="password" required bind:value={password} />
			</div>
			<div class="w-full">
				<label for="display_name">Full Name</label>
				<input type="text" name="display_name" required bind:value={display_name} />
			</div>
			<button type="submit" class="mt-4">Sign Up</button>
			<span class="text-center">
				or <a class="underline cursor-pointer" href={'login/?redirect=' + route}>
					sign in to your account
				</a><span /></span
			>
		</form>
	</div>
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
