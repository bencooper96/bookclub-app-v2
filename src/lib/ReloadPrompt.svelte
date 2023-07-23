<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	// replaced dynamically
	let buildDate = __DATE__;

	const updateInterval = 1000 * 60 * 60; // 1 hr
	const reloadSW = true;
	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		onRegistered(r) {
			if (reloadSW) {
				r &&
					setInterval(() => {
						console.log('Checking for sw update');
						r.update();
					}, updateInterval);
			} else {
				console.log(`SW Registered: ${r}`);
			}
		},
		onRegisterError(error) {
			console.log('SW registration error', error);
		}
	});
	const close = () => {
		offlineReady.set(false);
		needRefresh.set(false);
	};
</script>

<div class="pwa-date">
	{buildDate}
</div>

<style>
	.pwa-date {
		visibility: hidden;
	}
</style>
