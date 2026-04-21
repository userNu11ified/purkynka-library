<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import EditorLine from '../lines/EditorLine.svelte';
	import type { EditorFieldSelectState } from '../inputs/state/editor_field_select_state.svelte';
	import EditorSelectInput from '../inputs/EditorSelectInput.svelte';

	let { state, children }: { state: EditorFieldSelectState<T>; children?: Snippet } = $props();
</script>

<EditorLine {state}>
	<EditorSelectInput {state}></EditorSelectInput>
	{@render children?.()}
</EditorLine>
