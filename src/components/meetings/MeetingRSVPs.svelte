<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getAvatarColor } from '$lib/consts/avatar';
	import { rsvpsForMeeting, type RSVP, type User } from '$lib/stores/rsvps';
	import { getInitials } from '$lib/utils/avatarUtils';
	import { TabGroup, Tab, Avatar } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { supabase } from '$lib/supabaseClient';
	import { rsvps as rsvpStore } from '$lib/stores/rsvps';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let meeting: number;
	export let isPast: boolean = false;
	let tabSet: number = 0;
	let animate = false;
	let userDropdownOpen: boolean = false;
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

	let selectedUsers: string[] = [];
	let nonRSVPedUsers: User[] = [];

	async function loadUsers() {
		const { data, error } = await supabase.from('user_profiles').select(`*`);
		if (error) {
			console.error(error);
		} else {
			nonRSVPedUsers = data.filter((user) => {
				return !$rsvps?.find((rsvp) => rsvp.user.id === user.id);
			});
		}
	}

	async function addRSVPs() {
		const { data, error } = await supabase
			.from('rsvps')
			.insert(
				selectedUsers.map((userId) => {
					return { user: userId, meeting: meeting, is_attending: tabSet === 0 };
				})
			)
			.select(`*, user (id, display_name)`);

		if (error) {
			console.error(error);
		} else {
			rsvpStore.update((rsvps) => {
				return [...rsvps, ...data];
			});
			nonRSVPedUsers = nonRSVPedUsers.filter((user) => {
				return !selectedUsers.includes(user.id);
			});
			selectedUsers = [];
			toggleUserDropdown();
		}
	}

	function toggleUserDropdown() {
		userDropdownOpen = !userDropdownOpen;
		if (!nonRSVPedUsers.length && userDropdownOpen) loadUsers();
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
		<ul
			class="list p-2 bg-surface-100-800-token rounded-sm w-full"
			on:mouseenter={() => {
				animate = true;
			}}
			on:mouseleave={() => {
				animate = false;
			}}
		>
			{#if !filteredRsvps || filteredRsvps?.length === 0}
				<li class="text-surface-700-200-token">{isPast ? '' : 'No one yet!'}</li>
			{:else}
				{#each filteredRsvps as rsvp, i (rsvp.id)}
					<li animate:flip>
						<div
							out:fly|global={{ x: rsvp.is_attending ? 75 : -75, duration: animate ? 500 : 0 }}
							class="flex flex-row justify-between w-full"
						>
							<div class="flex flex-row gap-2 items-center">
								<Avatar
									width="w-10"
									initials={getInitials(rsvp.user.display_name)}
									background={getAvatarColor(rsvp.user.display_name)}
								/>
								<span>{rsvp.user.display_name}</span>
							</div>
							{#if isPast}
								<button class="btn btn-sm" on:click={() => toggleAttendance(rsvp)}>
									<span class="hidden sm:block">
										Move to {rsvp.is_attending ? "Didn't Attend" : 'Did Attend'}
									</span>
									<Icon
										icon={rsvp.is_attending ? 'lucide:arrow-right' : 'lucide:arrow-left'}
										class="w-4 h-4"
									/>
								</button>
							{:else}
								<span />
							{/if}
						</div>
					</li>
				{/each}
			{/if}
		</ul>
		{#if isPast}
			<div class="flex flex-row justify-center">
				{#if userDropdownOpen}
					<form
						class="flex flex-col gap-1 mt-2 max-w-sm w-full border-surface-300-600-token border-t border-b"
						on:submit={addRSVPs}
					>
						<div class="flex flex-row justify-between items-center">
							<span class="text-sm">Add users that forgot to RSVP</span>
							<button class="btn btn-icon" on:click={toggleUserDropdown}>
								<Icon icon="lucide:x" />
							</button>
						</div>
						<select class="select" multiple bind:value={selectedUsers}>
							{#each nonRSVPedUsers as user}
								<option value={user.id}>{user.display_name}</option>
							{/each}
						</select>
						<button class="btn btn-sm variant-filled" type="submit">Add</button>
					</form>
				{:else}
					<button
						on:click={toggleUserDropdown}
						class="btn btn-sm border-surface-300-600-token border-t border-b rounded-none"
					>
						Add users that forgot to RSVP
						<Icon icon="lucide:plus" class="ml-2" />
					</button>
				{/if}
			</div>
		{/if}
	</svelte:fragment>
</TabGroup>
