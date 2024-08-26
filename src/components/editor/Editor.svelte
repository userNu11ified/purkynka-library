<script lang="ts" generics="V, E">
	import { CURRENT_PAGE_OPENED } from '$client/sidebar/sidebar';

	import { fade } from 'svelte/transition';

	import { percent } from '$client/style/css';
	import { create_editor_context, create_editor_error_context } from '$client/editor/editor';

	export let z_index = 1000;

	export let editor_width: string = percent(75);
	export let editor_height: string = 'max-content';

	export let editor_context_default = {};
	export let editor_error_context_default = {};

	export const editor_context = create_editor_context<V>(editor_context_default);
	export const editor_error_context = create_editor_error_context<E>(editor_error_context_default);
</script>

<div
	class="backdrop"
	style:z-index={z_index}
	in:fade={{ duration: 100, delay: $CURRENT_PAGE_OPENED === null ? 100 : 0 }}
>
	<div class="editor" style:--width={editor_width} style:--height={editor_height}>
		<div class="title"><slot name="title"></slot></div>
		<div class="content"><slot name="content"></slot></div>
		<div class="action-bar"><slot name="action-bar"></slot></div>
	</div>
</div>

<style>
	.backdrop {
		display: grid;
		place-items: center;

		position: absolute;
		inset: 0;

		backdrop-filter: var(--backdrop-dim-filter);
		transition: var(--backdrop-transition);
	}

	.editor {
		--field-height: 40px;
		display: grid;
		grid-template-rows: max-content auto max-content;
		gap: 12px;

		width: var(--width);
		height: var(--height);

		padding: 16px;
		border: var(--border);
		border-radius: var(--border-radius-large);

		background-color: var(--base-surface);

		color: var(--text-color);

		box-shadow: var(--box-shadow);
	}

	.title {
		margin-bottom: 8px;
		font-size: var(--font-size-huge);
		font-weight: bold;
	}

	.action-bar {
		display: flex;
		justify-content: end;
		gap: 16px;
	}
</style>
