import { createSelectSchema } from 'drizzle-orm/arktype';
import {
	authorNames as authorNamesTable,
	bookNames as bookNamesTable,
	discardReasons as discardReasonsTable,
	obtainedFrom as obtainedFromTable,
	placesOfPublishing as placesOfPublishingTable,
	publishers as publishersTable
} from '$shared/database/tables/lookup_tables';
import { type } from 'arktype';

export const bookNames = createSelectSchema(bookNamesTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const authorNames = createSelectSchema(authorNamesTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const publishers = createSelectSchema(publishersTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const placesOfPublishing = createSelectSchema(placesOfPublishingTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const obtainedFrom = createSelectSchema(obtainedFromTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
export const discardReasons = createSelectSchema(discardReasonsTable, {
	createdOn: (v) => type('string.date.iso.parse').pipe(v),
	updatedOn: (v) => type('string.date.iso.parse').pipe(v)
});
