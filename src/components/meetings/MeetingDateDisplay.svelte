<script lang="ts">
	import dayjs from 'dayjs';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import utc from 'dayjs/plugin/utc';
	import timezone from 'dayjs/plugin/timezone';

	dayjs.extend(advancedFormat);
	dayjs.extend(utc);
	dayjs.extend(timezone);
	export let date: string;
	export let minimal = false;
	export let hideTime = false;
	export let display = false;

	const dateFormat = minimal ? 'ddd, MMM D' : 'dddd, MMMM Do';

	$: nextMeeting = dayjs(date);
	$: nextMeetingDateString = nextMeeting.format(dateFormat);
	$: nextMeetingTimeString = nextMeeting.format('h:mm a');
</script>

{#if display}
	<div class="flex flex-col py-2 px-4 gradient-bg rounded-sm shadow-lg gap-2">
		<span class="text-3xl text-surface-900-50-token">
			{nextMeetingDateString}
		</span>
		<span class="text-3xl text-surface-900-50-token tracking-wider">
			{nextMeetingTimeString}
		</span>
	</div>
{:else}
	<div class="md:py-1 px-2 gradient-bg rounded shadow-xl gap-2 font-sans w-min">
		<span class="text-sm text-surface-900-50-token tracking-wider whitespace-nowrap">
			{nextMeetingDateString}
			{#if !hideTime}
				@
				{nextMeetingTimeString}
			{/if}
		</span>
	</div>
{/if}

<style>
	.gradient-bg {
		@apply bg-gradient-to-bl;
		@apply from-primary-400 via-tertiary-400 to-secondary-300;
	}
</style>
