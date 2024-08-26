<script lang="ts" generics="T">
	import type { BookEditorContext } from '$client/editors/book_editor';
	import { get_editor_context } from '$client/editor/editor';
	import type { DatabaseBook } from '$shared/book_types';
	import type { Nullable } from '$shared/common_types';
	import Horizontal from '../layouts/Horizontal.svelte';
	import EditorToggle from './EditorToggle.svelte';

	export let items: T[];
	export let item_stringifier: (item: T) => string = (item) => `${item}`;

	export let value: Nullable<number>;

	const on_click = (id: number) => (value = value === id ? null : id);

	export let context_field: Nullable<string>;
	const editor_context = get_editor_context<BookEditorContext>();

	const update_context = (value: Nullable<number>) => {
		if (context_field === null) return;
		editor_context.update((v) => {
			v[context_field] = value;
			return v;
		});
	};

	$: update_context(value);
</script>

<Horizontal>
	{#each items as item, i}
		<EditorToggle context_field={null} value={value === i} on_click={() => on_click(i)}
			>{item_stringifier(item)}</EditorToggle
		>
	{/each}
</Horizontal>
