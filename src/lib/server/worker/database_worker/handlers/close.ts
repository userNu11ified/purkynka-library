import { databaseWorkerLogger } from '$server/server_loggers';
import type { DatabaseWorkerContext } from '../database_worker';
import { Result } from '$shared/types/result';
import type { DatabaseWorkerResult } from '../database_worker_types';
import type { CloseResponse } from '../messages/close';
import { constants } from 'bun:sqlite';

export const handleCloseRequest = async (
	context: DatabaseWorkerContext,
	shouldExitWorker: boolean
): Promise<DatabaseWorkerResult<CloseResponse>> => {
	databaseWorkerLogger.warning('Received Close Request!');

	const rawDb = context.db.$client;
	rawDb.fileControl(constants.SQLITE_FCNTL_PERSIST_WAL, 0);
	rawDb.run('PRAGMA wal_checkpoint(TRUNCATE);');
	rawDb.close();

	if (shouldExitWorker) process.exit();

	return Result.ok(true);
};
