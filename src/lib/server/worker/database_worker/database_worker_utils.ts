import { serverLogger } from '$server/server_loggers';
import { DatabaseTableNames } from '$shared/types/database/schema';
import { Result } from '$shared/types/result';
import { SendClearRequest } from './messages/clear';

export const clearAllDatabaseTables = async () => {
	serverLogger.warning('Clearing all tables!');

	const clearResults = await Promise.all(DatabaseTableNames.map((v) => SendClearRequest(v)));
	const errors = clearResults.filter((v) => Result.isError(v));

	if (errors.length !== 0) {
		serverLogger.fatal('Failed to clear all tables!', { errors });
		throw new Error();
	} else serverLogger.info('Cleared all tables!');
};
