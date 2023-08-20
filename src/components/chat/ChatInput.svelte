<script lang="ts">
	import { isMobile } from '$lib/utils/browser';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	export let isExpanded: boolean = false;
	let message = '';
	const sendMessage = () => {
		dispatch('sendMessage', { message });
		message = '';
		// blur the textarea
		document.getElementById('chat-input')?.blur();
	};

	onMount(() => {
		window.addEventListener('keydown', keyboardSend);
		return () => {
			window.removeEventListener('keydown', keyboardSend);
		};
	});

	function keyboardSend(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey && !isMobile()) {
			event.preventDefault();
			sendMessage();
		}
	}

	const setExpanded = (value: boolean) => (isExpanded = value);
</script>

<div
	class="border-t border-surface-600-300-token py-2 pr-2 md:px-12 lg:px-40 bg-surface-50-900-token flex"
	class:collapsed={!isExpanded}
	class:expanded={isExpanded}
>
	<textarea
		id="chat-input"
		class="flex-1 py-2 px-4 bg-transparent border-none focus:ring-0"
		placeholder="Type a message"
		rows={isExpanded ? 3 : 1}
		on:focus={() => {
			setExpanded(true);
			setTimeout(() => {
				dispatch('scrollToBottom');
			});
		}}
		on:focusout={() => {
			setExpanded(false);
		}}
		bind:value={message}
	/>
	<div class="toolbar flex flex-row justify-end">
		<button class="btn variant-filled-primary" on:click={sendMessage}>Send</button>
	</div>
</div>

<style>
	textarea {
		overflow-y: auto;
		resize: none;
	}

	.collapsed {
		@apply flex-row items-end h-16;
	}
	.expanded {
		@apply flex-col gap-2 h-40;
	}
</style>
