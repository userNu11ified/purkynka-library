import { AwaitableWorker } from '$shared/worker/awaitable_worker';
import { initializeDatabase } from './db';

declare const self: Worker;

await AwaitableWorker.setupWorker(
	self,
	async () => initializeDatabase(),
	async () => ({})
);
