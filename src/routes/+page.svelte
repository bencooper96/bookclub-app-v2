<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import MeetingDateDisplay from '../components/MeetingDateDisplay.svelte';
	import RsvpInput from '../components/RSVPInput.svelte';
	import DrawerMenu from '../components/DrawerMenu.svelte';
	import Icon from '@iconify/svelte';

	export let data;
	$: ({ session } = data);
	$: nextMeeting = data?.upcoming ? data?.upcoming[0] : null;
</script>

<div class="h-full">
	<AppBar>
		<svelte:fragment slot="lead">
			<DrawerMenu {session} />
			<h1 class="ml-1 text-xl">Currently Reading</h1>
		</svelte:fragment>
	</AppBar>
	<div class="container max-w-xl mx-auto p-4 mt-4 flex flex-col gap-4">
		{#if nextMeeting}
			<div class="flex flex-row justify-between items-center">
				{#if nextMeeting.book}
					<div class="flex flex-row -mx-2">
						<Icon icon="mdi:book" class="w-16 h-16 text-surface-800-100-token" />
						<div>
							<h2 class="text-4xl -mb-1 font-bold">{nextMeeting.book?.title}</h2>
							<h4 class="text-xl text-surface-800-100-token font-bold">
								{nextMeeting.book?.author}
							</h4>
						</div>
					</div>
				{/if}
			</div>
			<div class="container bg-surface-50-900-token p-4 rounded-sm flex flex-col gap-8 shadow-xl">
				<div class="flex flex-col gap-1 w-full">
					<h2 class="text-lg text-surface-800-100-token font-light">Next meeting:</h2>
					<MeetingDateDisplay date={nextMeeting?.meeting_date} />
					<RsvpInput />
				</div>

				{#if nextMeeting?.message}
					<div class="flex flex-col gap-1 w-full">
						<h2 class="text-lg text-surface-800-100-token font-light">About this meeting:</h2>
						<div class="border-l border-surface-800-100-token pl-2">
							<span class="text-2xl text-surface-800-100-token">{nextMeeting.message}</span>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
