import { primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { foreignKeyId, timestampColumns } from '../schema_utils';
import { books } from './books_table';
import { authorNames } from './lookup_tables';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const authorToBook = sqliteTable(
	'authorToBook',
	{
		bookId: foreignKeyId(books.id).notNull(),
		authorId: foreignKeyId(authorNames.id).notNull(),

		...timestampColumns()
	},
	(s) => [
		primaryKey({
			columns: [s.bookId, s.authorId]
		})
	]
);

export type AuthorToBookSelect = InferSelectModel<typeof authorToBook>;
export type AuthorToBookInsert = InferInsertModel<typeof authorToBook>;
