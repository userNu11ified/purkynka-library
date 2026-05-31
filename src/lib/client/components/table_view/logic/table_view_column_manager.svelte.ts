import { Context, PersistedState, Previous } from 'runed';
import { CSSVariables } from '$client/css_utilities';
import { calculateColumnSizes, type TableViewDefaultColumnSize } from './table_view_column_sizing';
import type { TableViewColumn } from './table_view_column';

export class TableViewColumnManager<R> {
	public static context = new Context<TableViewColumnManager<unknown>>('table-view-column-manager');

	public persistentStateId: string;
	public columns: TableViewColumn<R>[];

	public availableWidth: number;
	public previousUsableWidth: Previous<number>;
	public usableWidth: number;

	public defaultColumnSizes: TableViewDefaultColumnSize[];
	public currentColumnSizes: PersistedState<number[]>;

	public calculatedGridLayout: string;

	constructor(persistentStateId: () => string, columns: () => TableViewColumn<R>[]) {
		this.persistentStateId = $derived.by(persistentStateId);
		this.columns = $derived.by(columns);

		this.availableWidth = $state(0);

		this.usableWidth = $derived(
			this.availableWidth -
				this.columns.length * CSSVariables.BORDER_WIDTH -
				CSSVariables.SCROLLBAR_WIDTH
		);

		this.previousUsableWidth = new Previous(() => this.usableWidth, 0);

		this.defaultColumnSizes = $derived(this.columns.map((v) => v.defaultColumnSize));
		this.currentColumnSizes = new PersistedState(`${this.persistentStateId}-column-sizes`, []);

		this.calculatedGridLayout = $derived(
			this.currentColumnSizes.current.map((columnSize) => `${columnSize}px`).join(' ')
		);
	}

	public resetColumnSizes = () => {
		this.currentColumnSizes.current = calculateColumnSizes(
			this.defaultColumnSizes,
			this.usableWidth
		);
	};
}
