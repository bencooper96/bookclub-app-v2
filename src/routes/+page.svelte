<script lang="ts">
	import ChatWindow from '$components/chat/ChatWindow.svelte';
	export let data;
	import { currentMeeting } from '$lib/stores/meetings';
	$: ({ session } = data);
</script>

<ChatWindow {session} currentMeeting={$currentMeeting} />

{#if !session}
	<div class="h-full w-full relative overflow-hidden">
		<div class="absolute inset-0 p-4 -m-2 grid place-items-center">
			<a
				class="card p-2 bg-surface-100-800-token rounded border-surface-500 border-2"
				href="/auth/login"
			>
				<span class="text-2xl mr-1">✋</span>
				<span class="text-lg">You must be signed in to participate</span>
			</a>
		</div>
	</div>
{/if}
