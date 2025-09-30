import type { Shorthand } from '$shared/book_types';
import type { Nullable } from '$shared/common_types';

export type BookInfoListMappedItem = {
	string_id: string;
	name: Nullable<string>;
	publisher: Nullable<string>;
	place_of_publishing: Nullable<string>;
	year_of_publishing: Nullable<string>;
	edition: Nullable<string>;
	page_count: Nullable<string>;
	literature_type: Nullable<Shorthand>;
	price: Nullable<string>;
	giver: Nullable<string>;
};
