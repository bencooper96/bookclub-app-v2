<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import MeetingDateDisplay from '$components/MeetingDateDisplay.svelte';
	import RsvpInput from '$components/RSVPInput.svelte';
	import DrawerMenu from '$components/DrawerMenu.svelte';
	import MeetingRSVPs from '$components/MeetingRSVPs.svelte';
	import Icon from '@iconify/svelte';
	import { currentMeeting, meetings } from '$lib/stores/meetings';
	import { onMount } from 'svelte';
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
					class="flex flex-row items-center gap-2 px-4 py-2 rounded-sm shadow bg-primary-300-600-token text-surface-800"
					on:click={installApp}
				>
					Install</button
				>
			{/if}
		</svelte:fragment>
	</AppBar>
	<div class="container max-w-xl mx-auto p-4 mt-4 flex flex-col gap-4">
		{#if $currentMeeting}
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
						<h2 class="text-lg text-surface-800-100-token font-light">Next meeting:</h2>
						<MeetingDateDisplay date={$currentMeeting.meeting_date} />
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
		<div class="container max-w-xl mx-auto p-4 flex flex-col gap-4">
			<h2 class="text-xl">Past Meetings:</h2>
			<ul class="list">
				{#each pastMeetings as meeting}
					<li class="card p-2 flex flex-row justify-between">
						<div class="flex flex-row gap-1">
							<span class="badge variant-filled ml-1 w-6"
								>{meeting.rsvps?.filter((r) => r.is_attending).length}</span
							>
							<span class="text-xl font-bold">Attendees</span>
						</div>
						<MeetingDateDisplay date={meeting.meeting_date} minimal />
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
