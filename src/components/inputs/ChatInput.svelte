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
	class="border-t border-surface-600-300-token bg-surface-50-900-token flex flex-row"
	use:clickOutside={() => {
		isExpanded = false;
	}}
>
	<textarea
		class="flex-1 p-4 bg-transparent border-none"
		placeholder="Type a message"
		rows={isExpanded ? 4 : 1}
		on:click={() => {
			isExpanded = true;
		}}
		bind:value={message}
	/>
	<button class="btn btn-primary" on:click={sendMessage}> Send</button>
</div>

<style>
	textarea {
		overflow-y: auto;
		resize: none;
	}
</style>
