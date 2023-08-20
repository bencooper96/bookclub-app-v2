<script lang="ts">
	import { rsvpsForMeeting } from '$lib/stores/rsvps';
	import { getInitials } from '$lib/utils/avatarUtils';
	import { TabGroup, Tab, Avatar } from '@skeletonlabs/skeleton';
	export let meeting: number;
	let tabSet: number = 0;
	const AVATAR_COLORS = ['bg-primary-400', 'bg-secondary-400', 'bg-tertiary-400'];

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
</script>

<TabGroup>
	<Tab bind:group={tabSet} name="attending" value={0}>
		<span>Attending</span>
		<span class="badge variant-filled ml-1">
			{$rsvps?.filter((rsvp) => rsvp.is_attending)?.length}
		</span>
	</Tab>
	<Tab bind:group={tabSet} name="not-attending" value={2}>
		<span>Not Attending</span>
		<span class="badge variant-filled ml-1">
			{$rsvps?.filter((rsvp) => !rsvp.is_attending)?.length}
		</span>
	</Tab>
	<svelte:fragment slot="panel">
		<ul class="list p-2 bg-surface-100-800-token rounded-sm">
			{#if !filteredRsvps || filteredRsvps?.length === 0}
				<li class="text-surface-700-200-token">No one yet!</li>
			{:else}
				{#each filteredRsvps as rsvp, i}
					<li>
						<Avatar
							width="w-10"
							initials={getInitials(rsvp.user.display_name)}
							background={AVATAR_COLORS[i % AVATAR_COLORS.length]}
						/>
						<span>{rsvp.user.display_name}</span>
					</li>
					{#if i < filteredRsvps.length - 1}
						<hr class="border-surface-700-200-token" />
					{/if}
				{/each}
			{/if}
		</ul>
	</svelte:fragment>
</TabGroup>
