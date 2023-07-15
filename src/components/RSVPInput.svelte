<script lang="ts">
	function handleRSVP(response: boolean) {
		console.log('RSVP', response);
	}
</script>

<div class="flex flex-row gap-2 py-2">
	<button on:click={() => handleRSVP(false)}>
		<span class="text-2xl">😢</span>
		<span class="text-lg">Can’t make it</span>
	</button>
	<button on:click={() => handleRSVP(true)}>
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
</style>
