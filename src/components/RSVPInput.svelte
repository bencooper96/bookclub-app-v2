<script lang="ts">
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	export let session: Session | null;
	export let supabase: SupabaseClient;
	export let meeting: number;
	import { rsvps } from '$lib/stores/rsvps';

	$: existingRSVP = $rsvps?.find(
		(rsvp) => rsvp.user.id === session?.user.id && rsvp.meeting === meeting
	);

	async function handleRSVP(meeting: number, is_attending: boolean) {
		const { data, error } = await supabase
			.from('rsvps')
			.upsert({ id: existingRSVP?.id ?? undefined, meeting, is_attending }).select(`*, 
				user (id, display_name)`);
		if (error) {
			toastStore.trigger({
				message: 'Something went wrong, please try again later.',
				timeout: 2000,
				background: 'variant-filled-error'
			});
		} else {
			if (existingRSVP) {
				rsvps.update((rsvps) => {
					const index = rsvps.findIndex((rsvp) => rsvp.id === existingRSVP?.id);
					rsvps[index] = data[0];
					return rsvps;
				});
			} else {
				rsvps.add(data[0]);
			}
			toastStore.trigger({
				message: 'RSVP submitted!',
				timeout: 2000,
				background: 'variant-filled-success'
			});
		}
	}
</script>

<div class="flex flex-row gap-2 py-2">
	<button
		class:selected={existingRSVP ? existingRSVP?.is_attending === false : false}
		on:click={() => handleRSVP(meeting, false)}
	>
		<span class="text-2xl">😢</span>
		<span class="text-lg">Can’t make it</span>
	</button>
	<button
		class:selected={existingRSVP ? existingRSVP?.is_attending === true : false}
		on:click={() => handleRSVP(meeting, true)}
	>
		<span class="text-2xl">🤗</span>
		<span class="text-lg">I’ll be there!</span>
	</button>
</div>

<style>
	button {
		@apply flex flex-col items-center p-4 w-full;
		@apply border border-surface-900-50-token rounded-sm shadow-lg;
	}

	button:hover {
		@apply bg-surface-200-700-token;
	}

	button.selected {
		@apply bg-primary-200-700-token;
	}
</style>
