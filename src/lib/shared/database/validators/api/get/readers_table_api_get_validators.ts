import { readers as readersTable } from '$shared/database/tables/readers_table';
import { type } from 'arktype';
import { createSelectSchema } from 'drizzle-orm/arktype';

export const readers = createSelectSchema(readersTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
