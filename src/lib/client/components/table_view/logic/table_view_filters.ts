import type { TableViewQueryState } from './table_view_filter_manager.svelte';

export const stringFilter = (value: string, queryState: TableViewQueryState) => {
	if (queryState.caseSensitive) return value.includes(queryState.trimmedQuery);
	return value.toLocaleLowerCase('cs').includes(queryState.lowercaseQuery);
};
