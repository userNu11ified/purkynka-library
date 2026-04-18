export const numberSorter = (left: number, right: number) => left - right;
export const booleanSorter = (left: boolean, right: boolean) => numberSorter(+left, +right);
export const stringSorter = (left: string, right: string) => left.localeCompare(right, 'cs');
export const dateSorter = (left: Date, right: Date) =>
	numberSorter(left.getTime(), right.getTime());
