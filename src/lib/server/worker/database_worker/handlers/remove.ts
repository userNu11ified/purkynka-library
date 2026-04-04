import schema from '$shared/database/schema';
import { Result } from '$shared/types/result';
import type { DatabaseWorkerContext } from '../database_worker';
import type { DatabaseWorkerResult } from '../database_worker_types';
import type { RemoveRequest, RemoveResponse } from '../messages/remove';
import { parseWhereFilter, type WhereClause } from '../messages/where_clause';
import { handleError } from './error';

export const handleRemoveRequest = async (
	context: DatabaseWorkerContext,
	{ tableName, where }: RemoveRequest
): Promise<DatabaseWorkerResult<RemoveResponse>> => {
	const table = schema[tableName];

	try {
		const removedValues = await context.db
			.delete(table)
			.where(
				where !== undefined
					? parseWhereFilter(table, where as WhereClause<typeof table>)
					: undefined
			)
			.returning();
		return Result.ok({ values: removedValues });
	} catch (e) {
		return Result.error(handleError(e));
	}
};
