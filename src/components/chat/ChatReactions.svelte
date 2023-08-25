<script lang="ts">
	import type { Reaction } from '$lib/stores/messages';

	import { createEventDispatcher } from 'svelte';
	import ChatReactionInput from './ChatReactionInput.svelte';
	import { fade } from 'svelte/transition';
	import { REACTION_OPTIONS } from '$lib/consts/chat';

	const dispatch = createEventDispatcher();
	export let messageId: number;
	export let reactions: Reaction[];
	export let currentUser: string;
	$: reactions = reactions;
	$: filteredReactionOptions = REACTION_OPTIONS.filter(
		(emoji) =>
			!reactions.some((reaction) => reaction.user.id === currentUser && reaction.emoji === emoji)
	);

	type GroupedReactions = {
		[key: string]: Reaction[];
	};
	$: groupedReactions = reactions.reduce((acc: GroupedReactions, reaction) => {
		if (acc[reaction.emoji]) {
			acc[reaction.emoji].push(reaction);
		} else {
			acc[reaction.emoji] = [reaction];
		}
		return acc;
	}, {});

	const stopContextMenu = (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		e.stopImmediatePropagation();
		return false;
	};

	const userHasReacted = (emoji: string) => {
		return reactions.find(
			(reaction) => reaction.user.id === currentUser && reaction.emoji === emoji
		);
	};
</script>

<div class="flex flex-row gap-1 mt-2 w-min h-6">
	{#each Object.entries(groupedReactions) as [emoji, reactionGroup] (`${emoji}-${messageId}`)}
		<button
			class="btn variant-ghost btn-sm [&>*]:pointer-events-none"
			on:click={() => {
				const userReaction = userHasReacted(emoji);
				if (userReaction) {
					dispatch('removeReaction', { reactionId: userReaction.id });
				} else {
					dispatch('addReaction', { messageId, emoji });
				}
			}}
			class:bg-primary-400={userHasReacted(emoji)}
			transition:fade={{ duration: 200 }}
		>
			<span class="text-sm">
				{emoji}
				{reactionGroup.length}
			</span>
		</button>
	{/each}
	<div class="card px-4 variant-filled-surface" data-popup={`reactions-panel-${messageId}`}>
		<div class="flex flex-row gap-1">
			{#each filteredReactionOptions as emoji}
				<button
					class="p-2"
					on:contextmenu={stopContextMenu}
					on:click={() => {
						const userReaction = userHasReacted(emoji);
						if (userReaction) {
							dispatch('removeReaction', { reactionId: userReaction.id });
						} else {
							dispatch('addReaction', { messageId, emoji });
						}
					}}
				>
					<span class="text-xl">{emoji}</span>
				</button>
			{/each}
		</div>
		<div class="arrow variant-filled-surface" />
	</div>
	<ChatReactionInput
		{messageId}
		buttonClass="btn variant-ghost-surface btn-sm"
		placement="top-start"
	/>
</div>
