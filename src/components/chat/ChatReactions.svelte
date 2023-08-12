<script lang="ts">
	import { AVATAR_BG_LIST, REACTION_OPTIONS, type Reaction } from '$lib/stores/messages';
	import { getInitials } from '$lib/utils/avatarUtils';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import ChatReactionInput from './ChatReactionInput.svelte';

	const dispatch = createEventDispatcher();
	export let messageId: number;
	export let reactions: Reaction[];
	export let currentUser: string;

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

<div class="flex flex-row gap-1 mt-2">
	{#each Object.entries(groupedReactions) as [emoji, reactionGroup]}
		<div
			class="card p-2 variant-filled-surface flex flex-row"
			data-popup={`reactions-detail-${messageId}-${emoji}`}
		>
			{#each reactionGroup as reaction, i}
				<div class="flex flex-col items-center justify-center gap-0">
					<Avatar
						src={reaction.user.profile_img_url}
						initials={getInitials(reaction.user.display_name)}
						width="w-8"
						background={AVATAR_BG_LIST[i % AVATAR_BG_LIST.length]}
					/>
					<small class="opacity-50 truncate w-20">{reaction.user.display_name}</small>
				</div>
			{/each}
			<div class="arrow variant-filled-surface" />
		</div>
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
			class:active={userHasReacted(emoji)}
		>
			<span class="text-sm">
				{emoji}
				{reactionGroup.length}
			</span>
		</button>
	{/each}
	<div class="card px-4 variant-filled-surface" data-popup={`reactions-panel-${messageId}`}>
		<div class="flex flex-row gap-1">
			{#each REACTION_OPTIONS.filter((emoji) => !userHasReacted(emoji)) as emoji}
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

<style>
	.active {
		@apply variant-filled-primary;
	}
</style>
