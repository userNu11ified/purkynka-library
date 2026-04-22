import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { boolean, date, foreignKeyId, primaryKeyId, timestampColumns } from '../schema_utils';
import { books } from './books_table';
import { readers } from './readers_table';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const borrows = sqliteTable('borrows', {
	id: primaryKeyId(),

	bookId: foreignKeyId(books.id).notNull(),
	readerId: foreignKeyId(readers.id).notNull(),

	borrowDate: date().notNull(),
	timesExtended: int().default(0),
	returnDate: date(),
	permanent: boolean().notNull().default(false),

	...timestampColumns()
});

export const borrowHistory = sqliteTable('borrowHistory', {
	borrowId: primaryKeyId(),
	bookId: int().notNull(),

	readerName: text().notNull(),
	readerClass: text().notNull(),

	borrowDate: date().notNull(),
	timesExtended: int(),
	returnDate: date(),
	permanent: boolean().notNull(),

	...timestampColumns()
});

export type BorrowSelect = InferSelectModel<typeof borrows>;
export type BorrowHistorySelect = InferSelectModel<typeof borrowHistory>;

export type BorrowInsert = InferInsertModel<typeof borrows>;
export type BorrowHistoryInsert = InferInsertModel<typeof borrowHistory>;
