import { SQLiteColumnBuilder, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { primaryKeyId, timestampColumns } from '../schema_utils';
import type { InferSelectModel } from 'drizzle-orm';

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

export const readerClasses = createStringLookupTable('readerClasses');

type StringLookupTableSelect = InferSelectModel<ReturnType<typeof createStringLookupTable>>;
export type BookNameSelect = StringLookupTableSelect;
export type AuthorNameSelect = StringLookupTableSelect;
export type PublisherSelect = StringLookupTableSelect;
export type PlaceOfPublishingSelect = StringLookupTableSelect;
export type ObtainedFromSelect = StringLookupTableSelect;
export type DiscardReasonSelect = StringLookupTableSelect;
export type ReaderClassSelect = StringLookupTableSelect;

type StringLookupTableInsert = InferSelectModel<ReturnType<typeof createStringLookupTable>>;
export type BookNameInsert = StringLookupTableInsert;
export type AuthorNameInsert = StringLookupTableInsert;
export type PublisherInsert = StringLookupTableInsert;
export type PlaceOfPublishingInsert = StringLookupTableInsert;
export type ObtainedFromInsert = StringLookupTableInsert;
export type DiscardReasonInsert = StringLookupTableInsert;
export type ReaderClassInsert = StringLookupTableInsert;
