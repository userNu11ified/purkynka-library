import { SendSelectRequest } from '$server/worker/database_worker/messages/select';
import { APITableNames } from '$shared/types/database/api';
import { DatabaseTableNames } from '$shared/types/database/schema';
import { Result } from '$shared/types/result';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const handleGet: RequestHandler = async ({ params }) => {
	const { apiTableName } = params;
	const apiTableNameIndex = APITableNames.indexOf(apiTableName);
	const databaseTableName = DatabaseTableNames[apiTableNameIndex]!;

	const selectResult = await SendSelectRequest(databaseTableName);

	return json(Result.flatten(selectResult));
};
