<script lang="ts" generics="T, R">
	import InfiniteList from '$client/components/infinite_list/InfiniteList.svelte';
	import { TableViewColumnManager } from '../logic/table_view_column_manager.svelte';
	import { TableViewFilterManager } from '../logic/table_view_filter_manager.svelte';
	import {
		TableViewItemManager,
		type IndexedMappedItem
	} from '../logic/table_view_item_manager.svelte';
	import { TableViewSortManager } from '../logic/table_view_sort_manager.svelte';

	let infiniteList: InfiniteList<IndexedMappedItem<R>> | undefined = $state();

	const tableViewColumnManager = TableViewColumnManager.context.get() as TableViewColumnManager<R>;
	const tableViewSortManager = TableViewSortManager.context.get();
	const tableViewFilterManager = TableViewFilterManager.context.get();
	const tableViewItemManager = TableViewItemManager.context.get() as TableViewItemManager<T, R>;

	const shallowCopyIndexedMappedItems = () => tableViewItemManager.indexedMappedItems.slice();

	const getFilteredItems = () => {
		if (tableViewFilterManager.filteredBy === null) return shallowCopyIndexedMappedItems();

		const tableViewColumnSearcher =
			tableViewColumnManager.columns[tableViewFilterManager.filteredBy].columnSearcher;
		if (tableViewColumnSearcher.type === 'jumper') return shallowCopyIndexedMappedItems();

		return shallowCopyIndexedMappedItems().filter(([v]) =>
			tableViewColumnSearcher.filter(v, tableViewFilterManager.queryState)
		);
	};

	const collatedItems = $derived.by(() => {
		const filteredItems = getFilteredItems();

		filteredItems.sort(
			(l, r) =>
				tableViewColumnManager.columns[tableViewSortManager.sortedBy].columnSorter(l[0], r[0]) *
				(tableViewSortManager.sortedDescending ? -1 : 1)
		);

		return filteredItems;
	});

	$effect(() => {
		if (tableViewFilterManager.filteredBy === null) return;

		const tableViewColumnSearcher =
			tableViewColumnManager.columns[tableViewFilterManager.filteredBy].columnSearcher;
		if (tableViewColumnSearcher.type !== 'jumper') return;

		tableViewFilterManager.jumpedTo = tableViewColumnSearcher.jumper(
			collatedItems,
			tableViewFilterManager.queryState
		);
	});

	$effect(() => {
		infiniteList?.scrollTo(tableViewFilterManager.jumpedTo);
	});
</script>

<div class="table-view-list">
	<InfiniteList items={collatedItems} itemHeight={32} bind:this={infiniteList}>
		{#snippet listRow([v], i)}
			<div class="table-view-row fill-container inverse-grid">
				{#each tableViewColumnManager.columns as column (column.columnName)}
					<div
						class="table-view-column-container center-flex"
						class:scrolled-to={tableViewFilterManager.jumpedTo === i}
						class:align-center={column.columnAlignment === 'center'}
						class:align-right={column.columnAlignment === 'right'}
					>
						<div class="table-view-column">
							{#if column.columnRenderer.type === 'text'}
								{column.columnRenderer.textCreator(v)}
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/snippet}
	</InfiniteList>
</div>

<style>
	.table-view-row {
		grid-template-columns: var(--grid-layout);

		border-bottom: var(--border);
	}

	.table-view-column-container {
		display: flex;
		align-items: center;
		justify-content: left;

		padding-inline: 8px;

		overflow: hidden;
	}

	.table-view-column-container.scrolled-to {
		background-color: var(--bg-jumped-to);
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
