<script lang="ts">
	import type { Meeting } from '$lib/stores/meetings';
	import MeetingDateDisplay from './MeetingDateDisplay.svelte';

	export let pastMeetings: Meeting[];
</script>

{#if pastMeetings?.length > 0}
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
