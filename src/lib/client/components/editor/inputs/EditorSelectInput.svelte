<script lang="ts" generics="T">
	import type { EditorFieldSelectState } from './state/editor_field_select_state.svelte';

	let { state }: { state: EditorFieldSelectState<T> } = $props();

	const onOptionClick = (optionId: number) =>
		(state.selectedOptionIndex = state.selectedOptionIndex === optionId ? null : optionId);
</script>

<div class="editor-select-input-container flex">
	{#each state.selectOptions as selectOption, i (selectOption.text)}
		<button
			class="editor-select-input-option center-grid"
			class:selected={state.selectedOptionIndex === i}
			title={selectOption.title}
			onclick={() => onOptionClick(i)}
		>
			{selectOption.text}
		</button>
	{/each}
</div>

<style>
	.editor-select-input-container {
		gap: 8px;
	}

	.editor-select-input-option {
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

	.editor-select-input-option.selected {
		border-color: var(--success-color);
		color: var(--success-color);
	}
</style>
