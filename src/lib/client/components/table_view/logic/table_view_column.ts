import type { Snippet } from 'svelte';
import type { TableViewDefaultColumnSize } from './table_view_column_sizing';
import type { IndexedMappedItem } from './table_view_item_manager.svelte';
import type { Nullable } from '$shared/types/util';
import type { TableViewQueryState } from './table_view_filter_manager.svelte';

export type TableViewColumnRenderer<R> =
	| { type: 'text'; textCreator: (mappedItem: R) => string | number }
	| { type: 'snippet'; snippet: Snippet<[item: R]> };

export type TableViewColumnSorter<R> = (left: R, right: R) => number;

export type TableViewColumnSearcher<R> =
	| { type: 'filter'; filter: (mappedItem: R, queryState: TableViewQueryState) => boolean }
	| {
			type: 'jumper';
			jumper: (
				mappedItems: IndexedMappedItem<R>[],
				queryState: TableViewQueryState
			) => Nullable<number>;
	  };

export type TableViewColumn<R> = {
	columnName: string;
	columnAlignment?: 'left' | 'center' | 'right';
	defaultColumnSize: TableViewDefaultColumnSize;

	columnRenderer: TableViewColumnRenderer<R>;
	columnSorter: TableViewColumnSorter<R>;
	columnSearcher: TableViewColumnSearcher<R>;
};
