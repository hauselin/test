<script>
	import { useChat } from "ai/svelte";
	import { onMount, onDestroy } from "svelte";

	const { input, handleSubmit, messages } = useChat();

	let streamEnded = false;
	let timeoutId;

	let n_messages = 0;
	const TIMEOUT_DURATION = 1000;

	function sendMessageToParent(data) {
		if (typeof parent !== "undefined" && parent !== window) {
			parent.postMessage(data, "*");
		} else {
			console.log(
				"No parent frame available or running as a standalone page.",
			);
		}
	}

	$: if ($messages) {
		// console.log($messages);
		sendMessageToParent({ data: $messages });
		if ($messages.length > n_messages) {
			n_messages = $messages.length;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				streamEnded = true;
				n_messages = $messages.length;
				console.log("n_messages:", n_messages);
				console.log("Streaming has ended");
				// console.log($messages);
				// console.log(JSON.stringify($messages));
				sendMessageToParent({ data: $messages });
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
	<!-- <h2>messages count: {n_messages}</h2> -->

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
			<button type="submit">→</button>
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
	button {
		background-color: white;
		border: 1px solid #808080;
		border-radius: 0%;
	}

	input {
		border: 1px solid #808080;
	}
</style>
