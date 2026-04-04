import schema from '$shared/database/schema';
import { Result } from '$shared/types/result';
import type { DatabaseWorkerContext } from '../database_worker';
import type { DatabaseWorkerResult } from '../database_worker_types';
import type { SelectRequest, SelectResponse } from '../messages/select';
import { parseWhereFilter, type WhereClause } from '../messages/where_clause';
import { handleError } from './error';

export const handleSelectRequest = async (
	context: DatabaseWorkerContext,
	{ tableName, where }: SelectRequest
): Promise<DatabaseWorkerResult<SelectResponse>> => {
	const table = schema[tableName];
	try {
		const selectedValues = await context.db
			.select()
			.from(table)
			.where(
				where !== undefined
					? parseWhereFilter(table, where as WhereClause<typeof table>)
					: undefined
			);

		return Result.ok({ values: selectedValues });
	} catch (e) {
		return Result.error(handleError(e));
	}
};
