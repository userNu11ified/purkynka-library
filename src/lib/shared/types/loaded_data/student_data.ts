import { Context } from 'runed';
import { TableWithIdData } from './table_with_id_data.svelte';
import type { BookSelect } from '$shared/database/tables/books_table';
import type { AuthorNameSelect, BookNameSelect } from '$shared/database/tables/lookup_tables';
import { AuthorToBookTableData } from './author_to_book_table_data.svelte';
import type { UDCSelect } from '$shared/database/tables/shorthand_tables';
import { BorrowTableData } from './borrow_table_data.svelte';
import type { DatabaseTableName } from '../database/schema';
import type { DatabaseWorkerResult } from '$server/worker/database_worker/database_worker_types';
import type { SelectResponse } from '$server/worker/database_worker/messages/select';
import { Result, type ResultError, type ResultOk } from '../result';
import type { DatabaseWorkerError } from '$server/worker/database_worker/messages/error';

export class StudentData {
	public static context = new Context<StudentData>('student-data');

	public books: TableWithIdData<BookSelect, 'books'>;
	public bookNames: TableWithIdData<BookNameSelect, 'bookNames'>;
	public authorNames: TableWithIdData<AuthorNameSelect, 'authorNames'>;
	public authorToBook: AuthorToBookTableData;
	public udc: TableWithIdData<UDCSelect, 'udc'>;
	public borrows: BorrowTableData;

	public loaded: Promise<void>;
	private loadedResolver!: () => void;

	constructor() {
		this.bookNames = new TableWithIdData('bookNames');
		this.authorNames = new TableWithIdData('authorNames');
		this.udc = new TableWithIdData('udc');
		this.books = new TableWithIdData('books');
		this.authorToBook = new AuthorToBookTableData();
		this.borrows = new BorrowTableData();

		this.loaded = new Promise((res) => (this.loadedResolver = res));
	}

	public async initialize(loadedStudentData: LoadedStudentData) {
		const loadedData = await Promise.all(Object.values(loadedStudentData));

		const errors = loadedData.filter((result): result is ResultError<DatabaseWorkerError> =>
			Result.isError(result as ResultError<DatabaseWorkerError>)
		);
		if (errors.length !== 0) throw errors;

		const [bookNames, authorNames, udc, books, authorToBook, borrows] = loadedData.map((result) =>
			Result.unwrap(result as ResultOk<SelectResponse>)
		) as unknown as [
			SelectResponse<'bookNames'>,
			SelectResponse<'authorNames'>,
			SelectResponse<'udc'>,
			SelectResponse<'books'>,
			SelectResponse<'authorToBook'>,
			SelectResponse<'borrows'>
		];

		this.bookNames.initialize(bookNames.values);
		this.authorNames.initialize(authorNames.values);
		this.udc.initialize(udc.values);
		this.books.initialize(books.values);
		this.authorToBook.initialize(authorToBook.values);
		this.borrows.initialize(borrows.values);

		this.loadedResolver();
	}
}

export type LoadedStudentData = {
	[Key in DatabaseTableName & keyof StudentData]: Promise<
		DatabaseWorkerResult<SelectResponse<Key>>
	>;
};
