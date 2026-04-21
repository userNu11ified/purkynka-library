import { books as booksTable } from '$shared/database/tables/books_table';
import { type } from 'arktype';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const books = createInsertSchema(booksTable, {
	addDate: (v) => type('string.date.iso.parse').pipe(v),
	discardDate: (v) => type('string.date.iso.parse').pipe(v),
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
