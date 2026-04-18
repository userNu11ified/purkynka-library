import { Context } from 'runed';
import { CSSVariables } from '$client/css_utilities';
import { calculateColumnSizes, type TableViewDefaultColumnSize } from './table_view_column_sizing';
import type { TableViewColumn } from './table_view_column';

export class TableViewColumnManager<R> {
	public static context = new Context<TableViewColumnManager<unknown>>('table-view-column-manager');

	public columns: TableViewColumn<R>[];

	public availableWidth: number;
	public usableWidth: number;

	public defaultColumnSizes: TableViewDefaultColumnSize[];
	public currentColumnSizes: number[];

	public calculatedGridLayout: string;

	constructor(columns: () => TableViewColumn<R>[]) {
		this.columns = $derived.by(columns);

		this.availableWidth = $state(0);
		this.usableWidth = $derived(
			this.availableWidth -
				this.columns.length * CSSVariables.BORDER_WIDTH -
				CSSVariables.SCROLLBAR_WIDTH
		);

		this.defaultColumnSizes = $derived(this.columns.map((v) => v.defaultColumnSize));
		this.currentColumnSizes = $state([]);

		this.calculatedGridLayout = $derived(
			this.currentColumnSizes.map((columnSize) => `${columnSize}px`).join(' ')
		);
	}

	public resetColumnSizes = () => {
		this.currentColumnSizes = calculateColumnSizes(this.defaultColumnSizes, this.usableWidth);
	};
}
