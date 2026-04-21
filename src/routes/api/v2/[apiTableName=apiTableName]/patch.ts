import type { DatabaseWorkerError } from '$server/worker/database_worker/messages/error';
import {
	SendUpdateRequest,
	type UpdateResponse
} from '$server/worker/database_worker/messages/update';
import schema_api_patch_validators from '$shared/database/validators/api/patch/schema_api_patch_validators';
import { requestBodyMalformed, type ValidationError } from '$shared/error/api_error';
import {
	databaseTableNameFromAPITableName,
	isAPIMatchedByIdTableName
} from '$shared/types/database/api';
import { type DatabaseMatchedByIdTableName } from '$shared/types/database/schema';
import { Result } from '$shared/types/result';
import { createValidationResultErrorFromArkErrors } from '$shared/types/validators/validator_util';
import { text } from '@sveltejs/kit';
import { type } from 'arktype';
import type { RequestHandler } from './$types';
import { createAPIErrorResponse, createAPIOkResponse } from './shared';
import { patchByIdBody } from '$shared/types/validators/patch_request_validators';

type PatchError = DatabaseWorkerError | ValidationError;

const patchById = async (
	databaseMatchedByIdTableName: DatabaseMatchedByIdTableName,
	body: any
): Promise<Result<UpdateResponse<DatabaseMatchedByIdTableName>, PatchError>> => {
	const patchBody = patchByIdBody(body);
	if (patchBody instanceof type.errors) return createValidationResultErrorFromArkErrors(patchBody);

	const updateValidator = schema_api_patch_validators[databaseMatchedByIdTableName];
	const newValue = updateValidator(patchBody.newValue);
	if (newValue instanceof type.errors) return createValidationResultErrorFromArkErrors(newValue);

	return SendUpdateRequest<DatabaseMatchedByIdTableName>(databaseMatchedByIdTableName, newValue, {
		filterType: 'inArray',
		columnName: 'id',
		values: patchBody.ids
	});
};

export const handlePatch: RequestHandler = async ({ params, request }) => {
	const apiTableName = params.apiTableName;
	if (!isAPIMatchedByIdTableName(apiTableName))
		return text('PATCH method not allowed', {
			status: 405,
			headers: { Allowed: 'GET, POST, DELETE, HEAD' }
		});

	let body;
	try {
		body = await request.json();
	} catch {
		return createAPIErrorResponse(Result.error(requestBodyMalformed()));
	}

	const databaseMatchedByIdTableName = databaseTableNameFromAPITableName(
		apiTableName
	) as DatabaseMatchedByIdTableName;
	const patchResult = await patchById(databaseMatchedByIdTableName, body);

	if (Result.isError(patchResult)) return createAPIErrorResponse(patchResult);
	return createAPIOkResponse(patchResult);
};
