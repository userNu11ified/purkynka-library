import type { Shorthand } from '$shared/book_types';
import type { Nullable } from '$shared/common_types';

export type StudentBookListMappedItem = {
	return_date: Nullable<Date>;
	permanent: boolean;
	book_id: string;
	is_large: boolean;
	book_name: string;
	book_author: string;
	book_udc: Nullable<Shorthand>;
	annotation: Nullable<string>;
};
