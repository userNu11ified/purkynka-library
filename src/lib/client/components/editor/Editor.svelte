<script lang="ts">
	import type { Snippet } from 'svelte';
	import Loading from '../loading/Loading.svelte';
	import Icon from '../icon/Icon.svelte';
	import {
		getEditorSearchableFieldCaseSensitive,
		setEditorSearchableFieldCaseSensitive
	} from './inputs/state/editor_field_searchable_state.svelte';

	let {
		title,
		fields,
		actions,
		showLoading,
		showCaseSensitiveSwitch,
		...props
	}: {
		title: Snippet;
		fields: Snippet;
		actions: Snippet;
		showLoading?: boolean;
		showCaseSensitiveSwitch?: boolean;
	} = $props();

	const onCaseSensitiveClick = () =>
		setEditorSearchableFieldCaseSensitive(!getEditorSearchableFieldCaseSensitive());
</script>

<div class="editor" {...props}>
	<h1 class="editor-title">{@render title()}</h1>
	<div class="editor-fields">{@render fields()}</div>
	<div class="editor-actions flex">{@render actions()}</div>
	{#if showCaseSensitiveSwitch === true}
		<button
			class="case-sensitive-toggle center-flex"
			class:toggled={getEditorSearchableFieldCaseSensitive()}
			onclick={onCaseSensitiveClick}
		>
			<Icon iconType="case-sensitive" width={24} />
			Rozlišovat vel. a mal. písmena
		</button>
	{/if}

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

	.case-sensitive-toggle {
		gap: 8px;

		position: absolute;
		left: 16px;
		bottom: 16px;

		padding: 4px 8px;
		border-radius: 4px;
	}

	.case-sensitive-toggle.toggled {
		color: var(--information-color);
	}
</style>
