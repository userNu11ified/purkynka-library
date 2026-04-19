<script lang="ts">
	import type { Snippet } from 'svelte';

	let { buttons, children }: { buttons: string[]; children: Snippet } = $props();
</script>

<div class="keyboard-shortcut center-flex">
	{@render children()}

	<div class="keyboard-buttons center-flex">
		{#each buttons as button (button)}
			<kbd class="keyboard-button">{button}</kbd>
		{/each}
	</div>
</div>

<style>
	.keyboard-shortcut {
		display: inline-flex;
		gap: 8px;

		padding-inline: 2px;
	}

	.keyboard-buttons {
		gap: 4px;
	}

	.keyboard-button {
		padding: 2px 4px;
		border: var(--border);
		border-radius: 4px;

		font-size: 10px;
		font-weight: bold;
	}
</style>
