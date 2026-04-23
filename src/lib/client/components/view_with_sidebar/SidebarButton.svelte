<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { IconType } from '../icon/Icon.svelte';
	import { getSidebarExpanded } from './ViewWithSidebar.svelte';
	import Icon from '../icon/Icon.svelte';

	let {
		iconType,
		iconWidth = 28,
		active,
		disabled,
		onClick,
		children
	}: {
		iconType: IconType;
		iconWidth?: number;
		active: boolean;
		disabled?: boolean;
		onClick: () => void;
		children: Snippet;
	} = $props();
</script>

<button class="sidebar-button center-flex flex-column" class:active {disabled} onclick={onClick}>
	<Icon {iconType} width={iconWidth} />
	{#if getSidebarExpanded().current}
		<span class="sidebar-button-text">{@render children()}</span>
	{/if}
</button>

<style>
	.sidebar-button {
		gap: 4px;

		width: 100%;
		aspect-ratio: 1;
	}

	.sidebar-button:disabled {
		color: var(--text-disabled);

		cursor: not-allowed;
	}

	.sidebar-button:disabled:hover {
		background-color: unset;
	}

	.sidebar-button-text {
		font-size: 12px;
		font-weight: 500;
	}

	.active {
		color: var(--text-link);
	}
</style>
