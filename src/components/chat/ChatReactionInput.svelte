<script lang="ts">
	import { REACTION_OPTIONS } from '$lib/stores/messages';
	import type { Placement } from '@floating-ui/dom';
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let iconSize = 4;
	export let placement: Placement = 'bottom-end';
	export let messageId: number;
	export let buttonClass = 'btn variant-outline-surface btn-sm';

	const reactionsPanel: PopupSettings = {
		event: 'click',
		target: `reactions-panel-${messageId}`,
		placement: placement
	};
</script>

<button class={buttonClass} use:popup={reactionsPanel}>
	<Icon icon="lucide:smile-plus" class={`w-${iconSize} h-${iconSize}`} />
</button>
<div class="card px-4 variant-filled-surface" data-popup={`reactions-panel-${messageId}`}>
	<div class="flex flex-row gap-1">
		{#each REACTION_OPTIONS as emoji}
			<button class="p-2" on:click={() => dispatch('addReaction', { messageId, emoji })}>
				<span class="text-xl">{emoji}</span>
			</button>
		{/each}
	</div>
	<div class="arrow variant-filled-surface" />
</div>
