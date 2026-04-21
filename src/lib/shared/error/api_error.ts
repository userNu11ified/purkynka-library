import type { DatabaseWorkerError } from '$server/worker/database_worker/messages/error';
import { descriptiveErrorConstructor } from '$shared/types/descriptive_error';
import type { FlatResultError } from '$shared/types/result';

export const requestBodyMalformed = descriptiveErrorConstructor(
	'requestBodyMalformed',
	'Failed to read the Request body as JSON!'
);
export type RequestBodyMalformed = ReturnType<typeof requestBodyMalformed>;

export const validationError = descriptiveErrorConstructor<
	'validationError',
	'Failed to validate the provided data!',
	{ errorSummary: string }
>('validationError', 'Failed to validate the provided data!');
export type ValidationError = ReturnType<typeof validationError>;

export const failedToPost = descriptiveErrorConstructor<
	'failedToPost',
	'Failed to POST the provided data!',
	{ postError: FlatResultError<DatabaseWorkerError> }
>('failedToPost', 'Failed to POST the provided data!');
export type FailedToPost = ReturnType<typeof failedToPost>;

export const postResultValidationError = descriptiveErrorConstructor<
	'postResultValidationError',
	'Failed to validate the returned data from a POST request!',
	{ errorSummary: string }
>('postResultValidationError', 'Failed to validate the returned data from a POST request!');
export type PostResultValidationError = ReturnType<typeof postResultValidationError>;
