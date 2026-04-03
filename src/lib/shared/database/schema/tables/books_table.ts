import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { boolean, date, foreignKeyId, primaryKeyId, timestampColumns } from '../schema_utils';
import {
	bookNames,
	discardReasons,
	obtainedFrom,
	placesOfPublishing,
	publishers
} from './lookup_tables';
import { literatureTypes, udc } from './shorthand_tables';

export const books = sqliteTable('books', {
	id: primaryKeyId(),

	isLarge: boolean().notNull().default(false),
	bookNameId: foreignKeyId(bookNames.id),

	publisherId: foreignKeyId(publishers.id),
	placeOfPublishingId: foreignKeyId(placesOfPublishing.id),
	yearOfPublishing: text(),

	edition: text(),
	pageCount: text(),

	literatureTypeId: foreignKeyId(literatureTypes.id),
	udcId: foreignKeyId(udc.id),

	addDate: date(),
	price: text(),
	documentNumber: text(),
	obtainedFromId: foreignKeyId(obtainedFrom.id),

	discardDate: date(),
	discardReasonId: foreignKeyId(discardReasons.id),
	discardDocument: text(),

	annotation: text(),
	note: text(),

	...timestampColumns()
});
