import { DatabaseWorker } from '$server/worker/workers';
import type { DatabaseWorkerResult } from '../database_worker_types';

export type DatabaseWorkerConfig = {
	databaseFilePath: 'env' | 'memory';
};

const createConfigureRequest = (config: DatabaseWorkerConfig) =>
	({
		operation: 'configure',
		config
	}) as const;

export type ConfigureRequest = ReturnType<typeof createConfigureRequest>;
export type ConfigureResponse = true;

export const SendConfigureRequest = (config: DatabaseWorkerConfig) =>
	DatabaseWorker.sendAsyncRequest<DatabaseWorkerResult<ConfigureResponse>>(
		createConfigureRequest(config) as ConfigureRequest
	);
