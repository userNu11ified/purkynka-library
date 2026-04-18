export const MINIMUM_COLUMN_WIDTH = 64;

export type TableViewColumnSize =
	| { type: 'px'; pixels: number }
	| { type: 'fr'; fractions: number };

export const calculateDefaultSizes = (
	columnSizes: TableViewColumnSize[],
	availableWidth: number
) => {
	const calculatedDefaultSizes = Array.from({ length: columnSizes.length }, () => 0);

	let remainingColumns = columnSizes.length;
	let remainingWidth = availableWidth;
	columnSizes.forEach((v, i) => {
		if (v.type !== 'px') return;

		remainingWidth -= v.pixels;
		remainingColumns -= 1;
		calculatedDefaultSizes[i] = v.pixels;
	});

	const oneFraction = remainingWidth / remainingColumns;
	columnSizes.forEach((v, i) => {
		if (v.type !== 'fr') return;

		calculatedDefaultSizes[i] = v.fractions * oneFraction;
	});

	return calculatedDefaultSizes;
};
