import type { Nullable } from '$shared/types/util';

export type OldShorthand = {
	short_name: string;
	long_name: string;
};

export type OldBook = {
	string_id: string;
	is_large: boolean;

	name: Nullable<number>;
	author: number[];

	publisher: Nullable<number>;
	place_of_publishing: Nullable<number>;
	year_of_publishing: Nullable<string>;
	edition: Nullable<string>;

	page_count: Nullable<string>;
	literature_type: Nullable<number>;
	udc: Nullable<number>;

	add_date: Nullable<string>;
	price: Nullable<string>;
	document_number: Nullable<string>;
	giver: Nullable<number>;

	annotation: Nullable<string>;
	discard_date: Nullable<string>;
	discard_reason: Nullable<number>;
	discard_document: Nullable<string>;
	note: Nullable<string>;
};

export type OldReader = {
	id: number;
	name: string;
	class_name: number;
	added_date: Nullable<string>;
	last_modified_date: Nullable<string>;
};

export type OldBorrow = {
	id: number;
	book: number;
	reader: number;

	borrow_date: string;
	return_date: Nullable<string>;
	times_extended: number;
	permanent: boolean;
};

export type OldBorrowHistory = {
	book_id: number;
	reader_name: string;
	reader_class: number;
	borrow_date: string;
	return_date: Nullable<string>;
	permanent: boolean;
	times_extended: number;
};

export type OldDatabase = {
	book_names: string[];
	authors: string[];
	publishers: string[];
	places_of_publishing: string[];
	givers: string[];
	discard_reasons: string[];

	literature_types: OldShorthand[];
	udc: OldShorthand[];

	reader_classes: string[];
	readers: OldReader[];

	books: OldBook[];
	borrows: OldBorrow[];
	borrow_history: OldBorrowHistory[];
};
