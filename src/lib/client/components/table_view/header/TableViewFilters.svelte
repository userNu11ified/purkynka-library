<script lang="ts">
	import { TableViewColumnManager } from '../logic/table_view_column_manager.svelte';
	import { TableViewFilterManager } from '../logic/table_view_filter_manager.svelte';

	const tableViewColumnManager = TableViewColumnManager.context.get();
	const tableViewFilterManager = TableViewFilterManager.context.get();

	const onFilterClick = (filterIndex: number) => {
		tableViewFilterManager.currentQueries[filterIndex] = '';

		tableViewFilterManager.jumpedTo = null;
		tableViewFilterManager.filteredBy = null;
		tableViewFilterManager.filterQuery = '';
	};

	const onFilterInput = (filterIndex: number) => {
		if (
			tableViewFilterManager.filteredBy !== null &&
			tableViewFilterManager.filteredBy !== filterIndex
		)
			tableViewFilterManager.currentQueries[tableViewFilterManager.filteredBy] = '';

		const trimmedQuery = tableViewFilterManager.currentQueries[filterIndex].trim();
		const emptyQuery = trimmedQuery.length === 0;

		if (tableViewFilterManager.filteredBy !== filterIndex || emptyQuery)
			tableViewFilterManager.jumpedTo = null;
		tableViewFilterManager.filteredBy = emptyQuery ? null : filterIndex;
		tableViewFilterManager.filterQuery = trimmedQuery;
	};
</script>

<div class="table-view-filters inverse-grid">
	{#each tableViewColumnManager.columns as column, i (column.columnName)}
		<input
			class="table-view-filter"
			type="text"
			placeholder={`${column.columnName}...`}
			bind:value={tableViewFilterManager.currentQueries[i]}
			onclick={() => onFilterClick(i)}
			oninput={() => onFilterInput(i)}
		/>
	{/each}
	<div class="table-view-filter-filler"></div>
</div>

<style>
	.table-view-filters {
		grid-template-columns: var(--grid-layout) var(--scrollbar-width);

		height: 32px;
	}

	.table-view-filter {
		border: none;
		border-radius: 0;

		text-align: center;
	}
</style>
