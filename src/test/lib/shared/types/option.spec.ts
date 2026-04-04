import { Option } from '$shared/types/option';
import { describe, expect, it } from 'vitest';

describe('Option', () => {
	const some = Option.some('Test');
	const none = Option.none();

	it('Creates OptionSome<T>', () => {
		expect(some).toMatchObject({ $type: 'some', value: 'Test' });
	});

	it('Classifies OptionSome<T>', () => {
		expect(Option.isSome(some)).toBe(true);
		expect(Option.isNone(some)).toBe(false);
	});

	it('Creates OptionNone', () => {
		expect(none).toMatchObject({ $type: 'none' });
	});

	it('Classifies OptionNone', () => {
		expect(Option.isSome(none)).toBe(false);
		expect(Option.isNone(none)).toBe(true);
	});
});
