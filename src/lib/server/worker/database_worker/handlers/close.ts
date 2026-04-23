import { databaseWorkerLogger } from '$server/server_loggers';
import { sleep } from 'bun';
import type { DatabaseWorkerContext } from '../database_worker';

export const handleCloseRequest = async (context: DatabaseWorkerContext) => {
	databaseWorkerLogger.warning('Received Close Request!');

	const pragmaStatement = context.db.$client.prepare('PRAGMA wal_checkpoint(TRUNCATE)');

	while (true) {
		const result = pragmaStatement.get() as { busy: number };
		if (result.busy === 0) break;

		databaseWorkerLogger.debug('Waiting for WAL checkpoint!');
		await sleep(1000);
	}

	context.db.$client.close();

	process.exit();
};
