import { readers as readersTable } from '$shared/database/tables/readers_table';
import { createUpdateSchema } from 'drizzle-orm/arktype';

export const readers = createUpdateSchema(readersTable);
