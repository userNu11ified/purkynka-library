import { librarians as librarianTable } from '$shared/database/tables/librarian_table';
import { createUpdateSchema } from 'drizzle-orm/arktype';

export const librarians = createUpdateSchema(librarianTable);
