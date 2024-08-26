import type { Author, DatabaseBook, MappedBook, Shorthand } from './book_types';
import type { ID, Nullable } from './common_types';
import type { Database } from './database_types';

export const create_empty_mapped_book = (database: Database, id: ID): MappedBook => {
	const last_book = database.books.at(-1);

	const literature_type = database.literature_types.find((v) => v.short_name === 'N') ?? null;
	const document_number = last_book ? last_book.document_number : null;
	const giver = last_book && last_book.giver ? database.givers[last_book.giver] : null;

	return {
		string_id: `${id + 1}`,
		is_large: false,
		name: null,
		author: [],
		publisher: null,
		place_of_publishing: null,
		year_of_publishing: null,
		edition: null,
		page_count: null,
		literature_type,
		udc: null,
		add_date: new Date(),
		price: null,
		document_number,
		giver,
		annotation: null,
		discard_date: null,
		discard_reason: null,
		discard_document: null,
		note: null
	};
};

export const map_authors = (database: Database, authors: ID[]): Author[] =>
	authors.map((author_id) => database.authors[author_id]);

export const stringify_author = (author: Author) =>
	[author.last_name, author.first_name].filter((v) => v !== null).join(', ');
export const concat_authors = (authors: Author[]) => authors.map((v) => stringify_author(v)).join(' - ');

export const map_date_or_null = (date_string: Nullable<string>) =>
	date_string === null ? null : new Date(date_string);

export const format_date = (date: Date) => date.toLocaleDateString('cs');

export const map_or_null = <T>(database: Database, database_key: keyof Database, id: Nullable<ID>) =>
	id === null ? null : (database[database_key][id] as T);

export const map_id_book = (database: Database, book_id: ID): MappedBook => {
	const {
		name,
		author,
		publisher,
		place_of_publishing,
		literature_type,
		udc,
		add_date,
		giver,
		discard_date,
		discard_reason,
		...rest
	} = database.books[book_id];

	return {
		...rest,
		name: map_or_null<string>(database, 'book_names', name),
		author: map_authors(database, author),
		publisher: map_or_null<string>(database, 'publishers', publisher),
		place_of_publishing: map_or_null<string>(database, 'places_of_publishing', place_of_publishing),
		literature_type: map_or_null<Shorthand>(database, 'literature_types', literature_type),
		udc: map_or_null<Shorthand>(database, 'udc', udc),
		add_date: map_date_or_null(add_date),
		giver: map_or_null<string>(database, 'givers', giver),
		discard_date: map_date_or_null(discard_date),
		discard_reason: map_or_null<string>(database, 'discard_reasons', discard_reason)
	};
};

export const map_database_book = (database: Database, database_book: DatabaseBook): MappedBook => {
	const {
		name,
		author,
		publisher,
		place_of_publishing,
		literature_type,
		udc,
		add_date,
		giver,
		discard_date,
		discard_reason,
		...rest
	} = database_book;

	return {
		...rest,
		name: map_or_null<string>(database, 'book_names', name),
		author: map_authors(database, author),
		publisher: map_or_null<string>(database, 'publishers', publisher),
		place_of_publishing: map_or_null<string>(database, 'places_of_publishing', place_of_publishing),
		literature_type: map_or_null<Shorthand>(database, 'literature_types', literature_type),
		udc: map_or_null<Shorthand>(database, 'udc', udc),
		add_date: map_date_or_null(add_date),
		giver: map_or_null<string>(database, 'givers', giver),
		discard_date: map_date_or_null(discard_date),
		discard_reason: map_or_null<string>(database, 'discard_reasons', discard_reason)
	};
};
