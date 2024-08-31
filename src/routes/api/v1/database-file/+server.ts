import { DATABASE } from '$server/database/database';
import type { RequestHandler } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { TDatabase } from '$shared/database_types';
import { isLeft } from 'fp-ts/Either';

export const GET: RequestHandler = () => {
	const database = JSON.stringify(get(DATABASE));

	const headers = new Headers();
	headers.append('Content-Type', 'text/json');
	headers.append('Content-Disposition', `attachment; filename=database.json`);

	return new Response(database, {
		headers
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const new_database = JSON.parse(new TextDecoder().decode(await request.arrayBuffer()));
	const validation = TDatabase.decode(new_database);
	if (isLeft(validation)) {
		return new Response('Invalid database file format!', {
			status: 400
		});
	}

	const database = validation.right;
	DATABASE.set(database);

	return new Response();
};
