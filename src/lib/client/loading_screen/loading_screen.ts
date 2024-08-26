import { DATABASE } from '$client/database/database';
import type { Database } from '$shared/database_types';
import { writable, type Writable } from 'svelte/store';

const DATABASE_ENDPOINTS = [
	'authors',
	'book-names',
	'books',
	'reader-classes',
	'readers',
	'borrows',
	'borrow-history',
	'discard-reasons',
	'givers',
	'literature-types',
	'places-of-publishing',
	'publishers',
	'udc'
];

export const TOTAL_STEPS = DATABASE_ENDPOINTS.length;
export const CURRENT_STEP: Writable<number> = writable(0);

const get_endpoint = (endpoint: string) => {
	return fetch(`${window.origin}/api/v1/${endpoint}`)
		.then((res) => res.json())
		.then((json) => {
			CURRENT_STEP.update((v) => v + 1);
			return json;
		});
};

export const load = async () => {
	const requests = await Promise.all(DATABASE_ENDPOINTS.map((v) => get_endpoint(v)));
	DATABASE.set(Object.fromEntries(requests.map((v, i) => [DATABASE_ENDPOINTS[i].replaceAll('-', '_'), v])) as Database);
	await new Promise((res) => setTimeout(res, 1000));
};
