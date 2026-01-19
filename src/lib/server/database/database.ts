import { writable, type Writable } from 'svelte/store';
import fs from 'fs/promises';
import type { Database } from '$shared/database_types';
import { transfer_old_database } from '$server/transfer/transfer';
import { env } from '$env/dynamic/private';

export const create_empty_database = (): Database => {
	return {
		book_names: [],
		publishers: [],
		places_of_publishing: ['Brno', 'Praha'],
		givers: [],
		discard_reasons: ['Opotřebovaná', 'Zastaralá', 'Ztráta'],

		authors: [],

		literature_types: [
			{ short_name: 'N', long_name: 'Naučná' },
			{ short_name: 'B', long_name: 'Beletrie' }
		],
		udc: [],

		reader_classes: [],

		readers: [],

		books: [],
		borrows: [],
		borrow_history: []
	};
};

const get_database = async (): Promise<Database> => {
	const should_transfer_database = JSON.parse(env['SHOULD_TRANSFER_DATABASE'] ?? 'false');

	const file_database = await fs.readFile('./data/database.json', 'utf-8').catch(() => null);

	if (file_database !== null) return JSON.parse(file_database);

	if (!should_transfer_database) return create_empty_database();

	const transferred_database = await transfer_old_database().catch(() => null);

	if (transferred_database !== null) return transferred_database;

	return create_empty_database();
};

const update_database = (database: Database) => {
	database.readers.forEach((reader) => {
		if (reader.added_date != undefined) return;

		(reader.added_date = new Date().toISOString()), (reader.last_modified_date = new Date().toISOString());
	});

	database.readers.forEach((reader) => {
		reader.added_date = null;
		reader.last_modified_date = null;
	});

	return database;
};

export const initialize_database = async (): Promise<void> => {
	await fs.mkdir('./data', { recursive: true });

	const database = update_database(await get_database());

	DATABASE.subscribe((v) => {
		if (v) fs.writeFile('./data/database.json', JSON.stringify(v));
	});
	DATABASE.set(database);
};

export const DATABASE: Writable<Database> = writable();
