<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="editor-single-column-layout flex-column">
	{@render children()}
</div>

<style>
	.editor-single-column-layout {
		gap: 8px;
	}
</style>
