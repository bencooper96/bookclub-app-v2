<script lang="ts">
	import {
		AppBar,
		toastStore,
		type ToastSettings,
		type PopupSettings,
		Autocomplete,
		popup
	} from '@skeletonlabs/skeleton';

	import DrawerMenu from '$components/DrawerMenu.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getTimezoneOffset } from '$lib/utils/time.js';

	export let data;
	$: ({ session } = data);
	$: if (!session) {
		goto('/auth/login?redirect=/add/meeting');
	}

	let isFromBook = $page.url.searchParams.get('from') === 'book';

	let bookId: number;
	let bookInput: string = '';
	let message: string = '';

	let loading = false;
	onMount(() => {
		const selectedBook = $page.data.selectedBook;
		bookId = selectedBook?.id;
		bookInput = selectedBook ? `${selectedBook?.title} - ${selectedBook?.author}` : '';
	});

	const t: ToastSettings = {
		message: 'Meeting successfully created!',
		timeout: 5000,
		background: 'variant-filled-success'
	};

	const popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom'
	};
	type BookAutocompleteOption = {
		value: number;
		label: string;
		keywords: string;
	};

	function onBookInputSelection({ detail }: { detail: any }) {
		bookId = detail.value;
		bookInput = detail?.label;
	}

	let bookOptions: BookAutocompleteOption[];
	$: bookOptions =
		[
			...$page.data.books?.map((book: { title: string; author: string; id: number }) => ({
				value: book.id,
				label: `${book.title} - ${book.author}`,
				keywords: `${book.title}, ${book.author}, ${book.id}`
			}))
		] ?? [];
</script>

<div class="h-full">
	<AppBar>
		<svelte:fragment slot="lead">
			<DrawerMenu {session} />
			<h1 class="ml-1 text-xl">Add a Meeting</h1>
		</svelte:fragment>
	</AppBar>
	<div class="container max-w-xl mx-auto p-4 mt-4 flex flex-col gap-4">
		<h2 class="{isFromBook ? 'text-3xl' : 'text-4xl'} ml-1 font-bold text-surface-800-100-token">
			{isFromBook ? 'Add your first meeting' : 'New meeting'}
		</h2>
		<form
			method="POST"
			action="?/create"
			use:enhance={({}) => {
				loading = true;

				return async ({ result, update }) => {
					loading = false;
					if (result.type === 'success') {
						toastStore.trigger(t);
						goto('/');
					} else {
						toastStore.trigger({
							message: 'Something went wrong!',
							timeout: 5000,
							background: 'variant-filled-error'
						});
					}
				};
			}}
			class="flex flex-col gap-2 mt-2 px-2 py-3 rounded bg-surface-50-900-token shadow-xl"
		>
			<input type="hidden" name="bookId" value={bookId} />
			<div class="w-full">
				<label for="datetime">Date</label>
				<input
					class="input"
					type="datetime-local"
					name="datetime"
					id="datetime"
					placeholder="Date"
					required
					min={new Date().toISOString().split('T')[0]}
				/>
			</div>
			<div class="w-full">
				<label for="message">Message</label>
				<textarea rows="2" class="input" name="message" id="message" bind:value={message} />
			</div>

			<div class="relative w-full">
				<label for="book-search">Book</label>
				<input
					class="input autocomplete"
					type="search"
					name="book-search"
					autocomplete="off"
					bind:value={bookInput}
					placeholder="Search..."
					use:popup={popupSettings}
				/>

				<div
					class="card p-2 w-full text-left shadow-xl bg-primary-50-900-token"
					data-popup="popupAutocomplete"
				>
					<Autocomplete
						bind:input={bookInput}
						options={bookOptions}
						on:selection={onBookInputSelection}
					/>
				</div>
			</div>
			<input class="hidden" type="text" name="timezoneOffset" value={getTimezoneOffset()} />
			<button type="submit" class="mt-4">Create meeting</button>
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
