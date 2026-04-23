<script lang="ts">
	import type { Snippet } from 'svelte';
	import Loading from '../Loading.svelte';

	let {
		title,
		fields,
		actions,
		showLoading,
		...props
	}: {
		title: Snippet;
		fields: Snippet;
		actions: Snippet;
		showLoading?: boolean;
	} = $props();
</script>

<div class="editor" {...props}>
	<h1 class="editor-title">{@render title()}</h1>
	<div class="editor-fields">{@render fields()}</div>
	<div class="editor-actions flex">{@render actions()}</div>
	{#if showLoading === true}
		<Loading></Loading>
	{/if}
</div>

<style>
	.editor {
		position: relative;

		display: grid;
		grid-template-rows: 48px auto 48px;

		padding: 16px;
		border: var(--border);
		border-radius: 8px;

		background-color: var(--bg-primary);
	}

	.editor-fields {
		padding-block: 8px 16px;
	}

	.editor-actions {
		gap: 8px;
		justify-content: end;
	}
</style>
