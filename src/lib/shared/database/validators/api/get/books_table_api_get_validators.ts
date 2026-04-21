import { books as booksTable } from '$shared/database/tables/books_table';
import { type } from 'arktype';
import { createSelectSchema } from 'drizzle-orm/arktype';

export const books = createSelectSchema(booksTable, {
	addDate: (v) => type('string.date.iso.parse').pipe(v),
	discardDate: (v) => type('string.date.iso.parse').pipe(v),
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
