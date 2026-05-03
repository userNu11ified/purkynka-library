import { serverLogger } from '$server/server_loggers';
import { SendCloseRequest } from '$server/worker/database_worker/messages/close';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = () => {
	queueMicrotask(async () => {
		serverLogger.warning('Received Restart request!');
		await SendCloseRequest();

		process.exit(200);
	});

	return new Response();
};
