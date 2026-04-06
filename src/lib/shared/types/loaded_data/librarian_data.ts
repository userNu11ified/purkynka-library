import type { DatabaseWorkerResult } from '$server/worker/database_worker/database_worker_types';
import type { SelectResponse } from '$server/worker/database_worker/messages/select';
import type { DatabaseTableName } from '../database/schema';
import type {
	AuthorNameSelect,
	BookNameSelect,
	DiscardReasonSelect,
	ObtainedFromSelect,
	PlaceOfPublishingSelect,
	PublisherSelect
} from '$shared/database/tables/lookup_tables';
import type { LiteratureTypeSelect, UDCSelect } from '$shared/database/tables/shorthand_tables';
import type { BookSelect } from '$shared/database/tables/books_table';
import type { AuthorToBookSelect } from '$shared/database/tables/junction_tables';
import { createContext } from 'svelte';
import { Result, type ResultError, type ResultOk } from '../result';
import type { DatabaseWorkerError } from '$server/worker/database_worker/messages/error';
import { TableData } from './table_data.svelte';

const [getLibrarianDataContext, setLibrarianDataContext] = createContext<LibrarianData>();

export class LibrarianData {
	public bookNames: TableData<BookNameSelect>;
	public authorNames: TableData<AuthorNameSelect>;
	public publishers: TableData<PublisherSelect>;
	public placesOfPublishing: TableData<PlaceOfPublishingSelect>;
	public obtainedFrom: TableData<ObtainedFromSelect>;
	public discardReasons: TableData<DiscardReasonSelect>;

	public literatureTypes: TableData<LiteratureTypeSelect>;
	public udc: TableData<UDCSelect>;

	public books: TableData<BookSelect>;
	public authorToBook: TableData<AuthorToBookSelect>;

	public loaded: Promise<void>;
	private loadedResolver!: () => void;

	constructor() {
		this.bookNames = new TableData();
		this.authorNames = new TableData();
		this.publishers = new TableData();
		this.placesOfPublishing = new TableData();
		this.obtainedFrom = new TableData();
		this.discardReasons = new TableData();

		this.literatureTypes = new TableData();
		this.udc = new TableData();

		this.books = new TableData();
		this.authorToBook = new TableData();

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
			authorToBook
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
			SelectResponse<'authorToBook'>
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

		this.loadedResolver();
	}

	public static getContext() {
		return getLibrarianDataContext();
	}

	public static createContext() {
		return setLibrarianDataContext(new LibrarianData());
	}
}

export type LoadedLibrarianData = {
	[Key in DatabaseTableName]: Promise<DatabaseWorkerResult<SelectResponse<Key>>>;
};
