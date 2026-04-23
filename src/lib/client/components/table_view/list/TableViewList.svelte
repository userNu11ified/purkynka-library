<script lang="ts" generics="T, R">
	import InfiniteList from '$client/components/infinite_list/InfiniteList.svelte';
	import { TableViewColumnManager } from '../logic/table_view_column_manager.svelte';
	import { TableViewFilterManager } from '../logic/table_view_filter_manager.svelte';
	import {
		TableViewItemManager,
		type IndexedMappedItem
	} from '../logic/table_view_item_manager.svelte';
	import { TableViewSelectionManager } from '../logic/table_view_selection_manager.svelte';

	let infiniteList: InfiniteList<IndexedMappedItem<R>> | undefined = $state();

	const tableViewColumnManager = TableViewColumnManager.context.get() as TableViewColumnManager<R>;
	const tableViewFilterManager = TableViewFilterManager.context.get();
	const tableViewItemManager = TableViewItemManager.context.get() as TableViewItemManager<T, R>;
	const tableViewSelectionManager = TableViewSelectionManager.context.get();

	const onRowMouseDown = (mappedItemIndex: number) => {
		if (tableViewSelectionManager.toggledUnselecting)
			tableViewSelectionManager.currentlySelectedMappedIndexes.delete(mappedItemIndex);
		else tableViewSelectionManager.toggleSelectState(mappedItemIndex);
		tableViewSelectionManager.currentlySelecting = mappedItemIndex;
	};

	const onRowMouseMove = (mappedItemIndex: number) => {
		if (
			tableViewSelectionManager.currentlySelecting === null ||
			tableViewSelectionManager.currentlySelecting === mappedItemIndex
		)
			return;

		if (tableViewSelectionManager.toggledUnselecting)
			tableViewSelectionManager.currentlySelectedMappedIndexes.delete(mappedItemIndex);
		else tableViewSelectionManager.currentlySelectedMappedIndexes.add(mappedItemIndex);
		tableViewSelectionManager.currentlySelecting = mappedItemIndex;
	};

	const onWindowMouseUp = () => {
		tableViewSelectionManager.currentlySelecting = null;
	};

	const onListMouseLeave = () => {
		tableViewSelectionManager.currentlySelecting = null;
	};

	export const goUp = () => infiniteList?.scrollTo(0);

	$effect(() => {
		if (tableViewFilterManager.filteredBy === null) return;

		const tableViewColumnSearcher =
			tableViewColumnManager.columns[tableViewFilterManager.filteredBy].columnSearcher;
		if (tableViewColumnSearcher.type !== 'jumper') return;

		tableViewFilterManager.jumpedTo = tableViewColumnSearcher.jumper(
			tableViewItemManager.collatedItems,
			tableViewFilterManager.queryState
		);
	});

	$effect(() => {
		infiniteList?.scrollTo(tableViewFilterManager.jumpedTo);
	});
</script>

<svelte:window onmouseup={onWindowMouseUp} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="table-view-list" onmouseleave={onListMouseLeave}>
	<InfiniteList items={tableViewItemManager.collatedItems} itemHeight={32} bind:this={infiniteList}>
		{#snippet listRow([v, mappedItemIndex], visibleRowIndex)}
			<div
				class="table-view-row fill-container inverse-grid"
				class:selected={tableViewSelectionManager.currentlySelectedMappedIndexes.has(
					mappedItemIndex
				)}
				onmousedown={() => onRowMouseDown(mappedItemIndex)}
				onmousemove={() => onRowMouseMove(mappedItemIndex)}
			>
				{#each tableViewColumnManager.columns as column (column.columnName)}
					<div
						class="table-view-column-container center-flex"
						class:even={visibleRowIndex % 2 === 0}
						class:scrolled-to={tableViewFilterManager.jumpedTo === visibleRowIndex}
						class:align-center={column.columnAlignment === 'center'}
						class:align-right={column.columnAlignment === 'right'}
					>
						<div
							class="table-view-column"
							title={column.columnRenderer.type === 'text'
								? `${column.columnRenderer.titleCreator?.(v) ?? ''}`
								: ''}
						>
							{#if column.columnRenderer.type === 'text'}
								{column.columnRenderer.textCreator(v)}
							{:else}
								{@render column.columnRenderer.snippet(v)}
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/snippet}
	</InfiniteList>
</div>

<style>
	.table-view-list {
		position: relative;
		overflow: hidden;
	}

	.table-view-row {
		position: relative;
		grid-template-columns: var(--grid-layout);

		border-bottom: var(--border);

		user-select: none;
	}

	.table-view-column-container {
		display: flex;
		align-items: center;
		justify-content: left;

		padding-inline: 8px;

		overflow: hidden;
	}

	.table-view-column-container.even {
		background-color: var(--bg-primary-alt);
	}

	.table-view-column-container.scrolled-to {
		background-color: var(--bg-jumped-to);
	}

	.table-view-row.selected {
		background-color: var(--border-selected);
		border-color: var(--border-selected);
	}

	.table-view-row.selected .table-view-column-container {
		background-color: var(--bg-selected);
	}

	.table-view-column-container.align-center {
		justify-content: center;
	}

	.table-view-column-container.align-right {
		justify-content: right;
	}

	.table-view-column {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		background-color: transparent;
	}
</style>
