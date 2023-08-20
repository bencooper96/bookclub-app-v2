<script lang="ts">
	import ChatWindow from '$components/chat/ChatWindow.svelte';
	export let data;
	import { currentMeeting } from '$lib/stores/meetings';
	$: ({ session } = data);
</script>

<ChatWindow {session} currentMeeting={$currentMeeting} />
