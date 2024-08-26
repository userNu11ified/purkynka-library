import type { Author, DatabaseBook, Shorthand } from './book_types';
import type { DatabaseBorrow, DatabaseReader, BorrowHistory } from './borrow_types';

export type Database = {
	book_names: string[];
	publishers: string[];
	places_of_publishing: string[];
	givers: string[];
	discard_reasons: string[];

	authors: Author[];

	literature_types: Shorthand[];
	udc: Shorthand[];

	reader_classes: string[];
	readers: DatabaseReader[];

	books: DatabaseBook[];
	borrows: DatabaseBorrow[];
	borrow_history: BorrowHistory[];
};
