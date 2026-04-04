import type { DatabaseSchema, DatabaseTableName } from '$shared/types/database/schema';
import type { InferSelectModel } from 'drizzle-orm';
import type { WhereClause } from './where_clause';
import { DatabaseWorker } from '$server/worker/workers';
import type { DatabaseWorkerResult } from '../database_worker_types';

const createRemoveRequest = <TableName extends DatabaseTableName>(
	tableName: TableName,
	where?: WhereClause<DatabaseSchema[TableName]>
) => ({ operation: 'remove', tableName, where }) as const;

export type RemoveRequest<TableName extends DatabaseTableName = DatabaseTableName> = ReturnType<
	typeof createRemoveRequest<TableName>
>;

export type RemoveResponse<TableName extends DatabaseTableName = DatabaseTableName> = {
	values: InferSelectModel<DatabaseSchema[TableName]>[];
};

export const SendRemoveRequest = <TableName extends DatabaseTableName>(
	tableName: TableName,
	where?: WhereClause<DatabaseSchema[TableName]>
) =>
	DatabaseWorker.sendAsyncRequest<DatabaseWorkerResult<RemoveResponse<TableName>>>(
		createRemoveRequest(tableName, where) as RemoveRequest
	);
