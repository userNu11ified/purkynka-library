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
import { type } from 'arktype';

export const bookNames = createUpdateSchema(bookNamesTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const authorNames = createUpdateSchema(authorNamesTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const publishers = createUpdateSchema(publishersTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const placesOfPublishing = createUpdateSchema(placesOfPublishingTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const obtainedFrom = createUpdateSchema(obtainedFromTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const discardReasons = createUpdateSchema(discardReasonsTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const readerClasses = createUpdateSchema(readerClassesTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
