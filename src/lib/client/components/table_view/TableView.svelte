<script lang="ts" generics="T, R">
	import type { TableViewColumn } from './logic/table_view_column';
	import TableViewList from './list/TableViewList.svelte';
	import TableViewStatusBar from './TableViewStatusBar.svelte';
	import TableViewSorters from './header/TableViewSorters.svelte';
	import TableViewFilters from './header/TableViewFilters.svelte';
	import { TableViewSortManager } from './logic/table_view_sort_manager.svelte';
	import { TableViewFilterManager } from './logic/table_view_filter_manager.svelte';
	import { TableViewColumnManager } from './logic/table_view_column_manager.svelte';
	import { onMount, type Snippet } from 'svelte';
	import {
		TableViewItemManager,
		type IndexedMappedItem,
		type ItemMapper
	} from './logic/table_view_item_manager.svelte';
	import {
		TableViewSelectionManager,
		type ItemCopier
	} from './logic/table_view_selection_manager.svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import TableViewSelectionMode from './selection/TableViewSelectionMode.svelte';
	import TableViewSelectActions from './selection/TableViewSelectActions.svelte';
	import ButtonWithPopup from '../ButtonWithPopup.svelte';
	import Icon from '../icon/Icon.svelte';
	import { watch } from 'runed';

	const {
		renderAfterResolved,
		persistentStateId,
		items,
		itemMapper,
		itemCopier,
		columns,
		singleSelectActions,
		multiSelectActions
	}: {
		renderAfterResolved: Promise<void>;
		persistentStateId: string;
		items: T[];
		itemMapper: ItemMapper<T, R>;
		itemCopier: ItemCopier<R>;
		columns: TableViewColumn<R>[];
		singleSelectActions?: Snippet<[selectedItem: IndexedMappedItem<R>]>;
		multiSelectActions?: Snippet<[selectedItems: IndexedMappedItem<R>[]]>;
	} = $props();

	let tableView: HTMLDivElement | undefined = $state();
	let tableViewContent: HTMLDivElement | undefined = $state();
	let tableViewList: TableViewList<T, R> | undefined = $state();
	let tableViewRect: DOMRect | undefined = $state();

	const tableViewColumnManager = TableViewColumnManager.context.set(
		new TableViewColumnManager(
			() => persistentStateId,
			() => columns
		) as TableViewColumnManager<unknown>
	);

	const tableViewSortManager = TableViewSortManager.context.set(
		new TableViewSortManager(() => persistentStateId)
	);
	const tableViewFilterManager = TableViewFilterManager.context.set(new TableViewFilterManager());

	TableViewItemManager.context.set(
		new TableViewItemManager(
			() => items,
			() => itemMapper
		) as TableViewItemManager<unknown, unknown>
	);

	const tableViewSelectionManager = TableViewSelectionManager.context.set(
		new TableViewSelectionManager(() => itemCopier) as TableViewSelectionManager<unknown>
	);

	const onViewMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
		tableViewSelectionManager.mousePosition = [
			e.pageX - e.currentTarget.offsetLeft - (tableViewRect?.left ?? 0),
			e.pageY - e.currentTarget.offsetTop - (tableViewRect?.top ?? 0)
		];
	};

	const onWindowKeyDown = (e: KeyboardEvent) => {
		if (e.code === 'ShiftLeft') tableViewSelectionManager.toggledUnselecting = true;
		else if (e.code === 'Escape') tableViewSelectionManager.resetSelection();
		else if (e.ctrlKey && e.code === 'KeyC') tableViewSelectionManager.copySelection();
	};

	const onWindowKeyUp = (e: KeyboardEvent) => {
		if (e.code === 'ShiftLeft') tableViewSelectionManager.toggledUnselecting = false;
	};

	const onGoUpClick = () => tableViewList?.goUp();

	export const clearSelection = () => tableViewSelectionManager.resetSelection();

	export const resetSort = tableViewSortManager.resetSort;
	export const resetFilter = tableViewFilterManager.resetFilter;
	export const resetColumnSizes = tableViewColumnManager.resetColumnSizes;

	export const searchBy = (columnIndex: number, searchQuery: string) => {
		tableViewFilterManager.currentQueries[columnIndex] = searchQuery;
		tableViewFilterManager.filteredBy = columnIndex;
		tableViewFilterManager.filterQuery = searchQuery;
	};

	const resizeColumns = (usableWidth: number) => {
		if (tableViewColumnManager.previousUsableWidth.current === 0) return;
		if ((tableViewContent?.scrollWidth ?? 0) !== (tableViewContent?.clientWidth ?? 0)) return;

		const previousUsableWidth = tableViewColumnManager.previousUsableWidth.current!;
		const sizeDifference = usableWidth - previousUsableWidth;
		tableViewColumnManager.currentColumnSizes.current[0] += sizeDifference;
	};

	watch(
		() => tableViewColumnManager.usableWidth,
		(usableWidth) => resizeColumns(usableWidth)
	);

	onMount(() => {
		if (tableViewColumnManager.currentColumnSizes.current.length === 0)
			tableViewColumnManager.resetColumnSizes();
		resizeColumns(tableViewColumnManager.availableWidth);

		tableViewRect = tableView?.getBoundingClientRect();
	});
</script>

<svelte:window onkeydown={onWindowKeyDown} onkeyup={onWindowKeyUp} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="table-view-container fill-container"
	onmousemove={onViewMouseMove}
	bind:clientWidth={tableViewColumnManager.availableWidth}
	bind:this={tableView}
>
	{#await renderAfterResolved then}
		<div
			class="table-view fill-container inverse-grid"
			style:--grid-layout={tableViewColumnManager.calculatedGridLayout}
		>
			<div class="table-view-content inverse-grid" bind:this={tableViewContent}>
				<div class="table-view-header inverse-grid">
					<TableViewSorters />
					<TableViewFilters />
				</div>
				<TableViewList bind:this={tableViewList}></TableViewList>
				<TableViewSelectActions {singleSelectActions} {multiSelectActions}></TableViewSelectActions>

				<ButtonWithPopup
					class="table-view-go-up center-grid"
					popupAlignment="end"
					onclick={onGoUpClick}
				>
					{#snippet popup()}
						Zpátky nahoru
					{/snippet}
					<Icon iconType="chevron-up" />
				</ButtonWithPopup>
			</div>
			<TableViewStatusBar></TableViewStatusBar>
			<TableViewSelectionMode></TableViewSelectionMode>
		</div>
	{/await}
</div>

<style>
	.table-view-container {
		position: relative;

		overflow: hidden;
	}

	.table-view {
		grid-template-rows: auto max-content;
	}

	.table-view-content {
		position: relative;

		grid-template-rows: max-content auto;

		overflow-x: auto;
	}

	:global .table-view-go-up {
		position: absolute;
		right: calc(var(--scrollbar-width) + 8px);
		bottom: 8px;

		border: var(--border);
		border-radius: 4px;
	}
</style>
