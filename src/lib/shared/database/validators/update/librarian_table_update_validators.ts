import {
	librarians as librarianTable,
	sessions as sessionsTable
} from '$shared/database/tables/librarian_table';
import { createUpdateSchema } from 'drizzle-orm/arktype';

export const librarians = createUpdateSchema(librarianTable);
export const sessions = createUpdateSchema(sessionsTable);
