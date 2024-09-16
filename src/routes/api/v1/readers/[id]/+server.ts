import { DATABASE } from '$server/database/database';
import { create_database_deleter, create_database_putter, is_authenticated } from '$server/request/request';
import { TDatabaseReader } from '$shared/borrow_types';
import type { ID } from '$shared/common_types';
import type { RequestHandler } from '@sveltejs/kit';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { get } from 'svelte/store';
import { isLeft } from 'fp-ts/Either';

export const PUT: RequestHandler = async ({ params, request }) => {
	const authenticated = is_authenticated(request);
	if (authenticated !== null) return authenticated;

	const id_parameter = params['id'];
	if (id_parameter === undefined) return new Response('ID not set!', { status: 400 });

	const id = +id_parameter as ID;
	if (isNaN(id) || id < 0) return new Response('Invalid ID!', { status: 400 });
	if (get(DATABASE).readers.findIndex((v) => v.id === id) === -1) return new Response('ID not found!', { status: 400 });

	const body = await request.json().catch(() => undefined);
	if (body === undefined)
		return new Response('Invalid body!', {
			status: 400
		});

	const body_validation = TDatabaseReader.decode(body);

	if (isLeft(body_validation))
		return new Response(`Could not parse data for reader!\n${PathReporter.report(body_validation).join('\n')}`, {
			status: 400
		});

	const data = body_validation.right;

	DATABASE.update((v) => {
		v.readers[v.readers.findIndex((v) => v.id === id)] = data as any;
		return v;
	});

	return new Response();
};

// export const PUT = create_database_putter('readers', TDatabaseReader);
export const DELETE: RequestHandler = async ({ request, params }) => {
	const authenticated = is_authenticated(request);
	if (authenticated !== null) return authenticated;

	const id_parameter = params['id'];
	if (id_parameter === undefined) return new Response('ID not set!', { status: 400 });

	const id = +id_parameter as ID;
	if (isNaN(id) || id < 0) return new Response('Invalid ID!', { status: 400 });
	if (get(DATABASE).readers.findIndex((v) => v.id === id) === -1)
		return new Response('ID out of range!', { status: 400 });

	DATABASE.update((v) => {
		v.readers.splice(
			v.readers.findIndex((v) => v.id === id),
			1
		);
		return v;
	});

	return new Response();
};
