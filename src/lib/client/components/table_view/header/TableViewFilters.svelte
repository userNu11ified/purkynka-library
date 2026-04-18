<script lang="ts">
	import { TableViewColumnManager } from '../logic/table_view_column_manager.svelte';
	import { TableViewFilterManager } from '../logic/table_view_filter_manager.svelte';

	const tableViewColumnManager = TableViewColumnManager.context.get();
	const tableViewFilterManager = TableViewFilterManager.context.get();

	const currentQueries: string[] = $state(
		Array.from({ length: tableViewColumnManager.columns.length }, () => '')
	);

	const onFilterInput = (filterIndex: number) => {
		currentQueries.forEach((_, i) => {
			if (i !== filterIndex) currentQueries[i] = '';
		});

		const trimmedQuery = currentQueries[filterIndex].trim();
		tableViewFilterManager.filteredBy = trimmedQuery.length === 0 ? null : filterIndex;
		tableViewFilterManager.filterQuery = trimmedQuery;
	};
</script>

<div class="table-view-filters inverse-grid">
	{#each tableViewColumnManager.columns as column, i (column.columnName)}
		<input
			class="table-view-filter"
			type="text"
			placeholder={`${column.columnName}...`}
			bind:value={currentQueries[i]}
			oninput={() => onFilterInput(i)}
		/>
	{/each}
</div>

<style>
	.table-view-filters {
		grid-template-columns: var(--grid-layout);

		height: 32px;
	}

	.table-view-filter {
		border: none;
		border-radius: 0;

		text-align: center;
	}
</style>
