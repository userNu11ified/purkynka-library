<script lang="ts">
	import type { Nullable } from '$shared/types/util';
	import type { TableViewColumn } from '../logic/table_view_column';

	/* eslint-disable no-useless-assignment */
	let {
		columns,
		filteredBy = $bindable(),
		filterQuery = $bindable()
	}: { columns: TableViewColumn[]; filteredBy: Nullable<number>; filterQuery: string } = $props();
	/* eslint-enable no-useless-assignment */

	// svelte-ignore state_referenced_locally
	const currentQueries: string[] = $state(Array.from({ length: columns.length }, () => ''));

	const onFilterInput = (filterIndex: number) => {
		currentQueries.forEach((_, i) => {
			if (i !== filterIndex) currentQueries[i] = '';
		});

		const trimmedQuery = currentQueries[filterIndex].trim();
		filteredBy = trimmedQuery.length === 0 ? null : filterIndex;
		filterQuery = trimmedQuery;
	};
</script>

<div class="table-view-filters inverse-grid">
	{#each columns as column, i (column.columnName)}
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
