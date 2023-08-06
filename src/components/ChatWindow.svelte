<script lang="ts">
	import { onMount } from 'svelte';
	import { chat, loadMore, loadChat, createMessage, type Message } from '$lib/stores/messages';
	import { get } from 'svelte/store';
	import type { Session } from '@supabase/supabase-js';
	import ChatInput from './inputs/ChatInput.svelte';
	import ChatMessage from './ChatMessage.svelte';
	import { getDate } from '$lib/utils/time';
	export let session: null | Session;

	let isLoading = false;
	let div: HTMLDivElement;

	$: $chat = get(chat);
	// group by day
	$: messagesByDate = $chat.reduce((acc: Record<string, Message[]>, curr) => {
		const date = getDate(curr.created_at);
		if (acc[date]) {
			acc[date].push(curr);
		} else {
			acc[date] = [curr];
		}
		return acc;
	}, {});

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

	const sendMessage = async (event: CustomEvent) => {
		const { message } = event.detail;
		if (!session) return;
		await createMessage(message, session.user.id);
		div.scrollTo(0, div.scrollHeight);
	};
</script>

<div class="container max-w-xl h-full mx-auto flex flex-col gap-4 bg-surface-100-800-token">
	{#if session}
		<div
			class="w-full p-4 h-full overflow-y-auto space-y-4 hide-scrollbar"
			bind:this={div}
			on:scroll={backRead}
		>
			{#each Object.keys(messagesByDate) as date}
				<div class="flex flex-col gap-2 border-t first:border-none border-surface-200-700-token">
					<div class="text-center text-sm text-surface-400-500-token py-1">
						<span class="py-2">
							{date}
						</span>
					</div>
					{#each messagesByDate[date] as { id, created_at, author, text }}
						<ChatMessage
							{id}
							{created_at}
							{author}
							{text}
							isFromCurrentUser={author.id == session.user.id}
						/>
					{/each}
				</div>
			{/each}
		</div>
		<ChatInput on:sendMessage={sendMessage} />
	{/if}
</div>
