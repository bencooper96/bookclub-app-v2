<script lang="ts">
	import type { Meeting } from '$lib/stores/meetings';
	import Icon from '@iconify/svelte';
	import MeetingDateDisplay from './MeetingDateDisplay.svelte';
	import { Accordion, AccordionItem, Avatar } from '@skeletonlabs/skeleton';
	import { getInitials } from '$lib/utils/avatarUtils';
	import { AVATAR_COLORS } from '$lib/consts/avatar';

	export let pastMeetings: Meeting[];
</script>

{#if pastMeetings?.length > 0}
	<div class="container max-w-xl mx-auto p-4 flex flex-col gap-4">
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
						{#if meeting.rsvps?.filter((r) => r.is_attending) && meeting.rsvps?.filter((r) => r.is_attending).length > 0}
							<h3 class="text-surface-700-200-token">Users who attended:</h3>
							<ul class="list p-2 bg-surface-100-800-token rounded-sm">
								{#each meeting.rsvps?.filter((r) => r.is_attending) as rsvp, i}
									<li>
										<Avatar
											width="w-10"
											initials={getInitials(rsvp.user.display_name)}
											background={AVATAR_COLORS[i % AVATAR_COLORS.length]}
										/>
										<span>{rsvp.user.display_name}</span>
									</li>
									{#if i < meeting.rsvps?.filter((r) => r.is_attending).length - 1}
										<hr class="border-surface-700-200-token" />
									{/if}
								{/each}
							</ul>
						{:else}
							<p class="text-surface-700-200-token">No one RSVPed to this meeting</p>
						{/if}
					</svelte:fragment>
				</AccordionItem>
			{/each}
		</Accordion>
	</div>
{/if}
