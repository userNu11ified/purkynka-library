import type { DatabaseWorkerResult } from '$server/worker/database_worker/database_worker_types';
import type { SelectResponse } from '$server/worker/database_worker/messages/select';
import type { DatabaseTableName } from '../database/schema';
import { createContext } from 'svelte';
import { Result, type ResultError, type ResultOk } from '../result';
import type { DatabaseWorkerError } from '$server/worker/database_worker/messages/error';
import { TableData } from './table_data.svelte';
import { AuthorToBookData } from './author_to_book_data.svelte';

const [getLibrarianDataContext, setLibrarianDataContext] = createContext<LibrarianData>();

export class LibrarianData {
	public bookNames: TableData<'bookNames'>;
	public authorNames: TableData<'authorNames'>;
	public publishers: TableData<'publishers'>;
	public placesOfPublishing: TableData<'placesOfPublishing'>;
	public obtainedFrom: TableData<'obtainedFrom'>;
	public discardReasons: TableData<'discardReasons'>;

	public literatureTypes: TableData<'literatureTypes'>;
	public udc: TableData<'udc'>;

	public books: TableData<'books'>;
	public authorToBook: AuthorToBookData<'authorToBook', number, number>;

	public loaded: Promise<void>;
	private loadedResolver!: () => void;

	constructor() {
		this.bookNames = new TableData('bookNames', (v) => v.id);
		this.authorNames = new TableData('authorNames', (v) => v.id);
		this.publishers = new TableData('publishers', (v) => v.id);
		this.placesOfPublishing = new TableData('placesOfPublishing', (v) => v.id);
		this.obtainedFrom = new TableData('obtainedFrom', (v) => v.id);
		this.discardReasons = new TableData('discardReasons', (v) => v.id);

		this.literatureTypes = new TableData('literatureTypes', (v) => v.id);
		this.udc = new TableData('udc', (v) => v.id);

		this.books = new TableData('books', (v) => v.id);
		this.authorToBook = new AuthorToBookData(
			'authorToBook',
			(v) => v.bookId,
			(v) => v.authorId
		);

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
