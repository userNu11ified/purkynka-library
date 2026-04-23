import * as BooksTableAPIPostValidators from './books_table_api_post_validators.ts';
import * as JunctionTableAPIPostValidators from './junction_table_api_post_validators.ts';
import * as LookupTableAPIPostValidators from './lookup_table_api_post_validators.ts';
import * as ShorthandTableAPIPostValidators from './shorthand_table_api_post_validators.ts';
import * as ReadersTableAPIPostValidators from './readers_table_api_post_validators.ts';
import * as BorrowTableAPIPostValidators from './borrow_table_api_post_validators.ts';
import * as LibrarianTableAPIPostValidators from './librarian_table_api_post_validators.ts';

export const APIPostValidators = {
	...BooksTableAPIPostValidators,
	...JunctionTableAPIPostValidators,
	...LookupTableAPIPostValidators,
	...ShorthandTableAPIPostValidators,
	...ReadersTableAPIPostValidators,
	...BorrowTableAPIPostValidators,
	...LibrarianTableAPIPostValidators
};
