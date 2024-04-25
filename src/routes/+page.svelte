<script>
	import { useChat } from "ai/svelte";
	import { onMount, onDestroy } from "svelte";
	import { Button, FormInput, Input } from "yesvelte";

	const { input, handleSubmit, messages } = useChat();

	let streamEnded = false;
	let timeoutId;
	let messagesDiv;

	let n_messages = 0;
	const TIMEOUT_DURATION = 1000;

	const scrollToBottom = async (node) => {
		console.log(node);
		node.scroll({ top: node.scrollHeight, behavior: "smooth" });
	};

	function sendMessageToParent(data) {
		if (typeof parent !== "undefined" && parent !== window) {
			parent.postMessage(data, "*");
		} else {
			console.log(
				"No parent frame available or running as a standalone page.",
			);
		}
	}

	$: if ($messages && messagesDiv) {
		// console.log($messages);
		scrollToBottom(messagesDiv);
		console.log(messagesDiv);

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

	<div class="messages" bind:this={messagesDiv}>
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

	<form on:submit={handleSubmit}>
		<FormInput placeholder="Send a message..." bind:value={$input}>
			<Button color="blue" slot="end" type="submit">&#x2192;</Button>
		</FormInput>
	</form>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0;
	}
	.messages {
		margin: 1rem;
		overflow-y: auto;
		max-height: 350px;
		/* height: 500px; */
		width: 377px;
	}
</style>
