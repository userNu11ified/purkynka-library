import { createUpdateSchema } from 'drizzle-orm/arktype';
import { authorToBook as authorToBookTable } from '$shared/database/tables/junction_tables';

export const authorToBook = createUpdateSchema(authorToBookTable);
