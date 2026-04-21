import type { DescriptiveError } from '$shared/types/descriptive_error';
import { Result } from '$shared/types/result';
import { json } from '@sveltejs/kit';

export const createAPIOkResponse = (resultOk: Result<unknown, never>) =>
	json(Result.flatten(resultOk));

export const createAPIErrorResponse = (
	resultError: Result<never, DescriptiveError<string, string, unknown>>
) => json(Result.flatten(resultError));
