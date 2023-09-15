<script lang="ts">
	import type { Meeting } from '$lib/stores/meetings';
	import Icon from '@iconify/svelte';
	import MeetingDateDisplay from './MeetingDateDisplay.svelte';
	import { Accordion, AccordionItem, Avatar } from '@skeletonlabs/skeleton';
	import PastMeeting from './PastMeeting.svelte';

	export let pastMeetings: Meeting[];
</script>

{#if pastMeetings?.length > 0}
	<div class="container max-w-3xl mx-auto p-4 flex flex-col gap-4 h-full">
		<h2 class="text-xl">Past Meetings:</h2>
		<Accordion>
			{#each pastMeetings as meeting}
				<AccordionItem class="card">
					<svelte:fragment slot="lead">
						<MeetingDateDisplay date={meeting.meeting_date} minimal hideTime />
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<span class="badge variant-outline-primary">
							<span class="w-2">
								{meeting.rsvps?.filter((r) => r.is_attending).length}
							</span>
							<Icon icon="mdi:account" class="h-4 w-4" />
						</span>
					</svelte:fragment>
					<svelte:fragment slot="content">
						<PastMeeting {meeting} />
					</svelte:fragment>
				</AccordionItem>
			{/each}
		</Accordion>
	</div>
{/if}
