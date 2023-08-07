<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import MeetingDateDisplay from '$components/MeetingDateDisplay.svelte';
	import RsvpInput from '$components/RSVPInput.svelte';
	import DrawerMenu from '$components/DrawerMenu.svelte';

	import { currentMeeting, meetings } from '$lib/stores/meetings';
	import { onMount } from 'svelte';
	import CurrentMeetingDisplay from '$components/CurrentMeetingDisplay.svelte';
	import PastMeetings from '$components/PastMeetings.svelte';
	import ChatWindow from '$components/ChatWindow.svelte';
	import SideMenu from '$components/SideMenu.svelte';
	export let data;

	$: ({ session, supabase } = data);

	$: pastMeetings = $meetings.filter((meeting) => {
		const meetingDate = new Date(meeting.meeting_date);
		const now = new Date();
		return meetingDate < now;
	});
</script>

<!-- <div class="container max-w-xl mx-auto p-4 mt-4 flex flex-col gap-4">
		{#if $currentMeeting}
			<CurrentMeetingDisplay {currentMeeting} {session} />
		{/if}
	</div> -->
<ChatWindow {session} />

<!-- <PastMeetings {pastMeetings} /> -->
