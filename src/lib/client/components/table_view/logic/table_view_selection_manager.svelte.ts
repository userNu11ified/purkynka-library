import type { Nullable } from '$shared/types/util';
import { Context } from 'runed';
import { SvelteSet } from 'svelte/reactivity';
import { TableViewItemManager } from './table_view_item_manager.svelte';
import { TableViewColumnManager } from './table_view_column_manager.svelte';

export type ItemCopier<R> = (item: R) => (string | number)[];

export class TableViewSelectionManager<R> {
	public static context = new Context<TableViewSelectionManager<unknown>>(
		'table-view-selection-manager'
	);

	private tableViewColumnManager: TableViewColumnManager<R>;
	private tableViewItemManager: TableViewItemManager<unknown, R>;

	public mousePosition: [number, number];

	public currentlySelecting: Nullable<number>;
	public toggledUnselecting: boolean;

	public currentlySelectedMappedIndexes: SvelteSet<number>;

	public itemCopier: ItemCopier<R>;

	constructor(itemCopier: () => ItemCopier<R>) {
		this.tableViewColumnManager = TableViewColumnManager.context.get();
		this.tableViewItemManager = TableViewItemManager.context.get() as TableViewItemManager<
			unknown,
			R
		>;

		this.mousePosition = $state([0, 0]);

		this.currentlySelecting = $state(null);
		this.toggledUnselecting = $state(false);

		this.currentlySelectedMappedIndexes = new SvelteSet();

		this.itemCopier = $derived.by(itemCopier);
	}

	public toggleSelectState(mappedIndex: number) {
		if (this.currentlySelectedMappedIndexes.has(mappedIndex))
			this.currentlySelectedMappedIndexes.delete(mappedIndex);
		else this.currentlySelectedMappedIndexes.add(mappedIndex);
	}

	public async copySelection() {
		const header = this.tableViewColumnManager.columns.map((v) => v.columnName).join('\t');
		const rows = this.getMultipleSelected()
			.map((v) => this.itemCopier(this.tableViewItemManager.indexedMappedItems[v][0]).join('\t'))
			.join('\n');

		const copiedString = `${header}\n${rows}`;
		await navigator.clipboard.writeText(copiedString);

		this.resetSelection();
	}

	public resetSelection() {
		this.currentlySelecting = null;
		this.toggledUnselecting = false;

		this.currentlySelectedMappedIndexes.clear();
	}

	public getSingleSelected() {
		return this.currentlySelectedMappedIndexes.values().next().value;
	}

	public getMultipleSelected() {
		return this.currentlySelectedMappedIndexes.values().toArray();
	}
}
