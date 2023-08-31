<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let header: string;
	export let message: string;
	export let isButton = false;
	export let isPulsing = false;
	const dispatch = createEventDispatcher();
</script>

<div
	class="container bg-surface-50-900-token p-4 px-2 rounded-sm flex flex-row items-center justify-between shadow-xl"
	class:pulse={isPulsing}
	role={isButton ? 'button' : 'alert'}
	on:click={() => dispatch('click')}
>
	<span class="text-5xl">🤖</span>
	<div class="flex flex-col gap-0">
		<h2 class="font-sans text-sm text-surface-800-100-token">{header}</h2>
		<p class="text-surface-800-100-token text-lg">{message}</p>
	</div>
	<slot />
</div>

<style>
	.pulse {
		box-shadow: 0 0 0 0 rgba(237, 187, 254, 1);
		transform: scale(1);
		animation: pulse 2s infinite;
	}

	/* Pulsing animation */
	@keyframes pulse {
		0% {
			transform: scale(0.97);
			box-shadow: 0 0 0 0 rgba(237, 187, 254, 0.7);
		}

		70% {
			transform: scale(1);
			box-shadow: 0 0 0 10px rgba(237, 187, 254, 0);
		}

		100% {
			transform: scale(0.97);
			box-shadow: 0 0 0 0 rgba(237, 187, 254, 0);
		}
	}
</style>
