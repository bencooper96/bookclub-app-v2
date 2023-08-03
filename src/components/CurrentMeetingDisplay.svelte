<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import Icon from '@iconify/svelte';
	import MeetingDateDisplay from './MeetingDateDisplay.svelte';
	import MeetingRSVPs from './MeetingRSVPs.svelte';
	import RsvpInput from './RSVPInput.svelte';
	import type { Session } from '@supabase/supabase-js';

	export let currentMeeting;
	export let session: Session | null;
</script>

<div class="flex flex-row justify-between items-center">
	{#if $currentMeeting.book}
		<div class="flex flex-row -mx-2">
			<Icon icon="mdi:book" class="w-16 h-16 text-surface-800-100-token" />
			<div>
				<h2 class="text-4xl -mb-1 font-bold">{$currentMeeting.book?.title}</h2>
				<h4 class="text-xl text-surface-800-100-token font-bold">
					{$currentMeeting.book?.author}
				</h4>
			</div>
		</div>
	{/if}
</div>
<div class="container bg-surface-50-900-token p-4 rounded-sm flex flex-col gap-8 shadow-xl">
	<div class="flex flex-col gap-6 w-full overflow-x-visible">
		<div class="flex flex-col gap-1 w-full">
			<h2 class="text-lg text-surface-800-100-token font-light">Next meeting:</h2>
			<MeetingDateDisplay date={$currentMeeting.meeting_date} />
		</div>
		<RsvpInput {session} {supabase} meeting={$currentMeeting.id} />
		<MeetingRSVPs meeting={$currentMeeting.id} />
	</div>

	{#if $currentMeeting?.message}
		<div class="flex flex-col gap-1 w-full">
			<h2 class="text-lg text-surface-800-100-token font-light">About this meeting:</h2>
			<div class="border-l border-surface-800-100-token pl-2">
				<span class="text-2xl text-surface-800-100-token">{$currentMeeting.message}</span>
			</div>
		</div>
	{/if}
</div>
