import {
	borrowHistory as borrowHistoryTable,
	borrows as borrowsTable
} from '$shared/database/tables/borrow_tables';
import { createUpdateSchema } from 'drizzle-orm/arktype';

export const borrows = createUpdateSchema(borrowsTable);
export const borrowHistory = createUpdateSchema(borrowHistoryTable);
