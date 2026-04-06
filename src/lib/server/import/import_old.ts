import { oldDataImporterLogger } from '$server/server_loggers';
import { SendInsertRequest } from '$server/worker/database_worker/messages/insert';
import type { BookInsert } from '$shared/database/tables/books_table';
import type { AuthorToBookInsert } from '$shared/database/tables/junction_tables';
import type { DatabaseSchema, DatabaseTableName } from '$shared/types/database/schema';
import type { Nullable } from '$shared/types/util';
import type { InferInsertModel } from 'drizzle-orm';
import type { OldDatabase, OldShorthand } from './import_old_types';

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
	discard_reasons
}: OldDatabase) => {
	const transformedBookNames = transformLookupTable(book_names);
	const transformedAuthorNames = transformLookupTable(authors);
	const transformedPublishers = transformLookupTable(publishers);
	const transformedPlacesOfPublishing = transformLookupTable(places_of_publishing);
	const transformedObtainedFrom = transformLookupTable(givers);
	const transformedDiscardReasons = transformLookupTable(discard_reasons);

	await Promise.all([
		SendInsertRequest('bookNames', transformedBookNames),
		SendInsertRequest('authorNames', transformedAuthorNames),
		SendInsertRequest('publishers', transformedPublishers),
		SendInsertRequest('placesOfPublishing', transformedPlacesOfPublishing),
		SendInsertRequest('obtainedFrom', transformedObtainedFrom),
		SendInsertRequest('discardReasons', transformedDiscardReasons)
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

export const importOldData = async (filePath: string) => {
	const oldDatabase = (await Bun.file(filePath).json()) as OldDatabase;
	oldDataImporterLogger.debug(`Loaded old database from: ${filePath}!`);

	await importLookupTables(oldDatabase);
	await importShorthandTables(oldDatabase);
	await importBooks(oldDatabase);
	oldDataImporterLogger.info('Finished importing old database!');
};
