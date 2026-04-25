<script lang="ts">
	import ButtonWithPopup from '../ButtonWithPopup.svelte';
	import Icon from '../icon/Icon.svelte';
	import { TableViewColumnManager } from './logic/table_view_column_manager.svelte';
	import { TableViewFilterManager } from './logic/table_view_filter_manager.svelte';
	import { TableViewItemManager } from './logic/table_view_item_manager.svelte';
	import { TableViewSelectionManager } from './logic/table_view_selection_manager.svelte';

	const tableViewColumnManager = TableViewColumnManager.context.get();
	const tableViewFilterManager = TableViewFilterManager.context.get();
	const tableViewItemManager = TableViewItemManager.context.get();
	const tableViewSelectionManager = TableViewSelectionManager.context.get();

	const onCaseSensitiveClick = () => {
		tableViewFilterManager.caseSensitive = !tableViewFilterManager.caseSensitive;
	};

	const onSelectAllClick = () => {
		tableViewItemManager.collatedItems.forEach((v) =>
			tableViewSelectionManager.currentlySelectedMappedIndexes.add(v[1])
		);
	};

	const onResetColumnSizesClick = () => tableViewColumnManager.resetColumnSizes();
</script>

<div class="table-view-status-bar">
	<div class="left">
		<ButtonWithPopup
			class="reset-column-sizes center-flex"
			popupAlignment="start"
			onclick={onResetColumnSizesClick}
		>
			{#snippet popup()}
				Resetovat velikosti sloupců
			{/snippet}

			<Icon iconType="column-width" width={20} />
		</ButtonWithPopup>
	</div>

	<ButtonWithPopup class="item-count center-flex" onclick={onSelectAllClick}>
		{#snippet popup()}
			Vybrat všechny vyhledané
		{/snippet}

		<div class="filtered-item-count">{tableViewItemManager.collatedItems.length}</div>
		/
		<div class="total-item-count">{tableViewItemManager.indexedMappedItems.length}</div>
	</ButtonWithPopup>

	<div class="right">
		<button
			class="table-view-case-sensitive center-flex"
			class:active={tableViewFilterManager.caseSensitive}
			onclick={onCaseSensitiveClick}
		>
			<Icon iconType="case-sensitive" width={20} />
			Rozlišovat vel. a mal. písmena
		</button>
	</div>
</div>

<style>
	.table-view-status-bar {
		height: 32px;

		position: relative;
	}

	.left,
	.right {
		display: flex;

		position: absolute;
		top: 0;
		height: 100%;
	}

	.left {
		left: 0;
	}

	.right {
		right: 0;
	}

	button {
		gap: 4px;

		height: 100%;
		padding-inline: 8px;
	}

	button.active {
		color: var(--information-color);
	}

	:global .table-view-status-bar .item-count {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		gap: 8px;

		height: 100%;

		padding-inline: 8px;
	}

	.filtered-item-count,
	.total-item-count {
		background-color: transparent;
	}

	:global .reset-column-sizes {
		width: 32px;
	}
</style>
