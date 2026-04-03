import { primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { foreignKeyId } from '../schema_utils';
import { books } from './books_table';
import { authorNames } from './lookup_tables';

export const authorToBook = sqliteTable(
	'authorToBook',
	{
		bookId: foreignKeyId(books.id),
		authorId: foreignKeyId(authorNames.id)
	},
	(s) => [
		primaryKey({
			columns: [s.bookId, s.authorId]
		})
	]
);
