import { SendInsertRequest } from '$server/worker/database_worker/messages/insert';
import { SendSelectRequest } from '$server/worker/database_worker/messages/select';
import schema_insert_validators from '$shared/database/validators/insert/schema_insert_validators';
import { requestBodyMalformed, validationError } from '$shared/error/api_error';
import { APITableNames } from '$shared/types/database/api';
import { DatabaseTableNames } from '$shared/types/database/schema';
import { Result } from '$shared/types/result';
import { json } from '@sveltejs/kit';
import { type } from 'arktype';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { apiTableName } = params;
	const apiTableNameIndex = APITableNames.indexOf(apiTableName);
	const databaseTableName = DatabaseTableNames[apiTableNameIndex]!;

	const selectResult = await SendSelectRequest(databaseTableName);

	return json(Result.flatten(selectResult));
};

export const POST: RequestHandler = async ({ params, request }) => {
	const { apiTableName } = params;
	const apiTableNameIndex = APITableNames.indexOf(apiTableName);
	const databaseTableName = DatabaseTableNames[apiTableNameIndex]!;

	let body;
	try {
		body = await request.json();
	} catch (e) {
		return json(Result.flatten(Result.error(requestBodyMalformed())));
	}

	const insertValidator = schema_insert_validators[databaseTableName].array();
	const validatedData = insertValidator(body);

	if (validatedData instanceof type.errors) {
		return json(
			Result.flatten(Result.error(validationError({ errorSummary: validatedData.summary })))
		);
	}

	const insertResponse = await SendInsertRequest(databaseTableName, validatedData);
	return json(Result.flatten(insertResponse));
};
