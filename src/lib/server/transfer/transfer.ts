import mysql from 'mysql2/promise';
import type {
	TransferAuthor,
	TransferBook,
	TransferBookHasAuthor,
	TransferBookIssue,
	TransferGiver,
	TransferIDMap,
	TransferPlace,
	TransferPublisher,
	TransferSignature,
	TransferTables,
	TransferUDC
} from './transfer_types';
import type { Database } from '$lib/shared/database_types';
import type { Shorthand } from '$lib/shared/book_types';
import { create_empty_database } from '$server/database/database';
import type { ID } from '$shared/common_types';
import fs from 'fs/promises';
import type { DatabaseReader } from '$shared/borrow_types';

const get_tables = async (): Promise<TransferTables> => {
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'knihdb'
	});

	const get_table = <T>(table_name: string): Promise<TransferIDMap<T>> => {
		return connection
			.query(`SELECT * FROM ${table_name}`)
			.then((res) => res[0])
			.then((rows) => (rows as { id: number; last_update: Date }[]).map(({ id, last_update, ...rest }) => [id, rest]))
			.then((mapped_rows) => Object.fromEntries(mapped_rows));
	};

	const tables = {
		author: await get_table<TransferAuthor>('author'),
		book: await get_table<TransferBook>('book'),
		book_has_author: await get_table<TransferBookHasAuthor>('book_has_author'),
		book_issue: await get_table<TransferBookIssue>('book_issue'),
		giver: await get_table<TransferGiver>('giver'),
		place: await get_table<TransferPlace>('place'),
		publisher: await get_table<TransferPublisher>('publisher'),
		signature: await get_table<TransferSignature>('signature'),
		udc: await get_table<TransferUDC>('udc')
	};

	await connection.end();

	return tables;
};

const string_filter = (value: string, current_value: string) => value.trim() === current_value.trim();
const shorthand_filter = (value: Shorthand, current_value: Shorthand) =>
	value.short_name.trim() === current_value.short_name.trim() &&
	value.long_name.trim() === current_value.long_name.trim();

const convert_old_tables = (old_tables: TransferTables): Database => {
	const database = create_empty_database();

	const get_authors = (book_issue_id: number) =>
		Object.values(old_tables.book_has_author)
			.filter((v) => v.idbook_issue === book_issue_id)
			.map((v) => {
				const old_author = old_tables.author[v.idauthor];
				return [old_author.last_name, old_author.first_name].filter((v) => v !== null).join(', ');
			});

	const get_or_add = <T>(value: T, database_key: keyof Database, filter: (value: T, current_value: T) => boolean) => {
		const value_index = database[database_key].findIndex((val) => filter(value, val as T));
		if (value_index !== -1) return value_index as ID;

		return (database[database_key].push(value as any) - 1) as ID;
	};

	Object.entries(old_tables.book).forEach(([book_id, transfer_book]) => {
		const book_issue = old_tables.book_issue[transfer_book.idbook_issue];

		const transfer_name = book_issue.name;
		const transfer_authors = get_authors(transfer_book.idbook_issue);
		const transfer_publisher = old_tables.publisher[book_issue.idpublisher].text;
		const transfer_place = old_tables.place[book_issue.idplace].text;
		const transfer_literature_type = old_tables.signature[book_issue.idsignature].shortcut;
		const transfer_udc = old_tables.udc[book_issue.idudc];
		const transfer_add_date = transfer_book.add_date.toISOString();
		const transfer_giver = old_tables.giver[transfer_book.idgiver].text;
		const transfer_discard_date = transfer_book.discard_date?.toISOString() ?? null;

		database.books.push({
			string_id: book_id,
			is_large: false,
			name: get_or_add(transfer_name.trim(), 'book_names', string_filter),
			author: transfer_authors.map((transfer_author) => get_or_add(transfer_author, 'authors', string_filter)),
			publisher: get_or_add(transfer_publisher.trim(), 'publishers', string_filter),
			place_of_publishing: get_or_add(transfer_place.trim(), 'places_of_publishing', string_filter),
			year_of_publishing: `${book_issue.year}`,
			edition: `${book_issue.issue}`,
			page_count: `${book_issue.page_count}`,
			literature_type: (transfer_literature_type === 'N' || transfer_literature_type === 'MN' ? 0 : 1) as ID,
			udc: get_or_add(
				{ short_name: transfer_udc.label.trim(), long_name: transfer_udc.text.trim() },
				'udc',
				shorthand_filter
			),
			add_date: transfer_add_date,
			price: `${transfer_book.price}`,
			document_number: transfer_book.doc_number,
			giver: get_or_add(transfer_giver.trim(), 'givers', string_filter),
			annotation: null,
			discard_date: transfer_discard_date,
			discard_reason: null,
			discard_document: null,
			note: transfer_book.note
		});
	});

	return database;
};

export const transfer_old_database = async () => {
	const tables = await get_tables();
	const database = convert_old_tables(tables);

	const get_or_add = <T>(value: T, database_key: keyof Database, filter: (value: T, current_value: T) => boolean) => {
		const value_index = database[database_key].findIndex((val) => filter(value, val as T));
		if (value_index !== -1) return value_index as ID;

		return (database[database_key].push(value as any) - 1) as ID;
	};

	const teachers = (await fs.readFile('./data/original/ucitele_zkratky.csv', 'utf-8')).split('\r\n');
	const students = (await fs.readFile('./data/original/zaci_classes.csv', 'utf-8')).split('\r\n');

	const readers = [...teachers, ...students];

	readers.forEach((v, i) => {
		const [last_name, first_name, class_name] = v.split(';');

		const class_id = get_or_add(class_name, 'reader_classes', string_filter);

		const reader: DatabaseReader = {
			id: i as ID,
			name: `${last_name} ${first_name}`,
			class_name: class_id
		};

		database.readers.push(reader);
	});

	return database;
};
