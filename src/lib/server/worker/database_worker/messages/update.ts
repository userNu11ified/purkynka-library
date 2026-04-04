import type { DatabaseSchema, DatabaseTableName } from '$shared/types/database/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { WhereClause } from './where_clause';
import { DatabaseWorker } from '$server/worker/workers';
import type { DatabaseWorkerResult } from '../database_worker_types';

const createUpdateRequest = <TableName extends DatabaseTableName>(
	tableName: TableName,
	newValue: Partial<InferInsertModel<DatabaseSchema[TableName]>>,
	where?: WhereClause<DatabaseSchema[TableName]>
) => ({ operation: 'update', tableName, newValue, where }) as const;

export type UpdateRequest<TableName extends DatabaseTableName = DatabaseTableName> = ReturnType<
	typeof createUpdateRequest<TableName>
>;

export type UpdateResponse<TableName extends DatabaseTableName = DatabaseTableName> = {
	values: InferSelectModel<DatabaseSchema[TableName]>[];
};

export const SendUpdateRequest = <TableName extends DatabaseTableName>(
	tableName: TableName,
	newValue: Partial<InferInsertModel<DatabaseSchema[TableName]>>,
	where?: WhereClause<DatabaseSchema[TableName]>
) =>
	DatabaseWorker.sendAsyncRequest<DatabaseWorkerResult<UpdateResponse<TableName>>>(
		createUpdateRequest(tableName, newValue, where) as UpdateRequest
	);
