import * as t from 'io-ts';
import { TMappedBook } from './book_types';
import { TDate, TID, TNullable, TPositiveInteger } from './common_types';

export const TReader = <ClassNameType extends t.Mixed, DateType extends t.Mixed>(
	class_name_type: ClassNameType,
	date_type: DateType
) =>
	t.type({
		id: TID,
		name: t.string,
		class_name: class_name_type,
		added_date: date_type,
		last_modified_date: date_type
	});

export const TDatabaseReader = TReader(TID, t.string);
export type DatabaseReader = t.TypeOf<typeof TDatabaseReader>;

export const TMappedReader = TReader(t.string, TDate);
export type MappedReader = t.TypeOf<typeof TMappedReader>;

export const TBorrow = <BookType extends t.Mixed, BorrowerType extends t.Mixed, DateType extends t.Mixed>(
	book_type: BookType,
	borrower_type: BorrowerType,
	date_type: DateType
) =>
	t.type({
		id: t.number,
		book: book_type,
		reader: borrower_type,

		borrow_date: date_type,
		return_date: TNullable(date_type),
		times_extended: t.number,
		permanent: t.boolean
	});

export const TDatabaseBorrow = TBorrow(TID, TID, t.string);
export type DatabaseBorrow = t.TypeOf<typeof TDatabaseBorrow>;

export const TMappedBorrow = TBorrow(TMappedBook, TMappedReader, TDate);
export type MappedBorrow = t.TypeOf<typeof TMappedBorrow>;

export const TBorrowHistory = t.type({
	book_id: t.number,
	reader_name: t.string,
	reader_class: t.number,
	borrow_date: t.string,
	return_date: TNullable(t.string),
	permanent: t.boolean,
	times_extended: t.number
});

export type BorrowHistory = t.TypeOf<typeof TBorrowHistory>;
