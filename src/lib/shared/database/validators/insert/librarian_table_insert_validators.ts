import { librarians as librarianTable } from '$shared/database/tables/librarian_table';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const librarians = createInsertSchema(librarianTable);
