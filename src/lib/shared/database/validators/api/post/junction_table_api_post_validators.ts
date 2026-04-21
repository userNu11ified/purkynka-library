import { authorToBook as authorToBookTable } from '$shared/database/tables/junction_tables';
import { type } from 'arktype';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const authorToBook = createInsertSchema(authorToBookTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
