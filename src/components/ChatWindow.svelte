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
	let autoscrolling = true;

	$: $chat = get(chat);
	$: $chat && autoScroll();
	function autoScroll() {
		if (!div) return;
		if (autoscrolling) {
			setTimeout(() => {
				div.scrollTo({ left: 0, top: div.scrollHeight, behavior: 'smooth' });
			}, 250);
		}
	}

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

	onMount(async () => {
		isLoading = true;
		await loadChat();
		div.scrollTo(0, div.scrollHeight);
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
	};
</script>

<div class="container max-w-2xl flex-grow mx-auto chat-window">
	{#if session}
		<div
			class="w-full p-4 overflow-y-auto space-y-4 hide-scrollbar"
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

<style>
	.chat-window {
		@apply flex flex-col gap-4 h-full pt-16 justify-end;
		@apply bg-white bg-opacity-60 shadow-lg;
	}
</style>
