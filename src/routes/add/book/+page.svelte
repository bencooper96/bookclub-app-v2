<script lang="ts">
	import { AppBar, toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	import DrawerMenu from '$components/DrawerMenu.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	export let data;
	$: ({ session } = data);
	$: if (!session) {
		goto('/auth/login?redirect=/add/book');
	}
	let title: string;
	let author: string;
	let loading = false;

	const t: ToastSettings = {
		message: 'Book successfully added!',
		timeout: 5000,
		background: 'variant-filled-success'
	};
</script>

<div class="h-full">
	<AppBar>
		<svelte:fragment slot="lead">
			<DrawerMenu {session} />
			<h1 class="ml-1 text-xl">Add a Book or Reading</h1>
		</svelte:fragment>
	</AppBar>
	<div class="container max-w-xl mx-auto p-4 mt-4 flex flex-col gap-4">
		<h2 class="text-4xl ml-1 font-bold text-surface-800-100-token">New book</h2>
		<form
			method="POST"
			action="?/create"
			use:enhance={({}) => {
				loading = true;

				return async ({ result, update }) => {
					if (result.type === 'success') {
						toastStore.trigger(t);
						goto('/add/meeting?from=book&book=' + result.data?.id);
					} else {
						toastStore.trigger({
							message: 'Something went wrong while adding the book!',
							timeout: 5000,
							background: 'variant-filled-error'
						});
					}
					loading = false;
				};
			}}
			class="flex flex-col gap-2 mt-2 p-2 rounded-sm bg-surface-50-900-token shadow-xl"
		>
			<div class="w-full">
				<label class="label" for="title">Title</label>
				<input class="w-full input" required type="text" name="title" bind:value={title} />
			</div>
			<div class="w-full">
				<label class="label" for="author">Author</label>
				<input type="text" class="input" required name="author" bind:value={author} />
			</div>
			<button type="submit" class="mt-4">Add book</button>
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
</style>
