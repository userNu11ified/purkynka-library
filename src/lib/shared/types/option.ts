export type OptionSome<T> = {
	$type: 'some';
	value: T;
};

export type FlatOptionSome<T> = {
	$type: 'some';
} & (T extends object ? T : never);

export type OptionNone = {
	$type: 'none';
};

export type FlatOptionNone = OptionNone;

export type Option<T> = OptionSome<T> | OptionNone;

export type FlatOption<T> = FlatOptionSome<T> | FlatOptionNone;
export type FlattenedOption<O extends Option<unknown>> =
	O extends Option<infer T> ? FlatOption<T> : never;

const some = <T>(value: T): Option<T> => ({ $type: 'some', value });
const isSome = <T>(option: Option<T>): option is OptionSome<T> => option.$type === 'some';
const isFlatSome = <T>(flatOption: FlatOption<T>): flatOption is FlatOptionSome<T> =>
	flatOption.$type === 'some';

const none = <T>(): Option<T> => ({ $type: 'none' });
const isNone = <T>(option: Option<T>): option is OptionNone => option.$type === 'none';
const isFlatNone = <T>(flatOption: FlatOption<T>): flatOption is FlatOptionNone =>
	flatOption.$type === 'none';

const flatten = <T>(option: Option<T>): FlatOption<T> =>
	isNone(option) ? option : { $type: 'some', ...option.value };

const unwrap = <T>(option: Option<T>): T => {
	if (isNone(option)) throw new Error('Tried to unwrap an OptionNone!');
	return option.value;
};

export const Option = {
	some,
	none,
	isSome,
	isNone,

	flatten,
	isFlatSome,
	isFlatNone,

	unwrap
};
