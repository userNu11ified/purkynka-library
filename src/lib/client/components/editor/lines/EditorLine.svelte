<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { EditorFieldState } from '../inputs/state/editor_field_state.svelte';

	let { state: inputState, children }: { state: EditorFieldState<T>; children: Snippet } = $props();
</script>

<div class="editor-line">
	<div class="editor-line-label">
		{inputState.name}
		{#if inputState.settings?.required}
			<span title="Povinná" class="editor-line-name-required">*</span>
		{/if}
	</div>
	<div class="editor-line-content">{@render children()}</div>
</div>

<style>
	.editor-line {
		display: grid;
		grid-template-columns: max-content max-content;
		align-items: center;
	}

	.editor-line-label {
		width: var(--editor-input-width);
		font-weight: 500;
	}

	.editor-line-name-required {
		color: var(--error-color);

		cursor: help;
	}

	.editor-line-content {
		display: flex;
		gap: 8px;
		height: 100%;
	}
</style>
