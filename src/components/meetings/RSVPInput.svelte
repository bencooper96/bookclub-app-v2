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
	$: isAttending = existingRSVP?.is_attending;
	$: isNotAttending = existingRSVP?.is_attending === false;

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

<div class="relative overflow-x-visible">
	{#if !session}
		<div class="absolute inset-0 p-4 -m-2 backdrop-blur-sm grid place-items-center">
			<a
				class="card p-2 bg-surface-100-800-token rounded-sm border-surface-500 border-2"
				href="/auth/login"
			>
				<span class="text-2xl mr-1">✋</span>
				<span class="text-lg">You must be signed in to RSVP</span>
			</a>
		</div>
	{/if}
	<div class="flex flex-row gap-2 py-2">
		<button
			class="rsvp-input"
			class:selected={isAttending}
			on:click={() => (isAttending ? () => {} : handleRSVP(meeting, true))}
		>
			<span class="text-2xl">🤗</span>
			<span class="text-lg">I’ll be there!</span>
		</button>
		<button
			class="rsvp-input"
			class:selected={isNotAttending}
			on:click={() => (isNotAttending ? () => {} : handleRSVP(meeting, false))}
		>
			<span class="text-2xl">😢</span>
			<span class="text-lg">Can’t make it</span>
		</button>
	</div>
</div>

<style>
	.rsvp-input {
		@apply border border-surface-900-50-token rounded-sm shadow-lg;
		@apply flex flex-col items-center p-4 w-full;
	}

	.rsvp-input:hover {
		@apply bg-surface-200-700-token;
	}

	button.selected {
		@apply bg-primary-200-700-token;
	}
</style>
