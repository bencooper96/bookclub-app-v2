<script lang="ts">
	import type { Placement } from '@floating-ui/dom';
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import { expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let iconSize = 'btn-sm';
	export let placement: Placement = 'bottom-end';
	export let messageId: number;

	const reactionsPanel: PopupSettings = {
		event: 'click',
		target: 'reactionsPanel',
		placement: placement
	};

	const REACTION_OPTIONS = ['👍', '👎', '❤️', '🔥', '👀'];
</script>

<div>
	<div class="card px-4 variant-filled-surface" data-popup="reactionsPanel">
		<div class="flex flex-row gap-1">
			{#each REACTION_OPTIONS as emoji}
				<button class="p-2" on:click={() => dispatch('addReaction', { messageId, emoji })}>
					<span class="text-xl">{emoji}</span>
				</button>
			{/each}
		</div>
		<div class="arrow variant-filled-surface" />
	</div>
	<button class="btn variant-outline-surface btn-sm" use:popup={reactionsPanel}>
		<Icon icon="lucide:smile-plus" class="w-3 h-3" />
	</button>
</div>
