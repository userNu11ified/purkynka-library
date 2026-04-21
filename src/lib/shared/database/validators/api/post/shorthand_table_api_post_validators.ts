import {
	literatureTypes as literatureTypesTable,
	udc as udcTable
} from '$shared/database/tables/shorthand_tables';
import { type } from 'arktype';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const literatureTypes = createInsertSchema(literatureTypesTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const udc = createInsertSchema(udcTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
