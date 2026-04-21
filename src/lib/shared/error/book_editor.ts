import {
	descriptiveErrorConstructor,
	type DescriptiveError
} from '$shared/types/descriptive_error';

export const failedToPostSearchableFields = descriptiveErrorConstructor<
	'failedToPostSearchableFields',
	'Failed to POST required searchable fields!',
	{ errors: DescriptiveError<string, string, unknown>[] }
>('failedToPostSearchableFields', 'Failed to POST required searchable fields!');
export type FailedToPostSearchableFields = ReturnType<typeof failedToPostSearchableFields>;

export const udcFieldInvalidNewState = descriptiveErrorConstructor(
	'udcFieldInvalidNewState',
	'The UDC Field was in the New state, this can never happen!'
);
export type UDCFieldInvalidNewState = ReturnType<typeof udcFieldInvalidNewState>;
