<script lang="ts" generics="T, R">
	import type { TableViewColumn } from './logic/table_view_column';
	import TableViewList from './list/TableViewList.svelte';
	import TableViewStatusBar from './TableViewStatusBar.svelte';
	import TableViewSorters from './header/TableViewSorters.svelte';
	import TableViewFilters from './header/TableViewFilters.svelte';
	import { TableViewSortManager } from './logic/table_view_sort_manager.svelte';
	import { TableViewFilterManager } from './logic/table_view_filter_manager.svelte';
	import { TableViewColumnManager } from './logic/table_view_column_manager.svelte';
	import { onMount } from 'svelte';
	import { TableViewItemManager, type ItemMapper } from './logic/table_view_item_manager.svelte';

	const {
		renderAfterResolved,
		items,
		itemMapper,
		columns
	}: {
		renderAfterResolved: Promise<void>;
		items: T[];
		itemMapper: ItemMapper<T, R>;
		columns: TableViewColumn<R>[];
	} = $props();

	const tableViewColumnManager = TableViewColumnManager.context.set(
		new TableViewColumnManager(() => columns) as TableViewColumnManager<unknown>
	);

	TableViewSortManager.context.set(new TableViewSortManager());
	TableViewFilterManager.context.set(new TableViewFilterManager());

	TableViewItemManager.context.set(
		new TableViewItemManager(
			() => items,
			() => itemMapper
		) as TableViewItemManager<unknown, unknown>
	);

	onMount(() => {
		tableViewColumnManager.resetColumnSizes();
	});
</script>

<div
	class="table-view-container fill-container"
	bind:clientWidth={tableViewColumnManager.availableWidth}
>
	{#await renderAfterResolved}
		<h1>Loading</h1>
	{:then}
		<div
			class="table-view fill-container inverse-grid"
			style:--grid-layout={tableViewColumnManager.calculatedGridLayout}
		>
			<div class="table-view-content inverse-grid">
				<div class="table-view-header inverse-grid">
					<TableViewSorters />
					<TableViewFilters />
				</div>
				<TableViewList></TableViewList>
			</div>
			<TableViewStatusBar></TableViewStatusBar>
		</div>
	{/await}
</div>

<style>
	.table-view-container {
		overflow: hidden;
	}

	.table-view {
		grid-template-rows: auto 24px;
	}

	.table-view-content {
		grid-template-rows: max-content auto;

		overflow-x: auto;
	}
</style>
