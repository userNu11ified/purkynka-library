<script lang="ts">
	import type { BookEditorContext } from '$client/editors/book_editor';
	import { get_editor_context } from '$client/editor/editor';
	import type { Nullable } from '$shared/common_types';

	export let context_field: Nullable<string>;
	const editor_context = get_editor_context<BookEditorContext>();

	export let value: Nullable<boolean>;
	value ??= false;

	export let padding: Nullable<boolean> = null;

	const update_context = (value: boolean) => {
		if (context_field === null) return;

		editor_context.update((v) => {
			v[context_field] = value;

			return v;
		});
	};

	$: update_context(value!);

	export let on_change: (value: boolean) => void = () => {};
	export let on_click: () => void = () => {
		value = !value;
		on_change(value);
	};
</script>

<button class="editor-toggle button" class:toggled={value} class:padding on:click={on_click}>
	{#if !$$slots['default']}
		{#if value}
			<slot name="on"></slot>
		{:else}
			<slot name="off"></slot>
		{/if}
	{:else}
		<slot></slot>
	{/if}
</button>

<style>
	.editor-toggle {
		display: grid;
		place-items: center;

		flex: 0 0 auto;
		min-width: var(--field-height);
		width: max-content;
		height: var(--field-height);

		border: var(--border);
		border-radius: var(--border-radius-regular);

		font-weight: bold;
		color: var(--subtext-color);
	}

	.padding {
		padding-inline: 12px;
	}

	.toggled {
		border-color: var(--success-700);
		color: var(--success-700);
	}
</style>
