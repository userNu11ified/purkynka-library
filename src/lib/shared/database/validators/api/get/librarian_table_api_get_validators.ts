import {
	librarians as librarianTable,
	sessions as sessionsTable
} from '$shared/database/tables/librarian_table';
import { type } from 'arktype';
import { createSelectSchema } from 'drizzle-orm/arktype';

export const librarians = createSelectSchema(librarianTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});

export const sessions = createSelectSchema(sessionsTable);
