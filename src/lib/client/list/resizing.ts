import { sum } from '$client/math/math';
import { calculate_text_width } from '$client/style/css';
import { BORDER_WIDTH, FONT_SIZE_LARGE, SCROLLBAR_WIDTH, SIDEBAR_CLOSED_WIDTH } from '$client/style/theme';
import { ITEM_SIZE } from './list';

export const get_usable_width = (
	window_width: number,
	headers: string[],
	has_options: boolean,
	has_sidebar: boolean
) => {
	let width = window_width - (headers.length - 1) * BORDER_WIDTH - BORDER_WIDTH - SCROLLBAR_WIDTH;

	if (has_sidebar) width -= SIDEBAR_CLOSED_WIDTH;
	if (has_options) width -= ITEM_SIZE + BORDER_WIDTH;

	return width;
};

export const get_minimum_column_sizes = (headers: string[]) => {
	const calculated_sizes = headers.map((header) =>
		header === '' ? ITEM_SIZE : calculate_text_width(header, FONT_SIZE_LARGE, 'bold') + 80
	);

	return calculated_sizes;
};

export const get_default_column_sizes = (usable_width: number, headers: string[]) => {
	const set_sizing = headers.filter((header) => header === '');

	const distribute_among = headers.filter((header) => header !== '');
	const fraction = (usable_width - set_sizing.length * ITEM_SIZE) / distribute_among.length;

	const calculated_sizes = headers.map((header) => (header === '' ? ITEM_SIZE : fraction));

	return calculated_sizes;
};

export const resize_columns = (
	resizing: number,
	column_sizes: number[],
	minimum_column_sizes: number[],
	usable_width: number,
	resize_by: number
) => {
	column_sizes[resizing] = Math.max(column_sizes[resizing] + resize_by, minimum_column_sizes[resizing]);
	column_sizes[resizing + 1] = Math.max(column_sizes[resizing + 1] - resize_by, minimum_column_sizes[resizing + 1]);

	const overshot = sum(column_sizes) - usable_width;
	column_sizes[resize_by > 0 ? resizing : resizing + 1] -= overshot;

	return column_sizes;
};
