export type DescriptiveError<
	ErrorType extends string,
	ErrorDescription extends string,
	AdditionalData = undefined
> = {
	errorType: ErrorType;
	errorDescription: ErrorDescription;
	additionalData?: AdditionalData;
};

export const descriptiveErrorConstructor =
	<
		const ErrorType extends string,
		const ErrorDescription extends string,
		AdditionalData = undefined
	>(
		errorType: ErrorType,
		errorDescription: ErrorDescription
	) =>
	(
		additionalData?: AdditionalData
	): DescriptiveError<ErrorType, ErrorDescription, AdditionalData> => ({
		errorType,
		errorDescription,
		additionalData
	});
