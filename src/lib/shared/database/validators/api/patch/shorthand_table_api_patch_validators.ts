import {
	literatureTypes as literatureTypesTable,
	udc as udcTable
} from '$shared/database/tables/shorthand_tables';
import { type } from 'arktype';
import { createUpdateSchema } from 'drizzle-orm/arktype';

export const literatureTypes = createUpdateSchema(literatureTypesTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const udc = createUpdateSchema(udcTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
