import type { DatabaseTable } from '$shared/types/database/schema';
import type { ValueOf } from '$shared/types/util';
import {
	eq,
	gt,
	gte,
	inArray,
	lt,
	lte,
	ne,
	notInArray,
	SQL,
	sql,
	type InferSelectModel
} from 'drizzle-orm';
import type { SQLiteColumn, SQLiteTable } from 'drizzle-orm/sqlite-core';

export type ColumnFilter<ColumnName extends string, Value> =
	| { columnName: ColumnName; filterType: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'; value: Value }
	| { columnName: ColumnName; filterType: 'inArray' | 'notInArray'; values: Value[] };

type ColumnFilters<Table extends SQLiteTable> = ValueOf<{
	[Key in keyof InferSelectModel<Table>]: ColumnFilter<Key, InferSelectModel<Table>[Key]>;
}>;

type FilterCombiner<Table extends SQLiteTable> = {
	filterType: 'and' | 'or';
	filters: [ColumnFilters<Table>, ColumnFilters<Table>, ...ColumnFilters<Table>[]];
};

export type WhereClause<Table extends SQLiteTable> = ColumnFilters<Table> | FilterCombiner<Table>;

export const isFilterCombiner = <Table extends SQLiteTable>(
	value: WhereClause<Table>
): value is FilterCombiner<Table> => value.filterType === 'and' || value.filterType === 'or';

export const isColumnFilter = <Table extends SQLiteTable>(
	value: WhereClause<Table>
): value is ColumnFilters<Table> => !isFilterCombiner(value);

export const parseWhereFilter = <Table extends DatabaseTable>(
	table: Table,
	whereClause: WhereClause<Table>
): SQL => {
	if (isFilterCombiner(whereClause))
		return sql.join(
			whereClause.filters.map((whereFilter) => parseWhereFilter(table, whereFilter)),
			whereClause.filterType === 'and' ? sql` AND ` : sql` OR `
		);

	const column = table[whereClause.columnName] as SQLiteColumn;

	if (whereClause.filterType === 'inArray') return inArray(column, whereClause.values);
	else if (whereClause.filterType === 'notInArray') return notInArray(column, whereClause.values);
	else if (whereClause.filterType === 'eq') return eq(column, whereClause.value);
	else if (whereClause.filterType === 'neq') return ne(column, whereClause.value);
	else if (whereClause.filterType === 'lt') return lt(column, whereClause.value);
	else if (whereClause.filterType === 'lte') return lte(column, whereClause.value);
	else if (whereClause.filterType === 'gt') return gt(column, whereClause.value);
	else if (whereClause.filterType === 'gte') return gte(column, whereClause.value);

	throw new Error('Invalid filterType provided!');
};
