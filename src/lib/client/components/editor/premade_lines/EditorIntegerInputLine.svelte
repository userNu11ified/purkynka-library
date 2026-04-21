<script lang="ts">
	import type { Snippet } from 'svelte';
	import EditorLine from '../lines/EditorLine.svelte';
	import EditorInput from '../inputs/EditorInput.svelte';
	import type { EditorFieldIntegerState } from '../inputs/state/editor_field_integer_state.svelte';

	let { state, children }: { state: EditorFieldIntegerState; children?: Snippet } = $props();
</script>

<EditorLine {state}>
	<EditorInput {state}></EditorInput>
	{@render children?.()}
</EditorLine>
