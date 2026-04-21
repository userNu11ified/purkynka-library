import type { DatabaseWorkerError } from '$server/worker/database_worker/messages/error';
import {
	SendRemoveRequest,
	type RemoveResponse
} from '$server/worker/database_worker/messages/remove';
import type { WhereClause } from '$server/worker/database_worker/messages/where_clause';
import type { authorToBook } from '$shared/database/tables/junction_tables';
import { requestBodyMalformed, type ValidationError } from '$shared/error/api_error';
import { databaseTableNameFromAPITableName } from '$shared/types/database/api';
import {
	isDatabaseMatchedByIdTableName,
	type DatabaseMatchedByIdTableName,
	type DatabaseTableName
} from '$shared/types/database/schema';
import { Result } from '$shared/types/result';
import { createValidationResultErrorFromArkErrors } from '$shared/types/validators/validator_util';
import { type } from 'arktype';
import type { RequestHandler } from './$types';
import { createAPIErrorResponse, createAPIOkResponse } from './shared';
import {
	deleteAuthorToBookBody,
	deleteByIdBody
} from '$shared/types/validators/delete_request_validators';

type DeleteError = DatabaseWorkerError | ValidationError;

const handleDeleteById = async (
	databaseMatchedByIdTableName: DatabaseMatchedByIdTableName,
	body: any
): Promise<Result<RemoveResponse<DatabaseMatchedByIdTableName>, DeleteError>> => {
	const deleteBody = deleteByIdBody(body);
	if (deleteBody instanceof type.errors)
		return createValidationResultErrorFromArkErrors(deleteBody);

	return SendRemoveRequest(databaseMatchedByIdTableName, {
		filterType: 'inArray',
		columnName: 'id',
		values: deleteBody.ids
	});
};

type AuthorToBookWhereClause = WhereClause<typeof authorToBook>;

const createAuthorToBookFilter = ({
	deleteBy,
	ids
}: typeof deleteAuthorToBookBody.infer): AuthorToBookWhereClause => {
	if (deleteBy === 'both') {
		const filters = ids.map(
			({ bookId, authorId }): AuthorToBookWhereClause => ({
				filterType: 'and',
				filters: [
					{ filterType: 'eq', columnName: 'bookId', value: bookId },
					{ filterType: 'eq', columnName: 'authorId', value: authorId }
				]
			})
		);

		if (filters.length === 1) return filters[0];
		else
			return {
				filterType: 'or',
				filters: filters as [AuthorToBookWhereClause, AuthorToBookWhereClause]
			};
	}

	return {
		filterType: 'inArray',
		columnName: deleteBy,
		values: ids
	};
};

const handleDeleteAuthorToBook = async (
	body: any
): Promise<Result<RemoveResponse<'authorToBook'>, DeleteError>> => {
	const deleteBody = deleteAuthorToBookBody(body);
	if (deleteBody instanceof type.errors)
		return createValidationResultErrorFromArkErrors(deleteBody);

	const deleteFilter = createAuthorToBookFilter(deleteBody);
	return SendRemoveRequest('authorToBook', deleteFilter);
};

const runDeleteHandler = (
	databaseTableName: DatabaseTableName,
	body: any
): Promise<Result<RemoveResponse, DeleteError>> => {
	if (isDatabaseMatchedByIdTableName(databaseTableName))
		return handleDeleteById(databaseTableName, body);
	return handleDeleteAuthorToBook(body);
};

export const handleDelete: RequestHandler = async ({ params, request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return createAPIErrorResponse(Result.error(requestBodyMalformed()));
	}

	const databaseTableName = databaseTableNameFromAPITableName(params.apiTableName);
	const deleteResponse = await runDeleteHandler(databaseTableName, body);

	if (Result.isError(deleteResponse)) return createAPIErrorResponse(deleteResponse);
	return createAPIOkResponse(deleteResponse);
};
