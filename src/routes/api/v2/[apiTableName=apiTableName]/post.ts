import { SendInsertRequest } from '$server/worker/database_worker/messages/insert';
import { requestBodyMalformed } from '$shared/error/api_error';
import { APITableNames } from '$shared/types/database/api';
import { DatabaseTableNames } from '$shared/types/database/schema';
import { Result } from '$shared/types/result';
import { createValidationResultErrorFromArkErrors } from '$shared/types/validators/validator_util';
import { json } from '@sveltejs/kit';
import { type } from 'arktype';
import type { RequestHandler } from './$types';
import { createAPIErrorResponse } from './shared';
import { APIPostValidators } from '$shared/database/validators/api/post/schema_api_post_validators';

export const handlePost: RequestHandler = async ({ params, request }) => {
	const { apiTableName } = params;
	const apiTableNameIndex = APITableNames.indexOf(apiTableName);
	const databaseTableName = DatabaseTableNames[apiTableNameIndex]!;

	let body;
	try {
		body = await request.json();
	} catch (e) {
		return createAPIErrorResponse(Result.error(requestBodyMalformed()));
	}

	const insertValidator = APIPostValidators[databaseTableName].array();
	const validatedData = insertValidator(body);

	if (validatedData instanceof type.errors)
		return createAPIErrorResponse(createValidationResultErrorFromArkErrors(validatedData));

	const insertResponse = await SendInsertRequest(databaseTableName, validatedData);
	return json(Result.flatten(insertResponse));
};
