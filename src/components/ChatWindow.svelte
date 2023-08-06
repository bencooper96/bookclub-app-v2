<script lang="ts">
	import { beforeUpdate, afterUpdate, onMount } from 'svelte';
	import { chat, loadMore, loadChat } from '$lib/stores/messages';
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { Session } from '@supabase/supabase-js';
	export let session: null | Session;

	let isLoading = false;
	const dispatch = createEventDispatcher();
	let div: HTMLDivElement;

	$: $chat = get(chat);
	onMount(() => {
		isLoading = true;
		loadChat();
	});

	const backRead = async (e: any) => {
		let clientHeight = e.srcElement.scrollTop;
		if (clientHeight == 0) {
			isLoading = true;
			await loadMore();
			isLoading = false;
		}
	};

	const reply = async (id: string) => {
		div.scrollTo(0, div.scrollHeight);
		console.log('called reply');
	};
</script>

<div class="container max-w-xl mx-auto px-2 flex flex-col gap-4 bg-surface-100-800-token">
	{#if session}
		<div
			class="w-full p-4 h-full overflow-y-auto space-y-4"
			bind:this={div}
			on:scroll={backRead}
			class:disable-scroll={isLoading}
		>
			{#each $chat as { id, created_at, author, text }, key}
				{#if author.id == session.user.id}
					<div class="grid grid-cols-[1fr_auto] gap-2">
						<div class="card p-4 variant-glass-primary rounded-tr-none space-y-2">
							<header class="flex justify-between items-center">
								<p class="font-bold">{author.display_name}</p>
								<small class="opacity-50">{created_at}</small>
							</header>
							<p>{text}</p>
						</div>
						<Avatar src="https://i.pravatar.cc/" width="w-12" />
					</div>
				{:else}
					<div class="grid grid-cols-[auto_1fr] gap-2">
						<Avatar src="https://i.pravatar.cc/" width="w-12" />
						<div
							class="card p-4 rounded-tl-none variant-outlined-surface bg-surface-50-900-token space-y-2"
						>
							<header class="flex justify-between items-center">
								<p class="font-bold">{author.display_name}</p>
								<small class="opacity-50">{created_at}</small>
							</header>
							<p>{text}</p>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
