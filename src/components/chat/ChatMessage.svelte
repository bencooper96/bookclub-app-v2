<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { Message } from '$lib/stores/messages';
	import { getInitials } from '$lib/utils/avatarUtils';
	import { formatTime } from '$lib/utils/time';
	import ChatReactions from './ChatReactions.svelte';

	export let message: Message;
	const { id, created_at, author, text, reactions } = message;

	export let isFromCurrentUser: boolean;

	$: timestamp = formatTime(created_at, 'h:mm a');
</script>

{#if isFromCurrentUser}
	<div class="grid grid-cols-[1fr_auto] gap-2">
		<div class="card px-4 py-2 variant-glass-primary rounded-tr-none space-y-2">
			<header class="flex justify-between items-center">
				<p class="font-bold opacity-70">{author.display_name}</p>
				<small class="opacity-50">{timestamp}</small>
			</header>
			<p class="whitespace-pre-line">{text}</p>
			<ChatReactions messageId={id} {reactions} />
		</div>
		<Avatar src={author.profile_img_url} initials={getInitials(author.display_name)} width="w-12" />
	</div>
{:else}
	<div class="grid grid-cols-[auto_1fr] gap-2">
		<Avatar src={author.profile_img_url} initials={getInitials(author.display_name)} width="w-12" />
		<div
			class="card p-4 rounded-tl-none variant-outlined-surface bg-surface-50-900-token space-y-2"
		>
			<header class="flex justify-between items-center">
				<p class="font-bold opacity-70">{author.display_name}</p>
				<small class="opacity-50">{timestamp}</small>
			</header>
			<p class="whitespace-pre-line">{text}</p>
		</div>
	</div>
{/if}
