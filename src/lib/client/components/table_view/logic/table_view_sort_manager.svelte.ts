import { Context } from 'runed';

export class TableViewSortManager {
	public static context = new Context<TableViewSortManager>('table-view-sort-manager');

	public sortedBy: number = $state(0);
	public sortedDescending: boolean = $state(true);
}
