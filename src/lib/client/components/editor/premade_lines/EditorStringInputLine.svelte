<script lang="ts">
	import type { Snippet } from 'svelte';
	import EditorLine from '../lines/EditorLine.svelte';
	import type { EditorFieldStringState } from '../inputs/state/editor_field_string_state.svelte';
	import EditorInput from '../inputs/EditorInput.svelte';

	let { state, children }: { state: EditorFieldStringState; children?: Snippet } = $props();
</script>

<EditorLine {state}>
	<EditorInput {state}></EditorInput>
	{@render children?.()}
</EditorLine>
