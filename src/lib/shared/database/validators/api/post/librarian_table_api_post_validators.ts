import { librarians as librarianTable } from '$shared/database/tables/librarian_table';
import { type } from 'arktype';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const librarians = createInsertSchema(librarianTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
