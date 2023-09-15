<script lang="ts">
	import type { Meeting } from '$lib/stores/meetings';
	import MeetingRSVPs from './MeetingRSVPs.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { rsvps } from '$lib/stores/rsvps';
	import Icon from '@iconify/svelte';
	export let meeting: Meeting;

	async function updateAttendance(event: CustomEvent<{ rsvpId: number; isAttending: boolean }>) {
		const { rsvpId, isAttending } = event.detail;
		const { data, error } = await supabase
			.from('rsvps')
			.update({ is_attending: isAttending })
			.eq('id', rsvpId).select(`*, 
				user (id, display_name)`);
		if (error) {
			console.error(error);
		} else {
			rsvps.update((rsvps) => {
				const index = rsvps.findIndex((rsvp) => rsvp.id === rsvpId);
				rsvps[index] = data[0];
				return rsvps;
			});
		}
	}
</script>

{#if meeting.book}
	<div class="flex flex-row -mx-2">
		<Icon icon="mdi:book" class="w-12 h-12 text-surface-800-100-token" />
		<div>
			<h2 class="text-xl -mb-1 font-bold">{meeting.book?.title}</h2>
			<h4 class="text-md text-surface-800-100-token font-bold">
				{meeting.book?.author}
			</h4>
		</div>
	</div>
{/if}
{#if meeting?.message}
	<div class="flex flex-col gap-1 w-full">
		<h2 class="text-lg text-surface-800-100-token font-light">About this meeting:</h2>
		<div class="border-l border-surface-800-100-token pl-2">
			<span class="text-2xl text-surface-800-100-token">{meeting.message}</span>
		</div>
	</div>
{/if}
<MeetingRSVPs meeting={meeting.id} isPast on:attendanceCorrection={updateAttendance} />
