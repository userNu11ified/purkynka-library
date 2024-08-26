import type { Nullable } from '$shared/common_types';

export type BorrowHistoryListMappedItem = {
	book_id: number;
	is_large: boolean;
	book_name: string;
	reader_name: string;
	reader_class: string;
	borrow_date: Date;
	return_date: Nullable<Date>;
	permanent: boolean;
	times_extended: number;
};
