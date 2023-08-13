<script lang="ts">
	import type { Meeting } from '$lib/stores/meetings';
	import MeetingDateDisplay from './meetings/MeetingDateDisplay.svelte';
	import type { Session } from '@supabase/supabase-js';

	export let currentMeeting: Meeting;
	export let session: Session | null;

	$: userHasRSVPed = currentMeeting?.rsvps?.some((rsvp) => rsvp.user.id === session?.user?.id);
</script>

<div
	class="sticky top-16 md:top-0 right-0 left-0 flex flex-row justify-between z-30 bg-tertiary-300 p-2 shadow-lg"
>
	<div class="flex flex-col md:flex-row md:items-center md:gap-2">
		<h2 class="text-xs text-surface-800-100-token">Upcoming Meeting:</h2>
		<MeetingDateDisplay date={currentMeeting.meeting_date} minimal />
	</div>
	{#if userHasRSVPed}
		<span class="badge variant-ghost-success">rsvped</span>
	{:else}
		<a href="/meetings" class="btn btn-sm variant-filled-primary">RSVP</a>
	{/if}
</div>
