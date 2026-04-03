import { sqliteTable, text, type SQLiteColumnBuilder } from 'drizzle-orm/sqlite-core';
import { primaryKeyId, timestampColumns } from '../schema_utils';

const createShorthandTable = <
	const TableName extends string,
	const ShortNameColumn extends SQLiteColumnBuilder,
	const LongNameColumn extends SQLiteColumnBuilder
>(
	tableName: TableName,
	shortNameColumn: ShortNameColumn,
	longNameColumn: LongNameColumn
) =>
	sqliteTable(tableName, {
		id: primaryKeyId(),
		shortName: shortNameColumn,
		longName: longNameColumn,

		...timestampColumns()
	});

const createStringShorthandTable = <const TableName extends string>(tableName: TableName) =>
	createShorthandTable(tableName, text().notNull(), text().notNull());

export const literatureTypes = createStringShorthandTable('literatureTypes');
export const udc = createStringShorthandTable('udc');
