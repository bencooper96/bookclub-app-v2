<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import MeetingDateDisplay from '$components/MeetingDateDisplay.svelte';
	import RsvpInput from '$components/RSVPInput.svelte';
	import DrawerMenu from '$components/DrawerMenu.svelte';

	import Icon from '@iconify/svelte';
	import { currentMeeting, meetings } from '$lib/stores/meetings';
	import { onMount } from 'svelte';
	import CurrentMeetingDisplay from '$components/CurrentMeetingDisplay.svelte';
	import PastMeetings from '$components/PastMeetings.svelte';
	export let data;

	$: ({ session, supabase } = data);

	$: pastMeetings = $meetings.filter((meeting) => {
		const meetingDate = new Date(meeting.meeting_date);
		const now = new Date();
		return meetingDate < now;
	});
	// This variable will save the event for later use.
	let deferredPrompt: ({ prompt: () => void } & Event) | undefined;

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e as { prompt: () => void } & Event;
		});
	});

	function installApp() {
		deferredPrompt?.prompt();
	}
</script>

<div class="h-full">
	<AppBar class="sticky z-10 top-0">
		<svelte:fragment slot="lead">
			<DrawerMenu {session} />
			<h1 class="ml-1 text-xl">Currently Reading</h1>
		</svelte:fragment>
		<svelte:fragment slot="trail">
			{#if deferredPrompt !== undefined}
				<button
					class="sm:hidden flex flex-row items-center gap-2 px-4 py-2 rounded-sm shadow bg-primary-300-600-token text-surface-800"
					on:click={installApp}
				>
					Install</button
				>
			{/if}
		</svelte:fragment>
	</AppBar>
	<div class="container max-w-xl mx-auto p-4 mt-4 flex flex-col gap-4">
		{#if $currentMeeting}
			<CurrentMeetingDisplay {currentMeeting} {session} />
		{/if}
	</div>

	<PastMeetings {pastMeetings} />
</div>
