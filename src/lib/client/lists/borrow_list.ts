export type BorrowListMappedItem = {
	book_id: number;
	is_large: boolean;
	book_name: string;
	reader_name: string;
	reader_class: string;
	borrow_date: Date;
	times_extended: number;
	return_date: Date;
};
