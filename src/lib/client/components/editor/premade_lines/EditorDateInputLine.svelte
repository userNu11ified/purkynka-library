<script lang="ts">
	import type { Snippet } from 'svelte';
	import EditorLine from '../lines/EditorLine.svelte';
	import type { EditorFieldDateState } from '../inputs/state/editor_field_date_state.svelte';
	import EditorInput from '../inputs/EditorInput.svelte';

	let { state, children }: { state: EditorFieldDateState; children?: Snippet } = $props();
</script>

<EditorLine {state}>
	<EditorInput {state}></EditorInput>
	{@render children?.()}
</EditorLine>
