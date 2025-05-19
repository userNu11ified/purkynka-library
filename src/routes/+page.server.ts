import { DATABASE } from '$server/database/database';
import { get } from 'svelte/store';
import type { PageServerLoad } from './$types';

export const ssr = false;

export const load: PageServerLoad = async () => {
	const database = get(DATABASE);

	return {
		book_count: database.books.length,
		borrow_count: database.borrows.length
	};
};
