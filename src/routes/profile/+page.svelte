<!-- // src/routes/auth/+page.svelte -->
<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};

	$: displayName = session?.user.user_metadata?.display_name;
	$: email = session?.user.email;

	$: if (!session) {
		// navigate to login
		goto('/auth/login?redirect=/profile');
	}
</script>

<div class="container max-w-xl mx-auto p-4 mt-4 flex flex-col gap-4">
	<h2 class="text-4xl font-bold">Profile</h2>

	<h4 class="text-2xl text-surface-800-100-token font-bold">{displayName ?? email}</h4>
	{#if displayName}
		<h4 class="text-lg -mt-4 text-surface-800-100-token">{email}</h4>
	{/if}
	<button on:click={handleSignOut}> <span class="text-2xl">✌️</span> Sign out</button>
</div>

<style>
	button {
		@apply flex flex-row items-center justify-center p-4 w-full;
		@apply border border-surface-900-50-token bg-surface-100-800-token rounded-sm shadow-lg;
	}

	button:hover {
		@apply bg-surface-200-700-token;
	}
</style>
