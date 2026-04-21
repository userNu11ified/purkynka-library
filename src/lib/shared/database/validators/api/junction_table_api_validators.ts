import { authorToBook as authorToBookTable } from '$shared/database/tables/junction_tables';
import { type } from 'arktype';
import { createSelectSchema } from 'drizzle-orm/arktype';

export const authorToBook = createSelectSchema(authorToBookTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
