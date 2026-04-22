import {
	borrowHistory as borrowHistoryTable,
	borrows as borrowsTable
} from '$shared/database/tables/borrow_tables';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const borrows = createInsertSchema(borrowsTable);
export const borrowHistory = createInsertSchema(borrowHistoryTable);
