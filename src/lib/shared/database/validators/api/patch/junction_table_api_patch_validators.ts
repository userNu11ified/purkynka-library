import { authorToBook as authorToBookTable } from '$shared/database/tables/junction_tables';
import { type } from 'arktype';
import { createUpdateSchema } from 'drizzle-orm/arktype';

export const authorToBook = createUpdateSchema(authorToBookTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
