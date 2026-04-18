import type { Nullable } from '$shared/types/util';
import { Context } from 'runed';

export class TableViewFilterManager {
	public static context = new Context<TableViewFilterManager>('table-view-filter-manager');

	public filteredBy: Nullable<number> = $state(null);
	public filterQuery: string = $state('');
	public trimmedQuery: string = $derived(this.filterQuery.trim());
	public lowercaseQuery: string = $derived(this.trimmedQuery.toLocaleLowerCase('cs'));
}
