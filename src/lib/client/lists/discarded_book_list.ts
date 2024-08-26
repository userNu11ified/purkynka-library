import type { Shorthand } from '$shared/book_types';
import type { Nullable } from '$shared/common_types';

export type DiscardedBookListMappedItem = {
	string_id: string;
	is_large: boolean;
	book_name: string;
	book_author: string;
	discard_date: Date;
	price: Nullable<string>;
	literature_type: Nullable<Shorthand>;
	discard_reason: Nullable<string>;
	discard_document: Nullable<string>;
};
