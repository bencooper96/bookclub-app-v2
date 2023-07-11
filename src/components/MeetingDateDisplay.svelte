<script lang="ts">
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import utc from 'dayjs/plugin/utc';
	import timezone from 'dayjs/plugin/timezone';

	dayjs.extend(advancedFormat);
	dayjs.extend(utc);
	dayjs.extend(timezone);
	export let date: string;

	$: nextMeeting = dayjs(date);
	$: nextMeetingDateString = nextMeeting.format('dddd, MMM D');
	$: nextMeetingTimeString = nextMeeting.format('h:mm A z');
</script>

<div class="flex flex-col py-2 px-4 gradient-bg rounded-sm shadow-lg gap-2">
	<span class="text-3xl text-surface-900-50-token tracking-wider">
		{nextMeetingDateString}
	</span>
	<span class="text-3xl text-surface-900-50-token tracking-wider">
		{nextMeetingTimeString}
	</span>
</div>

<style>
	.gradient-bg {
		@apply bg-gradient-to-bl;
		@apply from-primary-400 via-tertiary-400 to-secondary-300;
	}
</style>
