import { DatabaseWorker } from '$server/worker/workers';
import type { DatabaseSchema, DatabaseTableName } from '$shared/types/database/schema';
import type { InferSelectModel } from 'drizzle-orm';
import type { DatabaseWorkerResult } from '../database_worker_types';

const createClearRequest = <TableName extends DatabaseTableName>(tableName: TableName) =>
	({ operation: 'clear', tableName }) as const;

export type ClearRequest<TableName extends DatabaseTableName = DatabaseTableName> = ReturnType<
	typeof createClearRequest<TableName>
>;

export type ClearResponse<TableName extends DatabaseTableName = DatabaseTableName> = {
	values: InferSelectModel<DatabaseSchema[TableName]>;
};

export const SendClearRequest = <TableName extends DatabaseTableName>(tableName: TableName) =>
	DatabaseWorker.sendAsyncRequest<DatabaseWorkerResult<ClearResponse<TableName>>>(
		createClearRequest(tableName) as ClearRequest
	);
