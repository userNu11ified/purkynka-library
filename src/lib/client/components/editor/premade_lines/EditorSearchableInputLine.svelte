<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import EditorLine from '../lines/EditorLine.svelte';
	import EditorSearchableInput from '../inputs/EditorSearchableInput.svelte';
	import type { EditorFieldSearchableState } from '../inputs/state/editor_field_searchable_state.svelte';

	let { state, children }: { state: EditorFieldSearchableState<T>; children?: Snippet } = $props();
</script>

<EditorLine {state}>
	<EditorSearchableInput {state}></EditorSearchableInput>
	{@render children?.()}
</EditorLine>
