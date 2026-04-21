import { ArkErrors, type } from 'arktype';
import { Result } from '../result';
import { validationError } from '$shared/error/api_error';

export const createValidationResultErrorFromArkErrors = (errors: ArkErrors) =>
	Result.error(validationError({ errorSummary: errors.summary.split('\n') }));

export const objectWithAtLeastOneProperty = type({ '[string]': 'unknown' }).narrow((data, ctx) => {
	if (Object.keys(data).length > 0) return true;
	return ctx.mustBe('an object with at least one property');
});
