<script lang="ts">
	import type { Snippet } from 'svelte';

	let { toggled = $bindable(), children }: { toggled: boolean; children: Snippet } = $props();

	const onToggleClick = () => {
		toggled = !toggled;
	};
</script>

<button class="editor-toggle center-grid" class:toggled onclick={onToggleClick}>
	{@render children()}
</button>

<style>
	.editor-toggle {
		height: var(--editor-input-height);
		min-width: var(--editor-input-height);
		width: max-content;

		padding-inline: 12px;
		border: var(--border);
		border-radius: 4px;

		color: var(--text-muted);
		font-size: 16px;
		font-weight: bold;
	}

	.editor-toggle.toggled {
		border-color: var(--success-color);
		color: var(--success-color);
	}
</style>
