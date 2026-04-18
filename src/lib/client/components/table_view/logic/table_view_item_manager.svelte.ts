import { Context } from 'runed';

export type ItemMapper<T, R> = (item: T) => R;
export type IndexedMappedItem<R> = [mappedItem: R, mappedItemIndex: number];

export class TableViewItemManager<T, R> {
	public static context = new Context<TableViewItemManager<unknown, unknown>>(
		'table-view-item-manager'
	);

	public items: T[];
	public itemMapper: ItemMapper<T, R>;
	public indexedMappedItems: IndexedMappedItem<R>[];

	constructor(items: () => T[], itemMapper: () => ItemMapper<T, R>) {
		this.items = $derived.by(items);

		this.itemMapper = $derived.by(itemMapper);
		this.indexedMappedItems = $derived(this.items.map((item, i) => [this.itemMapper(item), i]));
	}
}
