<script lang="ts">
	import { onMount } from 'svelte';
	import {
		chat,
		loadMore,
		loadChat,
		createMessage,
		type Message,
		createReaction,
		deleteReaction,
		deleteMessageById
	} from '$lib/stores/messages';
	import type { Session } from '@supabase/supabase-js';
	import ChatInput from './ChatInput.svelte';
	import ChatMessage from './ChatMessage.svelte';
	import { getDate } from '$lib/utils/time';
	import Icon from '@iconify/svelte';
	import type { Meeting } from '$lib/stores/meetings';
	import UpcomingMeetingBanner from '$components/meetings/UpcomingMeetingBanner.svelte';

	export let session: null | Session;
	export let currentMeeting: Meeting | null | undefined;
	let isLoading = false;
	let div: HTMLDivElement;
	let autoscrolling = true;

	$: $chat && autoScroll();
	function autoScroll() {
		if (!div) return;
		if (autoscrolling) {
			setTimeout(() => {
				scrollToBottom();
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
		scrollToBottom();
	});

	const handleScroll = async (e: any) => {
		autoscrolling = false;
		let clientHeight = e.srcElement?.scrollTop;
		if (clientHeight === 0) {
			isLoading = true;
			await loadMore();
			isLoading = false;
			setTimeout(() => {
				div?.scrollTo({ left: 0, top: 40, behavior: 'smooth' });
			}, 250);
		}

		if (clientHeight == div.scrollHeight - div.clientHeight) {
			autoscrolling = true;
		}
	};

	const sendMessage = async (event: CustomEvent) => {
		autoscrolling = true;
		const { message } = event.detail;
		if (!session) return;
		await createMessage(message, session.user.id);
	};

	function scrollToBottom() {
		div?.scrollTo({ left: 0, top: div.scrollHeight, behavior: 'smooth' });
		isLoading = false;
	}

	function addReaction(event: CustomEvent) {
		if (!session) return;
		const { messageId, emoji } = event.detail;
		createReaction(messageId, emoji, session.user.id);
	}

	function removeReaction(event: CustomEvent) {
		if (!session) return;
		const { reactionId } = event.detail;
		deleteReaction(reactionId);
	}

	function handleDeleteMessage(event: CustomEvent) {
		if (!session) return;
		const { messageId } = event.detail;
		deleteMessageById(messageId);
	}

	const offsetClass = currentMeeting ? 'pt-24 md:pt-12' : 'pt-16 md:pt-0';
</script>

{#if currentMeeting}
	<UpcomingMeetingBanner {currentMeeting} {session} />
{/if}
<div class={`container -mt-12 md:mt-0 chat-window ${offsetClass}`}>
	{#if session}
		<div
			class="w-full md:px-12 lg:px-40 p-4 overflow-y-auto space-y-4 hide-scrollbar"
			bind:this={div}
			on:scroll={handleScroll}
		>
			<span class:invisible={!isLoading} class="flex justify-center">
				<Icon icon="lucide:loader-2" class="w-6 h-6 animate-spin text-surface-400-500-token" />
			</span>
			{#each Object.keys(messagesByDate) as date (date)}
				<div class="flex flex-col gap-2">
					<div class="text-center text-sm text-surface-400-500-token py-1">
						<span class="py-2">
							{date}
						</span>
					</div>
					{#each messagesByDate[date] as message (message.id)}
						<ChatMessage
							{message}
							currentUser={session.user.id}
							on:addReaction={addReaction}
							on:removeReaction={removeReaction}
							on:deleteMessage={handleDeleteMessage}
						/>
					{/each}
				</div>
			{/each}
		</div>
		<ChatInput on:sendMessage={sendMessage} on:scrollToBottom={scrollToBottom} />
	{/if}
</div>

<style>
	.chat-window {
		@apply flex flex-col h-screen justify-end;
		@apply bg-white bg-opacity-50;
	}
</style>
