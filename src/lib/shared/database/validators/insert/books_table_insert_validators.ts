import { books as booksTable } from '$shared/database/tables/books_table';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const books = createInsertSchema(booksTable);
