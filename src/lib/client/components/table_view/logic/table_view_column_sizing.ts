export const MINIMUM_COLUMN_WIDTH = 64;

export type TableViewDefaultColumnSize =
	| { type: 'px'; pixels: number }
	| { type: 'fr'; fractions: number };

export const calculateColumnSizes = (
	defaultColumnSizes: TableViewDefaultColumnSize[],
	usableWidth: number
) => {
	const calculatedDefaultSizes = Array.from({ length: defaultColumnSizes.length }, () => 0);

	let remainingColumns = defaultColumnSizes.length;
	let remainingWidth = usableWidth;
	defaultColumnSizes.forEach((v, i) => {
		if (v.type !== 'px') return;

		remainingWidth -= v.pixels;
		remainingColumns -= 1;
		calculatedDefaultSizes[i] = v.pixels;
	});

	const oneFraction = remainingWidth / remainingColumns;
	defaultColumnSizes.forEach((v, i) => {
		if (v.type !== 'fr') return;

		calculatedDefaultSizes[i] = v.fractions * oneFraction;
	});

	return calculatedDefaultSizes;
};
