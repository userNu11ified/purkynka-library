import * as BooksTable from './tables/books_table.ts';
import * as JunctionTables from './tables/junction_tables.ts';
import * as LookupTables from './tables/lookup_tables.ts';
import * as ShorthandTables from './tables/shorthand_tables.ts';
import * as ReadersTable from './tables/readers_table.ts';
import * as BorrowTables from './tables/borrow_tables.ts';

export default {
	...LookupTables,
	...ShorthandTables,
	...BooksTable,
	...JunctionTables,
	...ReadersTable,
	...BorrowTables
};
