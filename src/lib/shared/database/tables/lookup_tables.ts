import { SQLiteColumnBuilder, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { primaryKeyId, timestampColumns } from '../schema_utils';

const createLookupTable = <
	const TableName extends string,
	const ValueColumn extends SQLiteColumnBuilder
>(
	tableName: TableName,
	valueColumn: ValueColumn
) =>
	sqliteTable(tableName, {
		id: primaryKeyId(),
		value: valueColumn,

		...timestampColumns()
	});

const createStringLookupTable = <const TableName extends string>(tableName: TableName) =>
	createLookupTable(tableName, text().notNull());

export const bookNames = createStringLookupTable('bookNames');
export const authorNames = createStringLookupTable('authorNames');
export const publishers = createStringLookupTable('publishers');
export const placesOfPublishing = createStringLookupTable('placesOfPublishing');
export const obtainedFrom = createStringLookupTable('obtainedFrom');
export const discardReasons = createStringLookupTable('discardReasons');
