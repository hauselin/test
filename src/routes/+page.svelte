<script>
	import { useChat } from "ai/svelte";
	import { onMount, onDestroy } from "svelte";

	const { input, handleSubmit, messages } = useChat();

	let streamEnded = false;
	let timeoutId;

	let n_messages = 0;
	const TIMEOUT_DURATION = 2500;

	$: if ($messages) {
		// console.log($messages);
		if ($messages.length > n_messages) {
			n_messages = $messages.length;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				streamEnded = true;
				n_messages = $messages.length;
				console.log("Streaming has ended");
			}, TIMEOUT_DURATION);
		}
	}

	onMount(() => {
		timeoutId = setTimeout(() => {
			streamEnded = true;
		}, TIMEOUT_DURATION);
	});

	onDestroy(() => {
		clearTimeout(timeoutId);
	});
</script>

<svelte:head>
	<title>Chatbot</title>
	<meta name="description" content="Svelte chatbot" />
</svelte:head>

<section>
	<h2>messages count: {n_messages}</h2>

	<div>
		{#each $messages as message}
			<p>
				{#if message.role === "user"}
					You:
				{:else if message.role === "assistant"}
					Bot:
				{/if}
				{message.content}
			</p>
		{/each}
	</div>

	<div>
		<form on:submit={handleSubmit}>
			<input bind:value={$input} />
			<button type="submit">Submit</button>
		</form>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0;
	}
</style>
