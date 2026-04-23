import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { primaryKeyId, timestampColumns } from '../schema_utils';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const librarians = sqliteTable('librarians', {
	id: primaryKeyId(),
	email: text().notNull(),
	password: text(),

	...timestampColumns()
});

export type LibrarianSelect = InferSelectModel<typeof librarians>;
export type LibrarianInsert = InferInsertModel<typeof librarians>;
