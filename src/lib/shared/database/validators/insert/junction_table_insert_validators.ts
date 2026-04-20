import { authorToBook as authorToBookTable } from '$shared/database/tables/junction_tables';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const authorToBook = createInsertSchema(authorToBookTable);
