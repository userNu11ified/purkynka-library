<script lang="ts" generics="T, R">
	import KeyboardShortcut from '$client/components/KeyboardShortcut.svelte';
	import type { Snippet } from 'svelte';
	import { TableViewSelectionManager } from '../logic/table_view_selection_manager.svelte';
	import TableViewSelectAction from './TableViewSelectAction.svelte';
	import {
		TableViewItemManager,
		type IndexedMappedItem
	} from '../logic/table_view_item_manager.svelte';

	let {
		singleSelectActions,
		multiSelectActions
	}: {
		singleSelectActions?: Snippet<[selectedItem: IndexedMappedItem<R>]>;
		multiSelectActions?: Snippet<[selectedItems: IndexedMappedItem<R>[]]>;
	} = $props();

	const tableViewItemManager = TableViewItemManager.context.get() as TableViewItemManager<T, R>;
	const tableViewSelectionManager =
		TableViewSelectionManager.context.get() as TableViewSelectionManager<R>;

	const getSingleSelectedItem = () => {
		const singleSelectedIndex = tableViewSelectionManager.getSingleSelected()!;
		return tableViewItemManager.indexedMappedItems[singleSelectedIndex];
	};

	const getMultipleSelectedItems = () => {
		const multipleSelectedIndices = tableViewSelectionManager.getMultipleSelected();
		return multipleSelectedIndices.map((v) => tableViewItemManager.indexedMappedItems[v]);
	};

	const onCopyClick = async () => await tableViewSelectionManager.copySelection();
	const onUnselectClick = () => tableViewSelectionManager.resetSelection();
</script>

{#if tableViewSelectionManager.currentlySelectedMappedIndexes.size !== 0}
	{@const selectedSingle = tableViewSelectionManager.currentlySelectedMappedIndexes.size === 1}
	<div class="table-view-select-actions center-flex">
		<div class="table-view-select-count center-flex">
			Selected <span class="table-view-select-count-number">
				{tableViewSelectionManager.currentlySelectedMappedIndexes.size}
			</span>
		</div>
		<div class="table-view-select-actions-separator"></div>

		{#if selectedSingle && singleSelectActions !== undefined}
			<div class="table-view-single-select-actions center-flex">
				{@render singleSelectActions(getSingleSelectedItem())}
			</div>
			<div class="table-view-select-actions-separator"></div>
		{:else if !selectedSingle && multiSelectActions !== undefined}
			<div class="table-view-multi-select-actions center-flex">
				{@render multiSelectActions(getMultipleSelectedItems())}
			</div>
			<div class="table-view-select-actions-separator"></div>
		{/if}

		<div class="table-view-selection-actions center-flex">
			<TableViewSelectAction iconType="copy" onClick={onCopyClick}>
				<KeyboardShortcut buttons={['CTRL', 'C']}>Copy Selection</KeyboardShortcut>
			</TableViewSelectAction>
			<TableViewSelectAction iconType="selection-remove" onClick={onUnselectClick}>
				<KeyboardShortcut buttons={['ESC']}>Unselect</KeyboardShortcut>
			</TableViewSelectAction>
		</div>
	</div>
{/if}

<style>
	.table-view-select-actions {
		position: absolute;
		left: 50%;
		bottom: 8px;
		transform: translateX(-50%);

		display: flex;
		gap: 12px;

		height: 40px;

		padding: 4px 12px;
		border: var(--border);
		border-radius: 8px;
	}

	.table-view-select-actions-separator {
		height: 50%;
		width: var(--border-width);

		background-color: var(--border-color);
	}

	.table-view-select-count {
		gap: 6px;
		color: var(--text-muted);
	}

	.table-view-select-count-number {
		color: var(--text-header);
		font-weight: bold;
	}

	.table-view-selection-actions,
	.table-view-single-select-actions,
	.table-view-multi-select-actions {
		gap: 4px;
	}
</style>
