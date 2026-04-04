import { AwaitableWorker } from '$shared/worker/awaitable_worker';
import { initializeDatabase } from './db';
import { type DatabaseWorkerRequest, type DatabaseWorkerResult } from './database_worker_types';
import { handleConfigureRequest } from './handlers/configure';
import { handleSelectRequest } from './handlers/select';
import { handleInsertRequest } from './handlers/insert';
import { handleUpdateRequest } from './handlers/update';
import { handleRemoveRequest } from './handlers/remove';
import type { DatabaseWorkerConfig } from './messages/configure';

declare const self: Worker;

export class DatabaseWorkerContext {
	public config!: DatabaseWorkerConfig;
	public db!: ReturnType<typeof initializeDatabase>;
}

await AwaitableWorker.setupWorker<
	DatabaseWorkerRequest,
	DatabaseWorkerResult,
	DatabaseWorkerContext
>(
	self,
	async () => new DatabaseWorkerContext(),
	async (context, request) => {
		if (request.operation === 'configure') return handleConfigureRequest(context, request);
		else if (request.operation === 'select') return handleSelectRequest(context, request);
		else if (request.operation === 'insert') return handleInsertRequest(context, request);
		else if (request.operation === 'update') return handleUpdateRequest(context, request);
		else return handleRemoveRequest(context, request);
	}
);
