import { SendSelectRequest } from '$server/worker/database_worker/messages/select';
import { json, redirect } from '@sveltejs/kit';
import { Result } from '$shared/types/result';
import { SendUpdateRequest } from '$server/worker/database_worker/messages/update';
import type { RequestHandler } from './$types';
import { type } from 'arktype';
import { hashPassword, verifyPassword } from '$server/login/hash';
import { loginRequestBody } from '$shared/types/login';
import { createSession } from '$server/login/session';
import { SendRemoveRequest } from '$server/worker/database_worker/messages/remove';

const registerLibrarian = async (librarianId: number, password: string) => {
	const passwordHash = await hashPassword(password);

	return SendUpdateRequest(
		'librarians',
		{ password: passwordHash },
		{ filterType: 'eq', columnName: 'id', value: librarianId }
	);
};

const createError = () => new Response(undefined, { status: 400 });

export const POST: RequestHandler = async ({ request, cookies }) => {
	const loginBody = await request.json();
	const loginParameters = loginRequestBody(loginBody);
	if (loginParameters instanceof type.errors) return createError();

	const foundLibrariansResult = await SendSelectRequest('librarians', {
		columnName: 'email',
		filterType: 'eq',
		value: loginParameters.email
	});
	if (Result.isError(foundLibrariansResult)) return createError();

	const foundLibrarians = foundLibrariansResult.value.values;
	if (foundLibrarians.length === 0) return createError();

	const librarian = foundLibrarians[0];
	if (librarian.password === null) {
		const registerResult = await registerLibrarian(librarian.id, loginParameters.password);
		if (Result.isError(registerResult)) return createError();

		const [sessionId, expiresAt] = await createSession(librarian.id);
		cookies.set('session', sessionId, {
			secure: true,
			httpOnly: true,
			path: '/',
			expires: expiresAt
		});
		return new Response();
	}

	const hashMatches = await verifyPassword(loginParameters.password, librarian.password!);
	if (!hashMatches) return createError();

	const sessionDeleteResult = await SendRemoveRequest('sessions', {
		filterType: 'eq',
		columnName: 'librarianId',
		value: librarian.id
	});
	if (Result.isError(sessionDeleteResult)) return createError();

	const [sessionId, expiresAt] = await createSession(librarian.id);
	cookies.set('session', sessionId, {
		secure: true,
		httpOnly: true,
		path: '/',
		expires: expiresAt
	});

	return new Response();
};
