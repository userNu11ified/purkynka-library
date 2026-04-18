<script lang="ts">
	import { onMount } from 'svelte';
	import type { TableViewColumn } from './logic/table_view_column';
	import TableViewList from './list/TableViewList.svelte';
	import TableViewStatusBar from './TableViewStatusBar.svelte';
	import { CSSVariables } from '$client/css_utilities';
	import { calculateDefaultSizes } from './logic/table_view_column_sizing';
	import TableViewSorters from './header/TableViewSorters.svelte';
	import TableViewFilters from './header/TableViewFilters.svelte';

	const {
		renderAfterResolved,
		columns
	}: { renderAfterResolved: Promise<void>; columns: TableViewColumn[] } = $props();
	const defaultColumnSizes = $derived(columns.map((column) => column.defaultColumnSize));

	let availableWidth = $state(0);
	const usableWidth = $derived(
		availableWidth - (defaultColumnSizes.length - 1) * CSSVariables.BORDER_WIDTH
	);

	let columnSizes: number[] = $state([]);
	const calculatedGridLayout = $derived(
		columnSizes.map((columnSize) => `${columnSize}px`).join(' ')
	);

	let sortedBy: number = $state(0);
	let sortedDescending: boolean = $state(true);

	onMount(() => {
		columnSizes = calculateDefaultSizes(defaultColumnSizes, usableWidth);
	});
</script>

<div class="table-view-container fill-container" bind:clientWidth={availableWidth}>
	{#await renderAfterResolved}
		<h1>Loading</h1>
	{:then}
		<div class="table-view fill-container inverse-grid" style:--grid-layout={calculatedGridLayout}>
			<div class="table-view-content inverse-grid">
				<div class="table-view-header inverse-grid">
					<TableViewSorters {columns} bind:columnSizes bind:sortedBy bind:sortedDescending />
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
