import type { DatabaseWorkerResult } from '$server/worker/database_worker/database_worker_types';
import type { SelectResponse } from '$server/worker/database_worker/messages/select';
import type { DatabaseTableName } from '../database/schema';
import { Result, type ResultError, type ResultOk } from '../result';
import type { DatabaseWorkerError } from '$server/worker/database_worker/messages/error';
import { Context } from 'runed';
import { TableWithIdData } from './table_with_id_data.svelte';
import type {
	AuthorNameSelect,
	BookNameSelect,
	DiscardReasonSelect,
	ObtainedFromSelect,
	PlaceOfPublishingSelect,
	PublisherSelect,
	ReaderClassSelect
} from '$shared/database/tables/lookup_tables';
import type { LiteratureTypeSelect, UDCSelect } from '$shared/database/tables/shorthand_tables';
import type { BookSelect } from '$shared/database/tables/books_table';
import { AuthorToBookTableData } from './author_to_book_table_data.svelte';
import type { ReaderSelect } from '$shared/database/tables/readers_table';

export class LibrarianData {
	public static context = new Context<LibrarianData>('librarian-data');

	public bookNames: TableWithIdData<BookNameSelect, 'bookNames'>;
	public authorNames: TableWithIdData<AuthorNameSelect, 'authorNames'>;
	public publishers: TableWithIdData<PublisherSelect, 'publishers'>;
	public placesOfPublishing: TableWithIdData<PlaceOfPublishingSelect, 'placesOfPublishing'>;
	public obtainedFrom: TableWithIdData<ObtainedFromSelect, 'obtainedFrom'>;
	public discardReasons: TableWithIdData<DiscardReasonSelect, 'discardReasons'>;

	public literatureTypes: TableWithIdData<LiteratureTypeSelect, 'literatureTypes'>;
	public udc: TableWithIdData<UDCSelect, 'udc'>;

	public books: TableWithIdData<BookSelect, 'books'>;
	public authorToBook: AuthorToBookTableData;

	public readerClasses: TableWithIdData<ReaderClassSelect, 'readerClasses'>;
	public readers: TableWithIdData<ReaderSelect, 'readers'>;

	public loaded: Promise<void>;
	private loadedResolver!: () => void;

	constructor() {
		this.bookNames = new TableWithIdData('bookNames');
		this.authorNames = new TableWithIdData('authorNames');
		this.publishers = new TableWithIdData('publishers');
		this.placesOfPublishing = new TableWithIdData('placesOfPublishing');
		this.obtainedFrom = new TableWithIdData('obtainedFrom');
		this.discardReasons = new TableWithIdData('discardReasons');

		this.literatureTypes = new TableWithIdData('literatureTypes');
		this.udc = new TableWithIdData('udc');

		this.books = new TableWithIdData('books');
		this.authorToBook = new AuthorToBookTableData();

		this.readerClasses = new TableWithIdData('readerClasses');
		this.readers = new TableWithIdData('readers');

		this.loaded = new Promise((res) => (this.loadedResolver = res));
	}

	public async initialize(loadedLibrarianData: LoadedLibrarianData) {
		const loadedData = await Promise.all(Object.values(loadedLibrarianData));

		const errors = loadedData.filter((result): result is ResultError<DatabaseWorkerError> =>
			Result.isError(result as ResultError<DatabaseWorkerError>)
		);
		if (errors.length !== 0) throw errors;

		const [
			bookNames,
			authorNames,
			publishers,
			placesOfPublishing,
			obtainedFrom,
			discardReasons,
			literatureTypes,
			udc,
			books,
			authorToBook,
			readerClasses,
			readers
		] = loadedData.map((result) =>
			Result.unwrap(result as ResultOk<SelectResponse>)
		) as unknown as [
			SelectResponse<'bookNames'>,
			SelectResponse<'authorNames'>,
			SelectResponse<'publishers'>,
			SelectResponse<'placesOfPublishing'>,
			SelectResponse<'obtainedFrom'>,
			SelectResponse<'discardReasons'>,
			SelectResponse<'literatureTypes'>,
			SelectResponse<'udc'>,
			SelectResponse<'books'>,
			SelectResponse<'authorToBook'>,
			SelectResponse<'readerClasses'>,
			SelectResponse<'readers'>
		];

		this.bookNames.initialize(bookNames.values);
		this.authorNames.initialize(authorNames.values);
		this.publishers.initialize(publishers.values);
		this.placesOfPublishing.initialize(placesOfPublishing.values);
		this.obtainedFrom.initialize(obtainedFrom.values);
		this.discardReasons.initialize(discardReasons.values);
		this.literatureTypes.initialize(literatureTypes.values);
		this.udc.initialize(udc.values);
		this.books.initialize(books.values);
		this.authorToBook.initialize(authorToBook.values);
		this.readerClasses.initialize(readerClasses.values);
		this.readers.initialize(readers.values);

		this.loadedResolver();
	}
}

export type LoadedLibrarianData = {
	[Key in DatabaseTableName]: Promise<DatabaseWorkerResult<SelectResponse<Key>>>;
};
