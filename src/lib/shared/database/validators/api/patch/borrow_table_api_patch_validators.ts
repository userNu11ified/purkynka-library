import {
	borrowHistory as borrowHistoryTable,
	borrows as borrowsTable
} from '$shared/database/tables/borrow_tables';
import { type } from 'arktype';
import { createUpdateSchema } from 'drizzle-orm/arktype';

export const borrows = createUpdateSchema(borrowsTable, {
	borrowDate: () => type('string.date.iso.parse'),
	returnDate: () => type('string.date.iso.parse | null'),
	createdOn: () => type('string.date.iso.parse'),
	updatedOn: () => type('string.date.iso.parse')
});

export const borrowHistory = createUpdateSchema(borrowHistoryTable, {
	borrowDate: () => type('string.date.iso.parse'),
	returnDate: () => type('string.date.iso.parse | null'),
	createdOn: () => type('string.date.iso.parse'),
	updatedOn: () => type('string.date.iso.parse')
});
