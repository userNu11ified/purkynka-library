import {
	borrowHistory as borrowHistoryTable,
	borrows as borrowsTable
} from '$shared/database/tables/borrow_tables';
import { type } from 'arktype';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const borrows = createInsertSchema(borrowsTable, {
	borrowDate: () => type('string.date.iso.parse'),
	returnDate: () => type('string.date.iso.parse | null'),
	createdOn: () => type('string.date.iso.parse | undefined'),
	updatedOn: () => type('string.date.iso.parse | undefined')
});

export const borrowHistory = createInsertSchema(borrowHistoryTable, {
	borrowDate: () => type('string.date.iso.parse'),
	returnDate: () => type('string.date.iso.parse | null'),
	createdOn: () => type('string.date.iso.parse | undefined'),
	updatedOn: () => type('string.date.iso.parse | undefined')
});
