<script lang="ts">
	import type { Nullable } from '$shared/common_types';

	export let button_color: string;
	export let on_click: () => void;

	export let disabled: Nullable<boolean> = null;
</script>

<button class="editor-action button" style:--button-color={button_color} {disabled} on:click|self={on_click}
	><slot></slot></button
>

<style>
	.editor-action {
		display: flex;
		align-items: center;
		gap: 8px;

		height: 48px;

		padding: 8px 16px;
		border: var(--border);
		border-color: var(--button-color);
		border-radius: var(--border-radius-regular);

		color: var(--text-color);
		font-size: var(--font-size-large);
		font-weight: bold;
	}

	.editor-action:disabled {
		border-color: var(--border-color);
		color: var(--subtext-color);
		cursor: not-allowed;
	}
</style>
