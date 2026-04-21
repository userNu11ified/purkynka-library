<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		fields,
		actions,
		...props
	}: {
		title: Snippet;
		fields: Snippet;
		actions: Snippet;
	} = $props();
</script>

<div class="editor" {...props}>
	<h1 class="editor-title">{@render title()}</h1>
	<div class="editor-fields">{@render fields()}</div>
	<div class="editor-actions flex">{@render actions()}</div>
</div>

<style>
	.editor {
		display: grid;
		grid-template-rows: 48px auto 48px;

		padding: 16px;
		border: var(--border);
		border-radius: 8px;
	}

	.editor-fields {
		padding-block: 8px 16px;
	}

	.editor-actions {
		gap: 8px;
		justify-content: end;
	}
</style>
