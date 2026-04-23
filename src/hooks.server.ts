import '$shared/database/validators/validator_config';
import { createDatabaseBackup } from '$server/backup/backup';
import { importOldData } from '$server/import/import_old';
import { serverLogger } from '$server/server_loggers';
import { SendConfigureRequest } from '$server/worker/database_worker/messages/configure';
import { Result } from '$shared/types/result';
import { env } from 'bun';
import { initializeAdminUser } from '$server/login/admin';
import { SendCloseRequest } from '$server/worker/database_worker/messages/close';
import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { SendSelectRequest } from '$server/worker/database_worker/messages/select';
import { shouldCheckSession } from '$server/login/session';
import { SendRemoveRequest } from '$server/worker/database_worker/messages/remove';

process.on('SIGINT', async () => {
	console.log();
	serverLogger.warning('Received SIGINT! Closing.');

	await SendCloseRequest();
	process.exit();
});

if (env.DB_FILE_NAME === undefined)
	throw new Error('.env file is missing required DB_FILE_NAME key!');

if (env.ADMIN_PASSWORD === undefined)
	throw new Error('.env file is missing required ADMIN_PASSWORD key!');

if (env.IMPORT_OLD_DATA !== undefined) await createDatabaseBackup('pre-import');
const configureResult = await SendConfigureRequest({
	databaseFilePath: 'env'
});

if (Result.isError(configureResult)) {
	serverLogger.fatal('Failed to configure Database Worker!', { e: configureResult.value });
}

serverLogger.info('Database Worker Initialized!');

if (env.IMPORT_OLD_DATA !== undefined) await importOldData(env.IMPORT_OLD_DATA);

await initializeAdminUser(env.ADMIN_PASSWORD);

export const handle: Handle = async ({ event, resolve }) => {
	if (shouldCheckSession(event)) {
		const { cookies, url } = event;

		const sessionId = cookies.get('session');
		if (sessionId === undefined) redirect(303, `/login?redirectTo=${url.pathname}`);

		const sessionResult = await SendSelectRequest('sessions', {
			filterType: 'eq',
			columnName: 'id',
			value: sessionId
		});
		if (Result.isError(sessionResult)) {
			serverLogger.fatal('Failed to get sessions!', { error: sessionResult.value });
			throw new Error();
		}

		const sessions = sessionResult.value.values;
		if (sessions.length === 0) redirect(303, `/login?redirectTo=${url.pathname}`);

		const session = sessions[0];
		if (new Date().getTime() > session.expiresAt.getTime()) {
			const sessionDeleteResult = await SendRemoveRequest('sessions', {
				filterType: 'eq',
				columnName: 'id',
				value: sessionId
			});
			if (Result.isError(sessionDeleteResult)) {
				serverLogger.fatal('Failed to get sessions!', { error: sessionDeleteResult.value });
				throw new Error();
			}

			cookies.delete('session', { path: '/' });

			redirect(303, `/login?redirectTo=${url.pathname}`);
		}
	}
	return resolve(event);
};
