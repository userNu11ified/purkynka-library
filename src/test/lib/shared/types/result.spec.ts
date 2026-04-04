import { Result } from '$shared/types/result';
import { describe, expect, it } from 'vitest';

describe('Result', () => {
	const ok = Result.ok('Ok');
	const error = Result.error('Error');

	it('Creates ResultOk<T>', () => {
		expect(ok).toMatchObject({ $type: 'ok', value: 'Ok' });
	});

	it('Classifies ResultOk<T>', () => {
		expect(Result.isOk(ok)).toBe(true);
		expect(Result.isError(ok)).toBe(false);
	});

	it('Creates ResultError<E>', () => {
		expect(error).toMatchObject({ $type: 'error', value: 'Error' });
	});

	it('Classifies ResultError<E>', () => {
		expect(Result.isOk(error)).toBe(false);
		expect(Result.isError(error)).toBe(true);
	});
});
