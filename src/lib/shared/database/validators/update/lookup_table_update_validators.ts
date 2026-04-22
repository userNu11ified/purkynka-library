import { createUpdateSchema } from 'drizzle-orm/arktype';
import {
	authorNames as authorNamesTable,
	bookNames as bookNamesTable,
	discardReasons as discardReasonsTable,
	obtainedFrom as obtainedFromTable,
	placesOfPublishing as placesOfPublishingTable,
	publishers as publishersTable,
	readerClasses as readerClassesTable
} from '$shared/database/tables/lookup_tables';

export const bookNames = createUpdateSchema(bookNamesTable);
export const authorNames = createUpdateSchema(authorNamesTable);
export const publishers = createUpdateSchema(publishersTable);
export const placesOfPublishing = createUpdateSchema(placesOfPublishingTable);
export const obtainedFrom = createUpdateSchema(obtainedFromTable);
export const discardReasons = createUpdateSchema(discardReasonsTable);

export const readerClasses = createUpdateSchema(readerClassesTable);
