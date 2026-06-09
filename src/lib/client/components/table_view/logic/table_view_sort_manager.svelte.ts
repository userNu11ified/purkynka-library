import { Context, PersistedState } from 'runed';

export class TableViewSortManager {
	public static context = new Context<TableViewSortManager>('table-view-sort-manager');

	public persistentStateId: string;

	public sortedBy: PersistedState<number>;
	public sortedDescending: PersistedState<boolean>;

	constructor(persistentStateId: () => string) {
		this.persistentStateId = $derived.by(persistentStateId);
		this.sortedBy = new PersistedState(`${this.persistentStateId}-sorted-by`, 0);
		this.sortedDescending = new PersistedState(`${this.persistentStateId}-sorted-descending`, true);
	}

	public resetSort = () => {
		this.sortedBy.current = 0;
		this.sortedDescending.current = true;
	};
}
