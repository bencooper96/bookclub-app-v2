<script lang="ts">
	import {
		AppBar,
		toastStore,
		type ToastSettings,
		Accordion,
		AccordionItem
	} from '@skeletonlabs/skeleton';

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
	let type: string | null = null;
	const typeOptions = [
		{ value: 'novel', label: 'Novel' },
		{ value: 'short-story', label: 'Short Story/Short Story Collection' },
		{ value: 'poem', label: 'Poem' },
		{ value: 'play', label: 'Play' },
		{ value: 'essay', label: 'Essay' },
		{ value: 'non-fiction', label: 'Non-fiction' },
		{ value: 'other', label: 'Other' }
	];

	let gender: string | null = null;
	const genderOptions = [
		{ value: 'female', label: 'Female' },
		{ value: 'male', label: 'Male' },
		{ value: 'non-binary', label: 'Non-binary/Genderqueer' }
	];
	let publication_year: string;
	let original_language: string;
	let race_ethnicity: string;

	let loading = false;

	const t: ToastSettings = {
		message: 'Book successfully added!',
		timeout: 5000,
		background: 'variant-filled-success'
	};
</script>

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
					goto('/meetings/add?from=book&book=' + result.data?.id);
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
		class="flex flex-col gap-2 mt-2 px-2 py-3 rounded bg-surface-50-900-token shadow-xl"
	>
		<div class="w-full">
			<label class="label" for="title">Title</label>
			<input class="w-full input" required type="text" name="title" bind:value={title} />
		</div>
		<div class="w-full">
			<label class="label" for="author">Author</label>
			<input type="text" class="input" required name="author" bind:value={author} />
		</div>
		<Accordion class="my-2 bg-surface-100-800-token border border-surface-500 rounded-lg">
			<AccordionItem open={false}>
				<svelte:fragment slot="summary">Optional additional info</svelte:fragment>
				<svelte:fragment slot="content">
					<div class="pb-2 flex flex-col gap-3">
						<div class="w-full">
							<label class="label" for="type">Type of reading</label>
							<select class="input" name="type" bind:value={type}>
								{#each typeOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>
						<div class="w-full">
							<label class="label" for="type">Gender of author</label>
							<select class="input" name="gender" bind:value={gender}>
								{#each genderOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>
					</div>
					<div class="w-full">
						<label class="label" for="publication_year">Publication year</label>
						<input
							class="input"
							type="number"
							name="publication_year"
							bind:value={publication_year}
						/>
					</div>
					<div class="w-full">
						<label class="label" for="original_language">Original language</label>
						<input
							class="input"
							type="text"
							name="original_language"
							bind:value={original_language}
						/>
					</div>
					<div class="w-full">
						<label class="label" for="race_ethnicity">Race/ethnicity of author</label>
						<input class="input" type="text" name="race_ethnicity" bind:value={race_ethnicity} />
					</div>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
		<button type="submit" class="mt-4">Add book</button>
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
</style>
