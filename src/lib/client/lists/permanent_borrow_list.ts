import type { Nullable } from '$shared/common_types';

export type PermanentBorrowListMappedItem = {
	book_id: number;
	is_large: boolean;
	book_name: string;
	price: Nullable<string>;
	reader_name: string;
	borrow_date: Date;
};
