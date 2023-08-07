<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import type { Session } from '@supabase/supabase-js';

	export let closeMenu = () => {};
	export let session: Session | null;

	$: displayName = session?.user.user_metadata?.display_name;
	$: email = session?.user.email;
</script>

<div class="flex flex-col justify-between p-4 pt-10 h-full text-surface-900-50-token">
	<ul class="flex flex-col gap-4 text-2xl">
		<li>
			<a
				href="/"
				class={`flex flex-row items-center gap-1 ${$page.url.pathname == '/' && 'font-bold'}`}
				on:click={closeMenu}
			>
				<Icon icon="lucide:home" class="w-7 h-7" />
				Home
			</a>
		</li>
		<hr />
		<li>
			<a
				href="/add/book"
				class={`flex flex-row items-center gap-1 ${
					$page.url.pathname == '/add/book' && 'font-bold'
				}`}
				on:click={closeMenu}
			>
				<Icon icon="lucide:book-plus" class="w-7 h-7" />
				Add a book
			</a>
		</li>
		<li>
			<a
				href="/add/meeting"
				class={`flex flex-row items-center gap-1 ${
					$page.url.pathname == '/add/meeting' && 'font-bold'
				}`}
				on:click={closeMenu}
			>
				<Icon icon="lucide:calendar-plus" class="w-7 h-7" />
				Add a meeting
			</a>
		</li>
	</ul>

	<div id="bottom" class="flex flex-col gap-4">
		<div class="bg-surface-50-900-token p-2 rounded-md shadow-lg">
			<div class="flex flex-row justify-between items-center">
				<h3 class="text-lg font-bold uppercase text-surface-800-100-token">🚧 Coming soon</h3>
				<a href="https://github.com/bencooper96/bookclub-app-v2" target="_blank" rel="noopener">
					<Icon icon="lucide:github" class="w-5 h-5" />
				</a>
			</div>
			<hr />
			<ul class="flex flex-col gap-1 text-xl mt-1">
				<li>
					<span class="flex flex-row items-center gap-1 opacity-50">
						<Icon icon="lucide:book-copy" class="w-7 h-7" />
						Reading history
					</span>
				</li>
				<li>
					<span class="flex flex-row items-center gap-1 opacity-50">
						<Icon icon="lucide:calendar-clock" class="w-7 h-7" />
						Attendance
					</span>
				</li>
				<li>
					<span class="flex flex-row items-center gap-1 opacity-50">
						<Icon icon="lucide:calendar" class="w-7 h-7" />
						Schedule
					</span>
				</li>
			</ul>
		</div>
		<ul class="flex flex-col gap-4">
			<hr />
			<li>
				<a href={session ? '/profile' : '/auth/login'} on:click={closeMenu}>
					<div class="py-4 px-2 border border-surface-700-200-token rounded flex-row gap-2 flex">
						<Icon icon="mdi:account-circle" class="w-6 h-6" />
						<span>{session ? displayName ?? email : 'Sign In'}</span>
					</div>
				</a>
			</li>
		</ul>
	</div>
</div>
