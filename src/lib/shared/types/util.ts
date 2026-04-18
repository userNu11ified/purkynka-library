export type Nullable<T> = T | null;
export type ValueOf<T> = T[keyof T];

export const sum = (values: number[]) => values.reduce((prev, curr) => prev + curr, 0);

export const formatDateOrNull = (date: Nullable<Date>) =>
	date === null ? null : date.toLocaleDateString('cs');
