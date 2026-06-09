import type { Nullable } from '$shared/types/util';

export const numberSorter = (left: number, right: number) => left - right;
export const booleanSorter = (left: boolean, right: boolean) => numberSorter(+left, +right);
export const stringSorter = (left: string, right: string) => left.localeCompare(right, 'cs');
export const dateSorter = (left: Nullable<Date>, right: Nullable<Date>) =>
	numberSorter(left?.getTime() ?? 0, right?.getTime() ?? 0);
