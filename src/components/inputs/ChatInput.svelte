<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let isExpanded = false;
	let message = '';
	const sendMessage = () => {
		dispatch('sendMessage', { message });
		message = '';
		isExpanded = false;
	};

	function clickOutside(element: HTMLElement, callbackFunction: () => void) {
		function onClick(event: MouseEvent) {
			if (event.target && !element.contains(event.target as Node)) {
				callbackFunction();
			}
		}

		document.body.addEventListener('click', onClick);

		return {
			destroy() {
				document.body.removeEventListener('click', onClick);
			}
		};
	}
</script>

<div
	class="border-t border-surface-600-300-token py-2 pr-2 md:px-12 lg:px-40 bg-surface-50-900-token flex"
	class:collapsed={!isExpanded}
	class:expanded={isExpanded}
	use:clickOutside={() => {
		isExpanded = false;
	}}
>
	<textarea
		class="flex-1 py-2 px-4 bg-transparent border-none focus:ring-0"
		placeholder="Type a message"
		rows={isExpanded ? 3 : 1}
		on:click={() => {
			isExpanded = true;
		}}
		bind:value={message}
	/>
	<div class="toolbar flex flex-row justify-end">
		<button class="btn variant-filled-primary btn-sm h-min" on:click={sendMessage}>Send</button>
	</div>
</div>

<style>
	textarea {
		overflow-y: auto;
		resize: none;
	}

	.collapsed {
		@apply flex-row items-end;
	}
	.expanded {
		@apply flex-col gap-2;
	}
</style>
