import { databaseWorkerLogger } from '$server/server_loggers';
import { Result } from '$shared/types/result';
import type { DatabaseWorkerContext } from '../database_worker';
import type { DatabaseWorkerResult } from '../database_worker_types';
import { initializeDatabase } from '../db';
import type { ConfigureRequest, ConfigureResponse } from '../messages/configure';
import { handleCloseRequest } from './close';

export const handleConfigureRequest = async (
	context: DatabaseWorkerContext,
	{ config }: ConfigureRequest
): Promise<DatabaseWorkerResult<ConfigureResponse>> => {
	databaseWorkerLogger.debug('Reconfiguring Database Worker!');

	if (context.db !== undefined) {
		await handleCloseRequest(context, false);
	}

	context.db = initializeDatabase(config);

	return Result.ok(true);
};
