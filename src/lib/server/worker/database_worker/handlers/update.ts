import schema from '$shared/database/schema';
import { Result } from '$shared/types/result';
import type { DatabaseWorkerContext } from '../database_worker';
import type { DatabaseWorkerResult } from '../database_worker_types';
import type { UpdateRequest, UpdateResponse } from '../messages/update';
import { parseWhereFilter, type WhereClause } from '../messages/where_clause';
import { handleError } from './error';

export const handleUpdateRequest = async (
	context: DatabaseWorkerContext,
	{ tableName, newValue, where }: UpdateRequest
): Promise<DatabaseWorkerResult<UpdateResponse>> => {
	const table = schema[tableName];
	try {
		const updatedValues = await context.db
			.update(table)
			.set(newValue)
			.where(
				where !== undefined
					? parseWhereFilter(table, where as WhereClause<typeof table>)
					: undefined
			)
			.returning();
		return Result.ok({ values: updatedValues });
	} catch (e) {
		return Result.error(handleError(e));
	}
};
