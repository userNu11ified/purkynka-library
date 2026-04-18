import { Context } from 'runed';
import { CSSVariables } from '$client/css_utilities';
import { calculateColumnSizes } from './table_view_column_sizing';
import type { TableViewColumn } from './table_view_column';

export class TableViewColumnManager {
	public static context = new Context<TableViewColumnManager>('table-view-column-manager');

	public columns: TableViewColumn[] = $state([]);

	public availableWidth: number = $state(0);
	public usableWidth: number = $derived(
		this.availableWidth - (this.columns.length - 1) * CSSVariables.BORDER_WIDTH
	);

	public defaultColumnSizes = $derived(this.columns.map((v) => v.defaultColumnSize));
	public currentColumnSizes: number[] = $state([]);

	public calculatedGridLayout: string = $derived(
		this.currentColumnSizes.map((columnSize) => `${columnSize}px`).join(' ')
	);

	constructor(columns: TableViewColumn[]) {
		this.columns = columns;
	}

	public resetColumnSizes = () => {
		this.currentColumnSizes = calculateColumnSizes(this.defaultColumnSizes, this.usableWidth);
	};
}
