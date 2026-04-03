export type OptionSome<T> = {
	$type: 'some';
	value: T;
};

export type OptionNone = {
	$type: 'none';
};

export type Option<T> = OptionSome<T> | OptionNone;

const some = <T>(value: T): Option<T> => ({ $type: 'some', value });
const isSome = <T>(option: Option<T>): option is OptionSome<T> => option.$type === 'some';

const none = <T>(): Option<T> => ({ $type: 'none' });
const isNone = <T>(option: Option<T>): option is OptionNone => option.$type === 'none';

export const Option = {
	some,
	isSome,
	none,
	isNone
};
