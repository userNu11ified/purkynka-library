import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { date, foreignKeyId, primaryKeyId, timestampColumns } from '../schema_utils';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const librarians = sqliteTable('librarians', {
	id: primaryKeyId(),
	email: text().notNull(),
	password: text(),

	...timestampColumns()
});

export const sessions = sqliteTable('sessions', {
	id: text().primaryKey().notNull(),
	librarianId: foreignKeyId(librarians.id).notNull(),
	expiresAt: date().notNull()
});

export type LibrarianSelect = InferSelectModel<typeof librarians>;
export type LibrarianInsert = InferInsertModel<typeof librarians>;
