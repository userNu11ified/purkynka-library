<script lang="ts">
	import type { Snippet } from 'svelte';
	import EditorSingleColumnLayout from './EditorSingleColumnLayout.svelte';

	let { left, right }: { left: Snippet; right: Snippet } = $props();
</script>

<div class="editor-double-column-layout">
	<EditorSingleColumnLayout>{@render left()}</EditorSingleColumnLayout>
	<EditorSingleColumnLayout>{@render right()}</EditorSingleColumnLayout>
</div>

<style>
	.editor-double-column-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 64px;
	}
</style>
