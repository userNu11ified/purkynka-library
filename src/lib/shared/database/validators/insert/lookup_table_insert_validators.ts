import { createInsertSchema } from 'drizzle-orm/arktype';
import {
	authorNames as authorNamesTable,
	bookNames as bookNamesTable,
	discardReasons as discardReasonsTable,
	obtainedFrom as obtainedFromTable,
	placesOfPublishing as placesOfPublishingTable,
	publishers as publishersTable,
	readerClasses as readerClassesTable
} from '$shared/database/tables/lookup_tables';

export const bookNames = createInsertSchema(bookNamesTable);
export const authorNames = createInsertSchema(authorNamesTable);
export const publishers = createInsertSchema(publishersTable);
export const placesOfPublishing = createInsertSchema(placesOfPublishingTable);
export const obtainedFrom = createInsertSchema(obtainedFromTable);
export const discardReasons = createInsertSchema(discardReasonsTable);

export const readerClasses = createInsertSchema(readerClassesTable);
