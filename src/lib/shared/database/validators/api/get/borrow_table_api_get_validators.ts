import {
	borrowHistory as borrowHistoryTable,
	borrows as borrowsTable
} from '$shared/database/tables/borrow_tables';
import { type } from 'arktype';
import { createSelectSchema } from 'drizzle-orm/arktype';

export const borrows = createSelectSchema(borrowsTable, {
	borrowDate: () => type('string.date.iso.parse'),
	returnDate: () => type('string.date.iso.parse | null'),
	createdOn: () => type('string.date.iso.parse'),
	updatedOn: () => type('string.date.iso.parse')
});

export const borrowHistory = createSelectSchema(borrowHistoryTable, {
	borrowDate: () => type('string.date.iso.parse'),
	returnDate: () => type('string.date.iso.parse | null'),
	createdOn: () => type('string.date.iso.parse'),
	updatedOn: () => type('string.date.iso.parse')
});
