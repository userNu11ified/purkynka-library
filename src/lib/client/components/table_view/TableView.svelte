<script lang="ts">
	import type { TableViewColumn } from './logic/table_view_column';
	import TableViewList from './list/TableViewList.svelte';
	import TableViewStatusBar from './TableViewStatusBar.svelte';
	import TableViewSorters from './header/TableViewSorters.svelte';
	import TableViewFilters from './header/TableViewFilters.svelte';
	import { TableViewSortManager } from './logic/table_view_sort_manager.svelte';
	import { TableViewFilterManager } from './logic/table_view_filter_manager.svelte';
	import { TableViewColumnManager } from './logic/table_view_column_manager.svelte';
	import { onMount } from 'svelte';

	const {
		renderAfterResolved,
		columns
	}: {
		renderAfterResolved: Promise<void>;
		columns: TableViewColumn[];
	} = $props();

	// svelte-ignore state_referenced_locally
	const tableViewColumnManager = TableViewColumnManager.context.set(
		new TableViewColumnManager(columns)
	);

	TableViewSortManager.context.set(new TableViewSortManager());
	TableViewFilterManager.context.set(new TableViewFilterManager());

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
