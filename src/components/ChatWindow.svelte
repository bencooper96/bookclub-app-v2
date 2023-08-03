<script lang="ts">
	import { beforeUpdate, afterUpdate } from 'svelte';
	import { chat, loadMore, replyData } from '$lib/stores/messages';
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';

	let isLoading = false;
	const dispatch = createEventDispatcher();
	let div: HTMLDivElement;

	const backRead = async (e: any) => {
		let clientHeight = e.srcElement.scrollTop;
		if (clientHeight == 0) {
			isLoading = true;
			await loadMore();
			isLoading = false;
		}
	};

	const reply = async (id: string) => {
		div.scrollTo(0, div.scrollHeight);
		console.log('called reply');
	};
</script>

<div class="chat-container" class:chat-loading={isLoading}>
	<div class="chat-window" bind:this={div} on:scroll={backRead} class:disable-scroll={isLoading}>
		{#each $chat as { id, created_at, username, message, replied_to_id, replied_to_message, replied_to_username }, key}
			<div class="chat-box">
				<div class="message">
					{#key key}
						{#if replied_to_id}
							<div class="reply-box">
								<span>Replied to <b>{replied_to_username}</b></span>
								<span>{replied_to_message}</span>
							</div>
						{/if}
						<div class="message-box" {id}>
							<span>{message}</span>
							<button class="reply-btn" on:click={() => reply(id)} />
						</div>
					{/key}
					<div class="info">
						<small>
							<span class="username"> foobaer </span>
							-
							<span class="time">
								{created_at}
							</span>
						</small>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.chat-loading {
		position: relative;
	}

	.chat-loading::before {
		position: absolute;
		content: ' ';
		background: #0000005c;
		width: 100%;
		height: 100%;
		z-index: 999;
		/* display: grid;
      place-content: center;
      font-size: 40px; */
	}

	.disable-scroll {
		overflow: hidden;
		filter: blur(4px);
	}
</style>
