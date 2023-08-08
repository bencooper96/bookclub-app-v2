<script lang="ts">
	import type { Reaction } from '$lib/stores/messages';
	import Icon from '@iconify/svelte';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	export let messageId: number;
	export let reactions: Reaction[];
	let showTooltip = false;

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

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'top'
	};

	const AVATAR_BG_LIST = ['bg-primary-500', 'bg-secondary-500', 'bg-tertiary-500'];
</script>

<div class="flex flex-row gap-1 mt-2">
	{#if reactions?.length > 0}
		{#each Object.entries(groupedReactions) as [emoji, reactionGroup]}
			<div class="card p-2 variant-filled-surface flex flex-wrap" data-popup="popupHover">
				{#each reactionGroup as reaction, i}
					<Avatar
						src={reaction.user.profile_img_url}
						initials={reaction.user.display_name}
						width="w-8"
						background={AVATAR_BG_LIST[i % AVATAR_BG_LIST.length]}
					/>
				{/each}
				<div class="arrow variant-filled-surface" />
			</div>
			<button class="btn variant-ghost btn-sm [&>*]:pointer-events-none" use:popup={popupHover}>
				<span class="text-xl">
					{emoji}
					{reactionGroup.length}
				</span>
			</button>
		{/each}
		<button class="btn variant-ghost-surface btn-sm">
			<Icon icon="lucide:smile-plus" class="w-5 h-5" />
		</button>
	{/if}
</div>
