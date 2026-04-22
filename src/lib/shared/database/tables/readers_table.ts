import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { foreignKeyId, primaryKeyId, timestampColumns } from '../schema_utils';
import { readerClasses } from './lookup_tables';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const readers = sqliteTable('readers', {
	id: primaryKeyId(),
	readerName: text().notNull(),
	readerClassId: foreignKeyId(readerClasses.id).notNull(),
	readerType: text({ enum: ['S', 'T'] }).notNull(),
	...timestampColumns()
});

export type ReaderSelect = InferSelectModel<typeof readers>;
export type ReaderInsert = InferInsertModel<typeof readers>;
