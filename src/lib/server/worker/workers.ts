import { AwaitableWorker } from '$shared/worker/awaitable_worker';

export const DatabaseWorker = new AwaitableWorker(
	new URL('./database_worker/database_worker.ts', import.meta.url)
);
