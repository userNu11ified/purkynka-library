import { serverLogger } from '$server/server_loggers';
import { DatabaseWorker } from '$server/worker/workers';

await DatabaseWorker.initialized.then(() => serverLogger.info('Database Worker Initialized!'));
