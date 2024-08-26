import { DATABASE } from '$server/database/database';
import type { Database } from '$shared/database_types';
import type { RequestHandler } from '@sveltejs/kit';
import type { Props, StringC, Type, TypeC } from 'io-ts';
import { get } from 'svelte/store';
import { isLeft } from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter';
import type { ID, Nullable } from '$shared/common_types';
import { PASSWORD } from '$server/password/password';

export const is_authenticated = (request: Request) => {
	const saved_password = get(PASSWORD);
	if (saved_password === null)
		return new Response('Authentication not set up!', {
			status: 401
		});

	const header_password = request.headers.get('Authorization');
	if (header_password === null || header_password !== saved_password)
		return new Response('Invalid password!', {
			status: 401
		});

	return null;
};

export const create_database_getter = (database_key: keyof Database) => {
	return (() => {
		return new Response(JSON.stringify(get(DATABASE)[database_key]));
	}) as RequestHandler;
};

export const create_database_poster = <T extends Props>(database_key: keyof Database, codec: TypeC<T> | StringC) => {
	return (async ({ request }) => {
		const authenticated = is_authenticated(request);
		if (authenticated !== null) return authenticated;

		const body = await request.json().catch(() => undefined);
		if (body === undefined)
			return new Response('Invalid body!', {
				status: 400
			});

		const validation = codec.decode(body);
		if (isLeft(validation)) {
			return new Response(`Could not parse data for ${database_key}!\n${PathReporter.report(validation).join('\n')}`, {
				status: 400
			});
		}

		const value = validation.right;
		DATABASE.update((v) => {
			v[database_key].push(value as any);
			return v;
		});

		return new Response();
	}) as RequestHandler;
};

export const create_database_putter = <T extends Props>(database_key: keyof Database, codec: TypeC<T> | StringC) => {
	return (async ({ params, request }) => {
		const authenticated = is_authenticated(request);
		if (authenticated !== null) return authenticated;

		const id_parameter = params['id'];
		if (id_parameter === undefined) return new Response('ID not set!', { status: 400 });

		const id = +id_parameter as ID;
		if (isNaN(id) || id < 0) return new Response('Invalid ID!', { status: 400 });
		if (Object.keys(get(DATABASE)[database_key]).length <= id) return new Response('ID out of range!', { status: 400 });

		const body = await request.json().catch(() => undefined);
		if (body === undefined)
			return new Response('Invalid body!', {
				status: 400
			});

		const body_validation = codec.decode(body);

		if (isLeft(body_validation))
			return new Response(
				`Could not parse data for ${database_key}!\n${PathReporter.report(body_validation).join('\n')}`,
				{ status: 400 }
			);

		const data = body_validation.right;

		DATABASE.update((v) => {
			v[database_key][id] = data as any;
			return v;
		});

		return new Response();
	}) as RequestHandler;
};

export const create_database_deleter = (database_key: keyof Database) => {
	return (async ({ request, params }) => {
		const authenticated = is_authenticated(request);
		if (authenticated !== null) return authenticated;

		const id_parameter = params['id'];
		if (id_parameter === undefined) return new Response('ID not set!', { status: 400 });

		const id = +id_parameter as ID;
		if (isNaN(id) || id < 0) return new Response('Invalid ID!', { status: 400 });
		if (Object.keys(get(DATABASE)[database_key]).length <= id) return new Response('ID out of range!', { status: 400 });

		DATABASE.update((v) => {
			v[database_key].splice(id, 1);
			return v;
		});

		return new Response();
	}) as RequestHandler;
};
