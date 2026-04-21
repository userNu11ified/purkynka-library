<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import EditorLine from './EditorLine.svelte';
	import type { EditorFieldState } from '../inputs/state/editor_field_state.svelte';

	let { state, children }: { state: EditorFieldState<T>; children: Snippet } = $props();
</script>

<EditorLine {state}>
	<div class="multi-line flex-column">
		{@render children()}
	</div>
</EditorLine>

<style>
	.multi-line {
		gap: 8px;

		height: max-content;
	}
</style>
