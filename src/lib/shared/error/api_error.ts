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
	{ errorSummary: string[] }
>('validationError', 'Failed to validate the provided data!');
export type ValidationError = ReturnType<typeof validationError>;

export const failedToPost = descriptiveErrorConstructor<
	'failedToPost',
	'Failed to POST the provided data!',
	{ postError: FlatResultError<DatabaseWorkerError> }
>('failedToPost', 'Failed to POST the provided data!');
export type FailedToPost = ReturnType<typeof failedToPost>;

export const failedToPatch = descriptiveErrorConstructor<
	'failedToPatch',
	'Failed to PATCH the provided data!',
	{ patchError: FlatResultError<DatabaseWorkerError> }
>('failedToPatch', 'Failed to PATCH the provided data!');
export type FailedToPatch = ReturnType<typeof failedToPatch>;

export const failedToDelete = descriptiveErrorConstructor<
	'failedToDelete',
	'Failed to DELETE the provided data!',
	{ deleteError: FlatResultError<DatabaseWorkerError> }
>('failedToDelete', 'Failed to DELETE the provided data!');
export type FailedToDelete = ReturnType<typeof failedToDelete>;
