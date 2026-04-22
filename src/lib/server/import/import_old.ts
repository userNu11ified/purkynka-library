import { oldDataImporterLogger } from '$server/server_loggers';
import { SendInsertRequest } from '$server/worker/database_worker/messages/insert';
import type { BookInsert } from '$shared/database/tables/books_table';
import type { AuthorToBookInsert } from '$shared/database/tables/junction_tables';
import { type DatabaseSchema, type DatabaseTableName } from '$shared/types/database/schema';
import type { Nullable } from '$shared/types/util';
import type { InferInsertModel } from 'drizzle-orm';
import type { OldDatabase, OldShorthand } from './import_old_types';
import type { ReaderInsert } from '$shared/database/tables/readers_table';
import { type BorrowHistoryInsert, type BorrowInsert } from '$shared/database/tables/borrow_tables';

const incrementIdOrNull = (id: Nullable<number>) => (id === null ? null : id + 1);
const parseDateOrNull = (date: Nullable<string>) => (date === null ? null : new Date(date));

const transformLookupTable = (lookupRows: string[]) =>
	lookupRows.map((v, i) => ({ id: i + 1, value: v }));
const transformShorthandTable = (shorthandRows: OldShorthand[]) =>
	shorthandRows.map((v, i) => ({ id: i + 1, shortName: v.short_name, longName: v.long_name }));

const CHUNK_SIZE = 1000;
const sendChunked = <const TableName extends DatabaseTableName>(
	sendTo: TableName,
	data: InferInsertModel<DatabaseSchema[TableName]>[]
) => {
	const promises = [];

	for (let i = 0; i < data.length; i += 1000) {
		const chunk = data.slice(i, i + CHUNK_SIZE);
		promises.push(SendInsertRequest(sendTo, chunk));
	}

	return Promise.all(promises);
};

const importLookupTables = async ({
	book_names,
	authors,
	publishers,
	places_of_publishing,
	givers,
	discard_reasons,
	reader_classes
}: OldDatabase) => {
	const transformedBookNames = transformLookupTable(book_names);
	const transformedAuthorNames = transformLookupTable(authors);
	const transformedPublishers = transformLookupTable(publishers);
	const transformedPlacesOfPublishing = transformLookupTable(places_of_publishing);
	const transformedObtainedFrom = transformLookupTable(givers);
	const transformedDiscardReasons = transformLookupTable(discard_reasons);

	const transformedReaderClasses = transformLookupTable(reader_classes);

	await Promise.all([
		SendInsertRequest('bookNames', transformedBookNames),
		SendInsertRequest('authorNames', transformedAuthorNames),
		SendInsertRequest('publishers', transformedPublishers),
		SendInsertRequest('placesOfPublishing', transformedPlacesOfPublishing),
		SendInsertRequest('obtainedFrom', transformedObtainedFrom),
		SendInsertRequest('discardReasons', transformedDiscardReasons),
		SendInsertRequest('readerClasses', transformedReaderClasses)
	]);

	oldDataImporterLogger.debug('Imported lookup tables!');
};

const importShorthandTables = async ({ literature_types, udc }: OldDatabase) => {
	const transformedLiteratureTypes = transformShorthandTable(literature_types);
	const transformedUDC = transformShorthandTable(udc);

	await Promise.all([
		SendInsertRequest('literatureTypes', transformedLiteratureTypes),
		SendInsertRequest('udc', transformedUDC)
	]);

	oldDataImporterLogger.debug('Imported shorthand tables!');
};

const importBooks = async ({ books }: OldDatabase) => {
	const transformedBooks: BookInsert[] = [];
	const transformedAuthorToBook: AuthorToBookInsert[] = [];

	books.forEach(
		({
			string_id,
			is_large,
			name,
			author,
			publisher,
			place_of_publishing,
			year_of_publishing,
			edition,
			page_count,
			literature_type,
			udc,
			add_date,
			price,
			document_number,
			giver,
			annotation,
			discard_date,
			discard_reason,
			discard_document,
			note
		}) => {
			const id = +string_id;

			const transformedBook: BookInsert = {
				id,

				isLarge: is_large,
				bookNameId: incrementIdOrNull(name),

				publisherId: incrementIdOrNull(publisher),
				placeOfPublishingId: incrementIdOrNull(place_of_publishing),
				yearOfPublishing: year_of_publishing,

				edition,
				pageCount: page_count,

				literatureTypeId: incrementIdOrNull(literature_type),
				udcId: incrementIdOrNull(udc),

				addDate: parseDateOrNull(add_date),
				price,
				documentNumber: document_number,
				obtainedFromId: incrementIdOrNull(giver),

				discardDate: parseDateOrNull(discard_date),
				discardReasonId: incrementIdOrNull(discard_reason),
				discardDocument: discard_document,

				annotation,
				note
			};

			const transformedAuthorsToBook = author.map(
				(authorNameId): AuthorToBookInsert => ({
					bookId: id,
					authorId: authorNameId + 1
				})
			);

			transformedBooks.push(transformedBook);
			transformedAuthorToBook.push(...transformedAuthorsToBook);
		}
	);

	await sendChunked('books', transformedBooks);
	await sendChunked('authorToBook', transformedAuthorToBook);

	oldDataImporterLogger.debug('Imported book tables!');
};

const digitRegex = /\d/;
const importReaders = async ({ reader_classes, readers }: OldDatabase) => {
	const transformedReaders = readers.map(
		({ id, name, class_name, added_date, last_modified_date }): ReaderInsert => ({
			id: incrementIdOrNull(id)!,
			readerName: name,
			readerClassId: incrementIdOrNull(class_name)!,
			readerType: digitRegex.test(reader_classes[class_name]) ? 'S' : 'T',
			createdOn: parseDateOrNull(added_date) ?? undefined,
			updatedOn: parseDateOrNull(last_modified_date) ?? undefined
		})
	);

	await sendChunked('readers', transformedReaders);

	oldDataImporterLogger.debug('Imported readers!');
};

const importBorrows = async ({ borrows, borrow_history, reader_classes }: OldDatabase) => {
	const transformedBorrows = borrows.map(
		({ id, book, reader, borrow_date, return_date, times_extended, permanent }): BorrowInsert => ({
			id: incrementIdOrNull(id)!,
			bookId: incrementIdOrNull(book)!,
			readerId: incrementIdOrNull(reader)!,
			borrowDate: parseDateOrNull(borrow_date)!,
			returnDate: parseDateOrNull(return_date),
			timesExtended: times_extended,
			permanent
		})
	);

	const uniqueIds = new Set(transformedBorrows.map((v) => v.id));
	const filteredBorrows = uniqueIds
		.values()
		.toArray()
		.map((id) => transformedBorrows.find((v) => v.id === id)!);

	const transformedBorrowHistory = borrow_history.map(
		(
			{ book_id, reader_name, reader_class, borrow_date, return_date, times_extended, permanent },
			borrowId
		): BorrowHistoryInsert => ({
			id: incrementIdOrNull(borrowId)!,
			bookId: incrementIdOrNull(book_id)!,
			readerName: reader_name,
			readerClass: reader_classes[reader_class],
			borrowDate: parseDateOrNull(borrow_date)!,
			returnDate: parseDateOrNull(return_date),
			timesExtended: times_extended,
			permanent
		})
	);

	await SendInsertRequest('borrows', filteredBorrows);
	await SendInsertRequest('borrowHistory', transformedBorrowHistory);

	oldDataImporterLogger.debug('Imported borrows!');
};

export const importOldData = async (filePath: string) => {
	const oldDatabase = (await Bun.file(filePath).json()) as OldDatabase;
	oldDataImporterLogger.debug(`Loaded old database from: ${filePath}!`);

	await importLookupTables(oldDatabase);
	await importShorthandTables(oldDatabase);
	await importBooks(oldDatabase);
	await importReaders(oldDatabase);
	await importBorrows(oldDatabase);

	oldDataImporterLogger.info('Finished importing old database!');
};
