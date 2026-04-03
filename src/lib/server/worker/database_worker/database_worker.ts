import { serverLogger } from '$server/server_loggers';
import { AwaitableWorker } from '$shared/worker/awaitable_worker';
import { initializeDatabase } from './db';

declare const self: Worker;

export const databaseWorkerLogger = serverLogger.subnamespace(['Database Worker']);

await AwaitableWorker.setupWorker(
	self,
	async () => initializeDatabase(),
	async () => ({})
);
