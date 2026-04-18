<script lang="ts">
	import Icon from '$client/components/icon/Icon.svelte';
	import { CSSVariables } from '$client/css_utilities';
	import { sum, type Nullable } from '$shared/types/util';
	import type { TableViewColumn } from '../logic/table_view_column';
	import { MINIMUM_COLUMN_WIDTH } from '../logic/table_view_column_sizing';

	let {
		columns,
		columnSizes = $bindable(),
		sortedBy = $bindable(),
		sortedDescending = $bindable()
	}: {
		columns: TableViewColumn[];
		columnSizes: number[];
		sortedBy: number;
		sortedDescending: boolean;
	} = $props();

	const columnNameWidths: number[] = $state([]);
	const shouldCenterSortIcon = $derived(
		columnSizes.map((v, i) => {
			const columnNameWidth = columnNameWidths[i];

			if (columnNameWidth === 0) return true;
			return v < columnNameWidth + 64;
		})
	);

	const onSorterMouseDown = (sorterIndex: number) => {
		if (sortedBy === sorterIndex) {
			sortedDescending = !sortedDescending;
		} else {
			sortedBy = sorterIndex;
			sortedDescending = true;
		}
	};

	const KEYBOARD_NAVIGATION_INCREMENT = 32;

	const resizers: HTMLButtonElement[] = $state([]);
	let currentlyResizing: Nullable<number> = $state(null);

	const onResizerMouseDown = (resizerIndex: number) => {
		currentlyResizing = resizerIndex;
	};

	const onResizerKeyDown = (e: KeyboardEvent, resizerIndex: number) => {
		if (e.code === 'ArrowLeft') decreaseSize(resizerIndex, -KEYBOARD_NAVIGATION_INCREMENT);
		else if (e.code === 'ArrowRight') increaseSize(resizerIndex, KEYBOARD_NAVIGATION_INCREMENT);
	};

	const decreaseSize = (resize: number, movedBy: number) => {
		const oldLeftSize = columnSizes[resize];
		const newLeftSize = Math.max(columnSizes[resize] + movedBy, MINIMUM_COLUMN_WIDTH);

		const leftSizeDifference = newLeftSize - oldLeftSize;

		columnSizes[resize] += leftSizeDifference;
		columnSizes[resize + 1] -= leftSizeDifference;
	};

	const increaseSize = (resize: number, movedBy: number) => {
		const oldRightSize = columnSizes[resize + 1];
		const newRightSize = Math.max(columnSizes[resize + 1] - movedBy, MINIMUM_COLUMN_WIDTH);

		const rightSizeDifference = newRightSize - oldRightSize;

		columnSizes[resize] -= rightSizeDifference;
		columnSizes[resize + 1] += rightSizeDifference;
	};

	const onWindowMouseMove = (e: MouseEvent) => {
		if (currentlyResizing === null) return;
		const resizerRect = resizers[currentlyResizing].getBoundingClientRect();

		const movedBy = e.clientX - resizerRect.x;
		if (movedBy < 0) decreaseSize(currentlyResizing, movedBy);
		else increaseSize(currentlyResizing, movedBy);
	};

	const onWindowMouseUp = () => {
		currentlyResizing = null;
	};

	const calculateLeftOffset = (resizerIndex: number) =>
		sum(columnSizes.slice(0, resizerIndex + 1)) + resizerIndex * CSSVariables.BORDER_WIDTH;
</script>

<svelte:window onmouseup={onWindowMouseUp} onmousemove={onWindowMouseMove} />

<div class="table-view-sorters inverse-grid">
	{#each columns as column, i (column.columnName)}
		{@const isSortedByColumn = sortedBy === i}
		<button
			class="table-view-sorter center-flex"
			class:sorted-by={isSortedByColumn}
			onmousedown={() => onSorterMouseDown(i)}
		>
			<div class="table-view-column-name" bind:clientWidth={columnNameWidths[i]}>
				{column.columnName}
			</div>
			{#if isSortedByColumn}
				<div
					class="table-view-sort-order-container center-grid"
					class:center={shouldCenterSortIcon[i]}
				>
					<Icon iconType={sortedDescending ? 'sort-descending' : 'sort-ascending'} width={20} />
				</div>
			{/if}
		</button>
		{#if i !== columns.length - 1}
			<button
				class="table-view-resizer"
				class:resizing={currentlyResizing === i}
				style:--left-offset={`${calculateLeftOffset(i)}px`}
				aria-label="Column Resizer"
				onmousedown={() => onResizerMouseDown(i)}
				onkeydown={(e) => onResizerKeyDown(e, i)}
				bind:this={resizers[i]}
			></button>
		{/if}
	{/each}
</div>

<style>
	.table-view-sorters {
		position: relative;

		height: 48px;

		grid-template-columns: var(--grid-layout);
	}

	.table-view-sorter {
		position: relative;

		padding-inline: 16px;

		font-size: 16px;
		font-weight: bold;

		overflow: hidden;
	}

	.table-view-sorter.sorted-by {
		color: var(--information-color);
	}

	.table-view-sorter:hover .table-view-sort-order-container.center {
		visibility: hidden;
	}

	.table-view-column-name {
		background-color: transparent;

		color: inherit;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.table-view-sort-order-container {
		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%);

		color: inherit;

		background-color: transparent;
	}

	.table-view-sort-order-container.center {
		right: unset;
		left: 50%;
		transform: translate(-50%, -50%);

		padding: 4px;
		border: var(--border);
		border-radius: 4px;

		background-color: var(--bg-primary);
	}

	.table-view-resizer {
		--width-multiplier: 2;

		position: absolute;
		top: 0;
		left: calc(var(--left-offset) - var(--border-width) * var(--width-multiplier));

		width: calc(var(--border-width) * (var(--width-multiplier) * 2 + 1));
		height: 100%;

		background-color: transparent;

		cursor: col-resize;
	}

	.table-view-resizer.resizing,
	.table-view-resizer:focus-within,
	.table-view-resizer:hover {
		background-color: var(--information-color);
	}
</style>
