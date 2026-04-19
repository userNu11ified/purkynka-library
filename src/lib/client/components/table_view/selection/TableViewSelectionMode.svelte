<script lang="ts">
	import Icon from '$client/components/icon/Icon.svelte';
	import { TableViewSelectionManager } from '../logic/table_view_selection_manager.svelte';

	const tableViewSelectionManager = TableViewSelectionManager.context.get();
</script>

{#if tableViewSelectionManager.currentlySelecting !== null}
	<div
		class="selection-mode center-grid"
		class:selecting={!tableViewSelectionManager.toggledUnselecting}
		class:unselecting={tableViewSelectionManager.toggledUnselecting}
		style:--left={`${tableViewSelectionManager.mousePosition[0]}px`}
		style:--top={`${tableViewSelectionManager.mousePosition[1]}px`}
	>
		<Icon iconType={tableViewSelectionManager.toggledUnselecting ? 'remove' : 'add'} width={20} />
	</div>
{/if}

<style>
	.selection-mode {
		position: absolute;
		top: calc(var(--top) + 16px);
		left: calc(var(--left) + 16px);

		width: 32px;
		height: 32px;

		border: var(--border);
		border-radius: 4px;

		pointer-events: none;

		z-index: 10;
	}

	.selection-mode.selecting {
		color: var(--success-color);
	}

	.selection-mode.unselecting {
		color: var(--error-color);
	}
</style>
