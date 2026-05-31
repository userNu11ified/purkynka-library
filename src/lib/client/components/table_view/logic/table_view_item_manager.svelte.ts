import { Context } from 'runed';
import { TableViewSortManager } from './table_view_sort_manager.svelte';
import { TableViewFilterManager } from './table_view_filter_manager.svelte';
import { TableViewColumnManager } from './table_view_column_manager.svelte';

export type ItemMapper<T, R> = (item: T) => R;
export type IndexedMappedItem<R> = [mappedItem: R, mappedItemIndex: number];

export class TableViewItemManager<T, R> {
	public static context = new Context<TableViewItemManager<unknown, unknown>>(
		'table-view-item-manager'
	);

	private tableViewColumnManager: TableViewColumnManager<R>;
	private tableViewSortManager: TableViewSortManager;
	private tableViewFilterManager: TableViewFilterManager;

	public items: T[];
	public itemMapper: ItemMapper<T, R>;
	public indexedMappedItems: IndexedMappedItem<R>[];

	public collatedItems: IndexedMappedItem<R>[];

	constructor(items: () => T[], itemMapper: () => ItemMapper<T, R>) {
		this.tableViewColumnManager = TableViewColumnManager.context.get();
		this.tableViewSortManager = TableViewSortManager.context.get();
		this.tableViewFilterManager = TableViewFilterManager.context.get();

		this.items = $derived.by(items);

		this.itemMapper = $derived.by(itemMapper);
		this.indexedMappedItems = $derived(this.items.map((item, i) => [this.itemMapper(item), i]));

		this.collatedItems = $derived.by(() => {
			const filteredItems = this.getFilteredItems();

			filteredItems.sort(
				(l, r) =>
					this.tableViewColumnManager.columns[
						this.tableViewSortManager.sortedBy.current
					].columnSorter(l[0], r[0]) * (this.tableViewSortManager.sortedDescending.current ? -1 : 1)
			);

			return filteredItems;
		});
	}

	private shallowCopyIndexedMappedItems() {
		return this.indexedMappedItems.slice();
	}

	private getFilteredItems() {
		if (this.tableViewFilterManager.filteredBy === null)
			return this.shallowCopyIndexedMappedItems();

		const tableViewColumnSearcher =
			this.tableViewColumnManager.columns[this.tableViewFilterManager.filteredBy].columnSearcher;
		if (tableViewColumnSearcher.type === 'jumper') return this.shallowCopyIndexedMappedItems();

		return this.shallowCopyIndexedMappedItems().filter(([v]) =>
			tableViewColumnSearcher.filter(v, this.tableViewFilterManager.queryState)
		);
	}
}
