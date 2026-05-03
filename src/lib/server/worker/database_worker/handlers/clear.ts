import { sql } from 'drizzle-orm';
import type { DatabaseWorkerContext } from '../database_worker';
import type { DatabaseWorkerResult } from '../database_worker_types';
import type { ClearRequest, ClearResponse } from '../messages/clear';
import { Result } from '$shared/types/result';
import { handleError } from './error';
import schema from '$shared/database/schema';

export const handleClearRequest = async (
	context: DatabaseWorkerContext,
	{ tableName }: ClearRequest
): Promise<DatabaseWorkerResult<ClearResponse>> => {
	const table = schema[tableName];
	try {
		const removedValues = await context.db.delete(table).returning();

		context.db.run(sql`DELETE from sqlite_sequence WHERE name = ${tableName}`);

		return Result.ok({ values: removedValues });
	} catch (e) {
		return Result.error(handleError(e));
	}
};
