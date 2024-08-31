import { TDatabaseBook, TShorthand, type DatabaseBook, type Shorthand } from './book_types';
import {
	type DatabaseBorrow,
	type DatabaseReader,
	type BorrowHistory,
	TDatabaseReader,
	TDatabaseBorrow,
	TBorrowHistory
} from './borrow_types';
import * as t from 'io-ts';

export const TDatabase = t.type({
	book_names: t.array(t.string),
	publishers: t.array(t.string),
	places_of_publishing: t.array(t.string),
	givers: t.array(t.string),
	discard_reasons: t.array(t.string),
	authors: t.array(t.string),

	literature_types: t.array(TShorthand),
	udc: t.array(TShorthand),

	reader_classes: t.array(t.string),
	readers: t.array(TDatabaseReader),

	books: t.array(TDatabaseBook),
	borrows: t.array(TDatabaseBorrow),
	borrow_history: t.array(TBorrowHistory)
});

export type Database = t.TypeOf<typeof TDatabase>;
