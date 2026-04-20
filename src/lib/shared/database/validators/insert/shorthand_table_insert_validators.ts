import {
	literatureTypes as literatureTypesTable,
	udc as udcTable
} from '$shared/database/tables/shorthand_tables';
import { createInsertSchema } from 'drizzle-orm/arktype';

export const literatureTypes = createInsertSchema(literatureTypesTable);
export const udc = createInsertSchema(udcTable);
