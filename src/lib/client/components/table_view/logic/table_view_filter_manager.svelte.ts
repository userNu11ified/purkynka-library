import type { QueryState } from '$client/collation/query_state';
import type { Nullable } from '$shared/types/util';
import { Context } from 'runed';

export class TableViewFilterManager {
	public static context = new Context<TableViewFilterManager>('table-view-filter-manager');

	public currentQueries: string[] = $state([]);

	public filteredBy: Nullable<number> = $state(null);
	public filterQuery: string = $state('');

	public jumpedTo: Nullable<number> = $state(null);

	public trimmedQuery: string = $derived(this.filterQuery.trim());
	public lowercaseQuery: string = $derived(this.trimmedQuery.toLocaleLowerCase('cs'));
	public caseSensitive: boolean = $state(false);

	public queryState: QueryState = $derived({
		trimmedQuery: this.trimmedQuery,
		lowercaseQuery: this.lowercaseQuery,
		caseSensitive: this.caseSensitive
	});

	public resetFilter = () => {
		this.jumpedTo = null;
		this.filteredBy = null;
		this.filterQuery = '';
		this.currentQueries = this.currentQueries.map(() => '');
	};
}
