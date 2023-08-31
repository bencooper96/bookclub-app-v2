<script lang="ts">
	import MeetingDateDisplay from '$components/meetings/MeetingDateDisplay.svelte';
	import RsvpInput from '$components/meetings/RSVPInput.svelte';
	import MeetingRSVPs from '$components/meetings/MeetingRSVPs.svelte';
	import Icon from '@iconify/svelte';
	import { currentMeeting, meetings } from '$lib/stores/meetings';
	import { onMount } from 'svelte';
	import PastMeetings from '$components/meetings/PastMeetings.svelte';
	import BookbotMessage from '$components/BookbotMessage.svelte';
	export let data;

	$: ({ session, supabase } = data);

	$: pastMeetings = $meetings
		.filter((meeting) => {
			const meetingDate = new Date(meeting.meeting_date);
			const now = new Date();
			return meetingDate < now;
		})
		.sort((a, b) => {
			const aDate = new Date(a.meeting_date);
			const bDate = new Date(b.meeting_date);
			return bDate.getTime() - aDate.getTime();
		});
	// This variable will save the event for later use.
	let deferredPrompt: ({ prompt: () => void } & Event) | undefined;

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e as { prompt: () => void } & Event;
		});
	});

	function editMeeting() {
		console.log('called edit');
	}
</script>

<div class="h-full">
	<div class="container max-w-xl mx-auto p-4 mt-4 flex flex-col gap-4">
		{#if $currentMeeting}
			{#if $currentMeeting.is_draft}
				<BookbotMessage
					header="BookBot created this meeting."
					message="Please help the group out by filling in some details."
					isButton={true}
					isPulsing={true}
					on:click={editMeeting}
				>
					<button on:click={editMeeting}>
						<Icon icon="lucide:arrow-right" class="w-6 h-6 text-surface-800-100-token" />
					</button>
				</BookbotMessage>
			{/if}
			<div class="flex flex-row justify-between items-center">
				{#if $currentMeeting.book}
					<div class="flex flex-row -mx-2">
						<Icon icon="mdi:book" class="w-16 h-16 text-surface-800-100-token" />
						<div>
							<h2 class="text-4xl -mb-1 font-bold">{$currentMeeting.book?.title}</h2>
							<h4 class="text-xl text-surface-800-100-token font-bold">
								{$currentMeeting.book?.author}
							</h4>
						</div>
					</div>
				{/if}
			</div>
			<div class="container bg-surface-50-900-token p-4 rounded-sm flex flex-col gap-8 shadow-xl">
				<div class="flex flex-col gap-6 w-full overflow-x-visible">
					<div class="flex flex-col gap-1 w-full">
						<h2 class="text-xl text-surface-800-100-token font-light">Next meeting:</h2>
						<MeetingDateDisplay date={$currentMeeting.meeting_date} display />
					</div>
					<RsvpInput {session} {supabase} meeting={$currentMeeting.id} />
					<MeetingRSVPs meeting={$currentMeeting.id} />
				</div>

				{#if $currentMeeting?.message}
					<div class="flex flex-col gap-1 w-full">
						<h2 class="text-lg text-surface-800-100-token font-light">About this meeting:</h2>
						<div class="border-l border-surface-800-100-token pl-2">
							<span class="text-2xl text-surface-800-100-token">{$currentMeeting.message}</span>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if pastMeetings.length > 0}
		<PastMeetings {pastMeetings} />
	{/if}
</div>
