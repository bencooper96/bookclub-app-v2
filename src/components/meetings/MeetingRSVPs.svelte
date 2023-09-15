<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { AVATAR_COLORS } from '$lib/consts/avatar';
	import { rsvpsForMeeting, type RSVP } from '$lib/stores/rsvps';
	import { getInitials } from '$lib/utils/avatarUtils';
	import { TabGroup, Tab, Avatar } from '@skeletonlabs/skeleton';
	export let meeting: number;
	export let isPast: boolean = false;
	let tabSet: number = 0;
	const dispatch = createEventDispatcher();

	// filter the RSVPs to the selected tabSet
	// 0 = attending, 1 = not attending
	$: rsvps = rsvpsForMeeting(meeting);
	$: filteredRsvps = $rsvps?.filter((rsvp) => {
		if (tabSet === 0) {
			return rsvp.is_attending;
		} else {
			return !rsvp.is_attending;
		}
	});

	function toggleAttendance(rsvp: RSVP) {
		dispatch('attendanceCorrection', { rsvpId: rsvp.id, isAttending: !rsvp.is_attending });
	}
</script>

<TabGroup>
	<Tab bind:group={tabSet} name="attending" value={0}>
		<span>{isPast ? 'Attended' : 'Attending'}</span>
		<span class="badge variant-filled ml-1">
			{$rsvps?.filter((rsvp) => rsvp.is_attending)?.length}
		</span>
	</Tab>
	<Tab bind:group={tabSet} name="not-attending" value={2}>
		<span>{isPast ? 'Did Not Attend' : 'Not Attending'}</span>
		<span class="badge variant-filled ml-1">
			{$rsvps?.filter((rsvp) => !rsvp.is_attending)?.length}
		</span>
	</Tab>
	<svelte:fragment slot="panel">
		<ul class="list p-2 bg-surface-100-800-token rounded-sm w-full">
			{#if !filteredRsvps || filteredRsvps?.length === 0}
				<li class="text-surface-700-200-token">{isPast ? '' : 'No one yet!'}</li>
			{:else}
				{#each filteredRsvps as rsvp, i}
					<li class="flex flex-row justify-between w-full">
						<div class="flex flex-row gap-2 items-center">
							<Avatar
								width="w-10"
								initials={getInitials(rsvp.user.display_name)}
								background={AVATAR_COLORS[i % AVATAR_COLORS.length]}
							/>
							<span>{rsvp.user.display_name}</span>
						</div>
						<button class="btn btn-sm" on:click={() => toggleAttendance(rsvp)}
							>{rsvp.is_attending ? "Didn't attend" : 'Attended'}</button
						>
					</li>
					{#if i < filteredRsvps.length - 1}
						<hr class="border-surface-700-200-token" />
					{/if}
				{/each}
			{/if}
		</ul>
	</svelte:fragment>
</TabGroup>
