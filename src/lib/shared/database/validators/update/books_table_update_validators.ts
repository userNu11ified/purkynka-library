import { books as booksTable } from '$shared/database/tables/books_table';
import { createUpdateSchema } from 'drizzle-orm/arktype';

export const books = createUpdateSchema(booksTable);
