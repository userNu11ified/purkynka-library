<script lang="ts">
	import ButtonWithPopup from '$client/components/ButtonWithPopup.svelte';
	import Icon, { type IconType } from '$client/components/icon/Icon.svelte';
	import type { Snippet } from 'svelte';

	let {
		iconType,
		onClick,
		disabled,
		color,
		children
	}: {
		iconType: IconType;
		onClick: () => void;
		disabled?: boolean;
		color?: 'information' | 'success' | 'warning' | 'error';
		children: Snippet;
	} = $props();
</script>

<ButtonWithPopup
	class={`table-view-select-action center-grid ${color !== undefined ? color : ''}`}
	{disabled}
	popup={children}
	onclick={onClick}
>
	<Icon {iconType} width={20} />
</ButtonWithPopup>

<style>
	:global .table-view-select-action {
		padding: 4px;
		border: var(--border);
		border-radius: 4px;
	}
	:global .table-view-select-action.information {
		color: var(--information-color);
	}

	:global .table-view-select-action.success {
		color: var(--success-color);
	}

	:global .table-view-select-action.warning {
		color: var(--warning-color);
	}

	:global .table-view-select-action.error {
		color: var(--error-color);
	}
</style>
