<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { UIEventHandler } from 'svelte/elements';

	let {
		children,
		actionColor = 'default',
		disabled,
		onClick
	}: {
		children: Snippet;
		actionColor?: 'default' | 'information' | 'success' | 'warning' | 'error';
		disabled?: boolean;
		onClick: () => void;
	} = $props();

	let editorAction: HTMLButtonElement | undefined = $state();
	const onActionClick: UIEventHandler<HTMLButtonElement> = (e) => {
		if (e.target === editorAction) onClick();
	};
</script>

<button
	class="editor-action"
	class:information={actionColor === 'information'}
	class:success={actionColor === 'success'}
	class:warning={actionColor === 'warning'}
	class:error={actionColor === 'error'}
	onclick={onActionClick}
	{disabled}
	bind:this={editorAction}
>
	{@render children()}
</button>

<style>
	.editor-action {
		height: 48px;
		padding: 8px 16px;

		border: var(--border);
		border-width: 2px;
		border-radius: 8px;

		font-size: 16px;
		font-weight: bold;
	}

	.editor-action:hover {
		background-color: unset;
	}

	.editor-action:not(:disabled):hover:not(:has(:hover)) {
		background-color: var(--bg-hover);
	}

	.editor-action.information {
		border-color: var(--information-color);
	}

	.editor-action.success {
		border-color: var(--success-color);
	}

	.editor-action.warning {
		border-color: var(--warning-color);
	}

	.editor-action.error {
		border-color: var(--error-color);
	}

	.editor-action:disabled {
		border-color: var(--border-color);
		color: var(--text-disabled);
		cursor: not-allowed;
	}
</style>
