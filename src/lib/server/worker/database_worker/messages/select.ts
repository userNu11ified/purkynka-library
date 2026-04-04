import type { DatabaseSchema, DatabaseTableName } from '$shared/types/database/schema';
import type { InferSelectModel } from 'drizzle-orm';
import type { WhereClause } from './where_clause';
import type { DatabaseWorkerResult } from '../database_worker_types';
import { DatabaseWorker } from '$server/worker/workers';

const createSelectRequest = <TableName extends DatabaseTableName>(
	tableName: TableName,
	where?: WhereClause<DatabaseSchema[TableName]>
) => ({ operation: 'select', tableName, where }) as const;

export type SelectRequest<TableName extends DatabaseTableName = DatabaseTableName> = ReturnType<
	typeof createSelectRequest<TableName>
>;

export type SelectResponse<TableName extends DatabaseTableName = DatabaseTableName> = {
	values: InferSelectModel<DatabaseSchema[TableName]>[];
};

export const SendSelectRequest = <TableName extends DatabaseTableName>(
	tableName: TableName,
	where?: WhereClause<DatabaseSchema[TableName]>
) =>
	DatabaseWorker.sendAsyncRequest<DatabaseWorkerResult<SelectResponse<TableName>>>(
		createSelectRequest(tableName, where) as SelectRequest
	);
