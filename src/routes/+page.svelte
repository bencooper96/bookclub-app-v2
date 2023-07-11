<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import MeetingDateDisplay from '../components/MeetingDateDisplay.svelte';
	import RsvpInput from '../components/RSVPInput.svelte';
</script>

<div class="h-full">
	<AppBar>
		<svelte:fragment slot="lead">Currently Reading</svelte:fragment>
		<!-- <svelte:fragment slot="trail">Menu icon</svelte:fragment> -->
	</AppBar>
	<div class="container max-w-xl mx-auto p-4 mt-4 flex flex-col gap-4">
		<div class="mx-1">
			<h2 class="text-4xl font-bold">Klara and The Sun</h2>
			<h4 class="text-xl text-surface-800-100-token font-bold">Kazuo Ishiguro</h4>
		</div>
		<div class="container bg-surface-50-900-token p-4 rounded-sm flex flex-col gap-8">
			<div class="flex flex-col gap-1 w-full">
				<h2 class="text-lg text-surface-800-100-token font-light">This week we're reading to:</h2>
				<div class="border-l border-surface-800-100-token pl-2">
					<span class="text-2xl text-surface-800-100-token"
						>The end of Part 2, this is page 95 in my book</span
					>
				</div>
			</div>

			<div class="flex flex-col gap-1 w-full">
				<h2 class="text-lg text-surface-800-100-token font-light">Next meeting:</h2>
				<MeetingDateDisplay date="2021-10-20T19:00:00-04:00" />
				<RsvpInput />
			</div>
		</div>
	</div>
</div>
