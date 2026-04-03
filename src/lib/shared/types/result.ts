export type ResultOk<T> = {
	$type: 'ok';
	value: T;
};

export type ResultError<E> = {
	$type: 'error';
	value: E;
};

export type Result<T, E> = ResultOk<T> | ResultError<E>;

const ok = <T>(value: T): Result<T, never> => ({ $type: 'ok', value });
const isOk = <T, E>(value: Result<T, E>): value is ResultOk<T> => value.$type === 'ok';

const error = <E>(value: E): Result<never, E> => ({ $type: 'error', value });
const isError = <T, E>(value: Result<T, E>): value is ResultError<E> => value.$type === 'error';

export const Result = {
	ok,
	isOk,
	error,
	isError
};
