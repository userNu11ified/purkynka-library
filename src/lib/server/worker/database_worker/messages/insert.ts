import { DatabaseWorker } from '$server/worker/workers';
import type { DatabaseSchema, DatabaseTableName } from '$shared/types/database/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { DatabaseWorkerResult } from '../database_worker_types';

const createInsertRequest = <TableName extends DatabaseTableName>(
	tableName: TableName,
	values: InferInsertModel<DatabaseSchema[TableName]>[]
) => ({ operation: 'insert', tableName, values }) as const;

export type InsertRequest<TableName extends DatabaseTableName = DatabaseTableName> = ReturnType<
	typeof createInsertRequest<TableName>
>;

export type InsertResponse<TableName extends DatabaseTableName = DatabaseTableName> = {
	values: InferSelectModel<DatabaseSchema[TableName]>[];
};

export const SendInsertRequest = <TableName extends DatabaseTableName>(
	tableName: TableName,
	values: InferInsertModel<DatabaseSchema[TableName]>[]
) =>
	DatabaseWorker.sendAsyncRequest<DatabaseWorkerResult<InsertResponse<TableName>>>(
		createInsertRequest(tableName, values) as InsertRequest
	);
