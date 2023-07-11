<script lang="ts">
	function handleRSVP(response: boolean) {
		console.log('RSVP', response);
	}
</script>

<div class="flex flex-row gap-2 py-2">
	<button class="hover:bg-surface-200-700-token" on:click={() => handleRSVP(false)}>
		<span>😢</span>
		<span>Can’t make it</span>
	</button>
	<button class="hover:bg-surface-200-700-token" on:click={() => handleRSVP(true)}>
		<span>🤗</span>
		<span>I’ll be there!</span>
	</button>
</div>

<style>
	button {
		@apply flex flex-col items-center p-4 w-full;
		@apply border border-surface-900-50-token rounded-sm shadow-lg;
	}
</style>
