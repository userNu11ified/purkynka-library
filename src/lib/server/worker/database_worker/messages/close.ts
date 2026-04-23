import { DatabaseWorker } from '$server/worker/workers';
import type { DatabaseWorkerResult } from '../database_worker_types';

const createCloseRequest = () => ({ operation: 'close' }) as const;

export type CloseRequest = ReturnType<typeof createCloseRequest>;
export type CloseResponse = true;

export const SendCloseRequest = () =>
	DatabaseWorker.sendAsyncRequest<DatabaseWorkerResult<CloseResponse>>(createCloseRequest());
