import { camelCaseToKebabCase } from '$shared/types/string_util';
import { describe, expect, it } from 'vitest';

describe('String Util', () => {
	it('Converts camelCase to kebab-case', () => {
		const converted = camelCaseToKebabCase('coolStringThatIsCool');
		expect(converted).toBe('cool-string-that-is-cool');
	});
});
