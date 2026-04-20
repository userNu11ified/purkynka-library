import {
	literatureTypes as literatureTypesTable,
	udc as udcTable
} from '$shared/database/tables/shorthand_tables';
import { createUpdateSchema } from 'drizzle-orm/arktype';

export const literatureTypes = createUpdateSchema(literatureTypesTable);
export const udc = createUpdateSchema(udcTable);
