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
import { type } from 'arktype';

export const bookNames = createInsertSchema(bookNamesTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const authorNames = createInsertSchema(authorNamesTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const publishers = createInsertSchema(publishersTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const placesOfPublishing = createInsertSchema(placesOfPublishingTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const obtainedFrom = createInsertSchema(obtainedFromTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const discardReasons = createInsertSchema(discardReasonsTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const readerClasses = createInsertSchema(readerClassesTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
