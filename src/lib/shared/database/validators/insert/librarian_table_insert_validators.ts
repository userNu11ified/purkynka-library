import {
	librarians as librarianTable,
	sessions as sessionsTable
} from '$shared/database/tables/librarian_table';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const librarians = createInsertSchema(librarianTable);
export const sessions = createInsertSchema(sessionsTable);
