import { writable, type Writable } from 'svelte/store';
import fs from 'fs/promises';
import type { Database } from '$shared/database_types';
import { transfer_old_database } from '$server/transfer/transfer';

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

const SHOULD_TRANSFER_OLD_DATABASE = false;
const get_database = async (): Promise<Database> => {
	const file_database = await fs.readFile('./data/database.json', 'utf-8').catch(() => null);

	if (file_database !== null) return JSON.parse(file_database);

	if (!SHOULD_TRANSFER_OLD_DATABASE) return create_empty_database();

	const transferred_database = await transfer_old_database().catch(() => null);

	if (transferred_database !== null) return transferred_database;

	return create_empty_database();
};

export const initialize_database = async (): Promise<void> => {
	await fs.mkdir('./data', { recursive: true });

	const database = await get_database();

	DATABASE.subscribe((v) => {
		if (v) fs.writeFile('./data/database.json', JSON.stringify(v));
	});
	DATABASE.set(database);
};

export const DATABASE: Writable<Database> = writable();
