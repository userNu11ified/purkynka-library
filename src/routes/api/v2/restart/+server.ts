import { serverLogger } from '$server/server_loggers';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = () => {
	queueMicrotask(async () => {
		serverLogger.warning('Received Restart request!');
		process.exit();
	});

	return new Response();
};
