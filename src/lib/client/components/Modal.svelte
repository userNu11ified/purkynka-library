<script lang="ts">
	import { onClickOutside } from 'runed';
	import type { Snippet } from 'svelte';

	let {
		onClickOutside: onClickOutsideHandler,
		children
	}: { onClickOutside?: () => void; children: Snippet } = $props();

	let modal: HTMLDivElement | undefined = $state();

	// svelte-ignore state_referenced_locally
	if (onClickOutsideHandler !== undefined)
		onClickOutside(
			() => modal,
			() => onClickOutsideHandler()
		);
</script>

<div class="modal-container fill-container">
	<div class="modal-background fill-container"></div>
	<div class="modal center-grid" bind:this={modal}>{@render children()}</div>
</div>

<style>
	.modal-container {
		position: absolute;
		left: 0;
		top: 0;

		background-color: transparent;

		z-index: 10;
		isolation: isolate;
	}

	.modal-background {
		background-color: rgba(0, 0, 0, 0.25);
	}

	.modal {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		background-color: transparent;

		filter: drop-shadow(0px 0px 8px black);
	}
</style>
