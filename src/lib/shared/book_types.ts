import * as t from 'io-ts';
import { TDate, TID, TNullable, TNullableString } from './common_types';

export const TShorthand = t.type({
	short_name: t.string,
	long_name: t.string
});

export type Shorthand = t.TypeOf<typeof TShorthand>;

export const TBook = <
	StringType extends t.Mixed,
	AuthorType extends t.Mixed,
	ShorthandType extends t.Mixed,
	DateType extends t.Mixed
>(
	string_type: StringType,
	author_type: AuthorType,
	shorthand_type: ShorthandType,
	date_type: DateType
) =>
	t.type({
		string_id: t.string,
		is_large: t.boolean,

		name: TNullable(string_type),
		author: t.array(author_type),

		publisher: TNullable(string_type),
		place_of_publishing: TNullable(string_type),
		year_of_publishing: TNullableString,
		edition: TNullableString,

		page_count: TNullableString,
		literature_type: TNullable(shorthand_type),
		udc: TNullable(shorthand_type),

		add_date: TNullable(date_type),
		price: TNullableString,
		document_number: TNullableString,
		giver: TNullable(string_type),

		annotation: TNullableString,
		discard_date: TNullable(date_type),
		discard_reason: TNullable(string_type),
		discard_document: TNullableString,
		note: TNullableString
	});

export const TDatabaseBook = TBook(TID, TID, TID, t.string);
export type DatabaseBook = t.TypeOf<typeof TDatabaseBook>;

export const TMappedBook = TBook(t.string, t.string, TShorthand, TDate);
export type MappedBook = t.TypeOf<typeof TMappedBook>;
