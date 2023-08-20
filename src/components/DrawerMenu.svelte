<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	import type { Session } from '@supabase/supabase-js';
	import SideMenu from './SideMenu.svelte';

	export let session: Session | null;

	const drawerSettings: DrawerSettings = {
		id: 'menu-drawer',
		position: 'left',
		bgDrawer: 'bg-secondary-200-700-token text-white',
		bgBackdrop: 'bg-gradient-to-tr from-indigo-500/50 via-purple-500/50 to-pink-500/50',
		width: 'w-[280px]',
		padding: 'p-1',
		rounded: 'rounded'
	};
	const closeMenu = () => drawerStore.close();
	const openMenu = () => drawerStore.open(drawerSettings);
</script>

<button on:click={openMenu}>
	<Icon icon="lucide:menu" class="w-6 h-6" />
</button>
<Drawer class="z-50">
	<SideMenu {closeMenu} {session} />
</Drawer>
