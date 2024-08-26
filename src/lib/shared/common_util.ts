import type { ID, Nullable } from './common_types';

export const string_compare = (left: Nullable<string> | undefined, right: Nullable<string> | undefined) =>
	(left ?? '').localeCompare(right ?? '', 'cs');

export const date_compare = (left: Nullable<Date> | undefined, right: Nullable<Date> | undefined) =>
	(left?.getTime() ?? 0) - (right?.getTime() ?? 0);

export const deformat_date = (formatted_date: Nullable<string>) => {
	if (formatted_date === null) return null;

	const [year, month, day] = formatted_date
		.split('. ')
		.reverse()
		.map((v) => +v);

	return new Date(year, month - 1, day);
};

export const get_lowest_missing_id = (look_in: { id: number }[]) => {
	const ids = look_in.map((v) => v.id).sort((a, b) => a - b);
	const largest_id = ids.at(-1);

	if (largest_id === undefined) return 0;

	let missing_key: Nullable<number> = null;
	for (let i = 0; i < largest_id; i++) {
		if (!ids.includes(i)) {
			missing_key = i;
			break;
		}
	}

	return missing_key === null ? largest_id + 1 : missing_key;
};

export const get_current_school_year = () => {
	const current_date = new Date();

	const current_year = current_date.getFullYear();
	const current_month = current_date.getMonth() + 1;

	return current_month >= 9 ? current_year : current_year - 1;
};
