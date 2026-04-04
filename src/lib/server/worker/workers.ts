import {
	type DatabaseWorkerRequest,
	type DatabaseWorkerResult
} from './database_worker/database_worker_types';
import { AwaitableWorker } from '$shared/worker/awaitable_worker';

export const DatabaseWorker = new AwaitableWorker<DatabaseWorkerRequest, DatabaseWorkerResult>(
	new URL('./database_worker/database_worker.ts', import.meta.url)
);
