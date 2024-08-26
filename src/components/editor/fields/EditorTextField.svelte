<script lang="ts">
	import type { BookEditorContext, BookEditorErrorContext } from '$client/editors/book_editor';
	import { get_editor_context, get_editor_error_context } from '$client/editor/editor';
	import type { ErrorChecker, InputSnapshot } from '$client/editor/error_checkers';
	import { percent } from '$client/style/css';
	import type { Nullable } from '$shared/common_types';

	export let width: string = percent(100);
	export let center: Nullable<boolean> = null;
	export let disabled: Nullable<boolean> = null;
	export let placeholder: Nullable<string> = null;
	export let flex: Nullable<boolean> = null;
	export let input_type: 'text' | 'password' = 'text';

	export let value: Nullable<string>;
	value ??= '';

	const editor_context = get_editor_context<BookEditorContext>();
	export let context_field: Nullable<string> = null;

	const update_context = (value: string) => {
		if (context_field === null) return;

		editor_context.update((v) => {
			v[context_field] = value === '' ? null : value;
			return v;
		});
	};

	$: update_context(value!);

	// FOCUS
	let focused = false;
	const on_focus_in = () => (focused = true);
	const on_focus_out = () => (focused = false);

	// ERROR CHECKING
	export let error_checkers: ErrorChecker[] = [];
	const editor_error_context = get_editor_error_context<BookEditorErrorContext>();

	const check_errors = (editor_context: BookEditorContext, string_value: string) => {
		if (error_checkers.length === 0 || context_field == null) return;

		editor_error_context.update((v) => {
			const errors = new Set<string>();

			const snapshot: InputSnapshot = {
				context_value: editor_context[context_field],
				string_value,
				special_adder: false
			};

			error_checkers.forEach((error_checker) => {
				const error_value = error_checker(snapshot);
				if (error_value !== null) errors.add(error_value);
			});

			v[context_field] = errors;
			return v;
		});
	};

	const get_errors = (error_context: BookEditorErrorContext) => {
		if (context_field === null || error_context[context_field] === undefined) return null;
		const error_array = [...error_context[context_field].values()];
		return error_array.length === 0 ? null : error_array;
	};

	$: check_errors($editor_context, value!);
	$: errors = get_errors($editor_error_context);
</script>

<div class="editor-text-field" class:flex style:--width={width}>
	{#if errors !== null}
		<div class="error" class:visible={focused}>
			<div class="error-text">
				{#each errors as error, i}
					<div class="line">{error}</div>
				{/each}
			</div>
		</div>
	{/if}
	{#if input_type === 'text'}
		<input
			class="text-field"
			class:center
			type="text"
			{disabled}
			{placeholder}
			bind:value
			on:focusin
			on:focusout
			on:focusin={on_focus_in}
			on:focusout={on_focus_out}
		/>
	{:else if input_type === 'password'}
		<input
			class="text-field"
			class:center
			type="password"
			{disabled}
			{placeholder}
			bind:value
			on:focusin
			on:focusout
			on:focusin={on_focus_in}
			on:focusout={on_focus_out}
		/>
	{/if}
</div>

<style>
	.editor-text-field {
		flex: 0 0 auto;

		position: relative;
		width: var(--width);

		&.flex {
			flex: 1 1 auto;
		}

		&:hover .error-text {
			display: block;
		}
	}

	.text-field {
		width: 100%;
		height: var(--field-height);

		border: var(--border);
		border-radius: var(--border-radius-regular);

		color: var(--text-color);

		&:disabled {
			color: var(--subtext-color);
			cursor: not-allowed;
		}

		&:-webkit-autofill,
		&:-webkit-autofill:hover,
		&:-webkit-autofill:focus,
		&:-webkit-autofill:active {
			-webkit-background-clip: text;
			-webkit-text-fill-color: var(--text-color);
			box-shadow: inset 0 0 20px 20px var(--base-surface);
		}
	}

	.center {
		text-align: center;
	}

	.error {
		position: absolute;
		top: 0;
		left: 0;

		width: 100%;
		height: var(--field-height);

		border: var(--border);
		border-color: var(--error-600);
		border-radius: var(--border-radius-regular);

		pointer-events: none;

		&.visible .error-text {
			display: block;
		}
	}

	.error-text {
		display: none;

		position: absolute;
		left: calc(100% + 8px);
		top: 50%;

		transform: translateY(-50%);

		width: max-content;

		padding: 8px 16px;
		border: var(--border);
		border-color: var(--error-600);
		border-radius: var(--border-radius-regular);

		background-color: var(--base-surface);

		color: var(--text-color);
	}
</style>
