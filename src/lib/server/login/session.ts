import { SendInsertRequest } from '$server/worker/database_worker/messages/insert';
import type { RequestEvent } from '@sveltejs/kit';
import crypto from 'node:crypto';

export const generateSessionId = () => crypto.randomBytes(128).toString('hex');

export const createSession = async (librarianId: number) => {
	const sessionId = generateSessionId();
	const currentDate = new Date();
	const expiresAt = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate() + 1
	);

	await SendInsertRequest('sessions', [
		{
			id: sessionId,
			librarianId,
			expiresAt
		}
	]);

	return [sessionId, expiresAt] as [string, Date];
};

export const shouldCheckSession = (event: RequestEvent) => {
	const routeId = event.route.id;
	return (
		routeId?.startsWith('/librarian') ||
		(routeId?.startsWith('/api/v2') && event.request.method !== 'GET')
	);
};
