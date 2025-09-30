import type { Shorthand } from '$shared/book_types';
import type { Nullable } from '$shared/common_types';

export type BookListMappedItem = {
	string_id: string;
	is_large: boolean;
	name: Nullable<string>;
	author: string;
	udc: Nullable<Shorthand>;
	borrowed_to_class: Nullable<string>;
	borrowed_to_name: Nullable<string>;
	discard_date: Nullable<Date>;
	annotation: Nullable<string>;
	note: Nullable<string>;
};
