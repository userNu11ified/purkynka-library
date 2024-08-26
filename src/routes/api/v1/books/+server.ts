import { create_database_getter, is_authenticated } from '$lib/server/request/request';
import { DATABASE } from '$server/database/database';
import { TBookRequest } from '$shared/request_types';
import type { RequestHandler } from '@sveltejs/kit';
import { isLeft } from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter';

export const GET = create_database_getter('books');
export const POST: RequestHandler = async ({ request }) => {
	const authenticated = is_authenticated(request);
	if (authenticated !== null) return authenticated;

	const body = await request.json().catch(() => undefined);
	if (body === undefined)
		return new Response('Invalid body!', {
			status: 400
		});

	const validation = TBookRequest.decode(body);
	if (isLeft(validation)) {
		return new Response(`Failed to parse entry into books!\n${PathReporter.report(validation).join('\n')}`, {
			status: 400
		});
	}

	const book_request = validation.right;
	const base_string_id = +book_request.data.string_id;

	DATABASE.update((v) => {
		new Array(book_request.amount)
			.fill(null)
			.map((v, i) => `${base_string_id + i}`)
			.forEach((shifted_string_id) => {
				const new_book = structuredClone(book_request.data);
				new_book['string_id'] = shifted_string_id;

				v.books.push(new_book);
			});
		return v;
	});

	return new Response();
};
