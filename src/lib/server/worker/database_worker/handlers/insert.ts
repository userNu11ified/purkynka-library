import schema from '$shared/database/schema';
import { Result } from '$shared/types/result';
import type { DatabaseWorkerContext } from '../database_worker';
import type { DatabaseWorkerResult } from '../database_worker_types';
import type { InsertRequest, InsertResponse } from '../messages/insert';
import { handleError } from './error';

export const handleInsertRequest = async (
	context: DatabaseWorkerContext,
	{ tableName, values }: InsertRequest
): Promise<DatabaseWorkerResult<InsertResponse>> => {
	const table = schema[tableName];
	try {
		const insertedValues = await context.db.insert(table).values(values).returning();
		return Result.ok({ values: insertedValues });
	} catch (e) {
		return Result.error(handleError(e));
	}
};
