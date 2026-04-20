import { descriptiveErrorConstructor } from '$shared/types/descriptive_error';

export const requestBodyMalformed = descriptiveErrorConstructor(
	'requestBodyMalformed',
	'Failed to read the Request body as JSON!'
);

export const validationError = descriptiveErrorConstructor<
	'validationError',
	'Failed to validate the provided data!',
	{ errorSummary: string }
>('validationError', 'Failed to validate the provided data!');
