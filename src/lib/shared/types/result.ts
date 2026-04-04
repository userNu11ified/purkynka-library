export type ResultOk<T> = {
	$type: 'ok';
	value: T;
};

export type FlatResultOk<T> = {
	$type: 'ok';
} & (T extends object ? T : never);

export type ResultError<E> = {
	$type: 'error';
	value: E;
};

export type FlatResultError<E> = {
	$type: 'error';
} & (E extends object ? E : never);

export type Result<T, E> = ResultOk<T> | ResultError<E>;

export type FlatResult<T, E> = FlatResultOk<T> | FlatResultError<E>;
export type FlattenedResult<R extends Result<unknown, unknown>> =
	R extends Result<infer T, infer E> ? FlatResult<T, E> : never;

const ok = <T>(value: T): Result<T, never> => ({ $type: 'ok', value });
const isOk = <T, E>(result: Result<T, E>): result is ResultOk<T> => result.$type === 'ok';
const isFlatOk = <T, E>(flatResult: FlatResult<T, E>): flatResult is FlatResultOk<T> =>
	flatResult.$type === 'ok';

const error = <E>(error: E): Result<never, E> => ({ $type: 'error', value: error });
const isError = <T, E>(result: Result<T, E>): result is ResultError<E> => result.$type === 'error';
const isFlatError = <T, E>(flatResult: FlatResult<T, E>): flatResult is FlatResultError<E> =>
	flatResult.$type === 'error';

const flatten = <T, E>(result: Result<T, E>): FlatResult<T, E> => ({
	$type: result.$type,
	...result.value
});

export const Result = {
	ok,
	error,
	isOk,
	isError,

	flatten,
	isFlatOk,
	isFlatError
};
