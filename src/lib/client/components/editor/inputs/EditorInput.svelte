<script lang="ts" generics="T">
	import type { FocusEventHandler } from 'svelte/elements';
	import type { EditorFieldState } from './state/editor_field_state.svelte';

	let { state: inputState }: { focused?: boolean; state: EditorFieldState<T> } = $props();

	const errorAlignment = $derived(inputState.settings?.inputOptions?.errorAlignment);

	let editorInputContainer: HTMLDivElement | undefined = $state();
	const onContainerFocusOut: FocusEventHandler<HTMLDivElement> = (e) => {
		if (inputState.internal.disableOnFocusOut) return;
		if (e.relatedTarget !== null && editorInputContainer?.contains(e.relatedTarget as Node)) return;
		inputState.settings?.inputOptions?.onFocusOut?.();
	};
</script>

<div class="editor-input-container fill-container" bind:this={editorInputContainer}>
	<input
		class="editor-input fill-container"
		class:align-center={inputState.settings?.inputOptions?.textAlignment === 'center'}
		class:align-right={inputState.settings?.inputOptions?.textAlignment === 'right'}
		class:error={inputState.invalid}
		style:--width={inputState.settings?.inputOptions?.width}
		type="text"
		name={inputState.name}
		disabled={inputState.settings?.inputOptions?.disabled}
		required={inputState.settings?.required}
		spellcheck="false"
		autocomplete="off"
		bind:value={inputState.value}
		onfocusout={onContainerFocusOut}
	/>

	<div
		class="editor-input-errors"
		class:align-left={errorAlignment === 'left'}
		class:align-right={errorAlignment === undefined || errorAlignment === 'right'}
	>
		{#each inputState.parsed.parseErrors as parseError, i (parseError)}
			<span class="editor-input-error-number">{i + 1}.</span> {parseError}<br />
		{/each}
	</div>
</div>

<style>
	.editor-input-container {
		position: relative;

		height: var(--editor-input-height);
	}

	.editor-input {
		width: var(--width, var(--editor-input-width));
		font-size: 16px;
	}

	.editor-input.align-center {
		text-align: center;
	}

	.editor-input.align-right {
		text-align: right;
	}

	.editor-input.error {
		border-color: var(--error-color);
		outline-color: var(--error-color);
	}

	.editor-input-errors {
		visibility: hidden;

		position: absolute;
		top: 50%;
		transform: translateY(-50%);

		width: max-content;

		padding: 8px 12px;
		border: var(--border);
		border-color: var(--error-color);
		border-radius: 4px;

		line-height: 1.5;

		white-space: pre;

		filter: drop-shadow(0px 0px 8px var(--drop-shadow-color));

		z-index: 10;
	}

	.editor-input-errors.align-left {
		right: calc(100% + 8px);
	}

	.editor-input-errors.align-right {
		left: calc(100% + 8px);
	}

	.editor-input-error-number {
		color: var(--text-header);
		font-weight: bold;
	}

	.editor-input:hover + .editor-input-errors:not(:empty),
	.editor-input:focus-visible + .editor-input-errors:not(:empty) {
		visibility: visible;
	}

	.editor-input:disabled {
		color: var(--text-muted);

		cursor: not-allowed;
	}
</style>
