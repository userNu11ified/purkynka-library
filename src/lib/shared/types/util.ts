export type Nullable<T> = T | null;
export type ValueOf<T> = T[keyof T];

export const sum = (values: number[]) => values.reduce((prev, curr) => prev + curr);
