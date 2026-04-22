import { readers as readersTable } from '$shared/database/tables/readers_table';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const readers = createInsertSchema(readersTable);
