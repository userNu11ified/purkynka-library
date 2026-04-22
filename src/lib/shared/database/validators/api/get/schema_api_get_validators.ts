import * as BooksTableAPIGetValidators from './books_table_api_get_validators.ts';
import * as JunctionTableAPIGetValidators from './junction_table_api_get_validators.ts';
import * as LookupTableAPIGetValidators from './lookup_table_api_get_validators.ts';
import * as ShorthandTableAPIGetValidators from './shorthand_table_api_get_validators.ts';
import * as ReadersTableAPIGetValidators from './readers_table_api_get_validators.ts';
import * as BorrowTableAPIGetValidators from './borrow_table_api_get_validators.ts';

export const APIGetValidators = {
	...BooksTableAPIGetValidators,
	...JunctionTableAPIGetValidators,
	...LookupTableAPIGetValidators,
	...ShorthandTableAPIGetValidators,
	...ReadersTableAPIGetValidators,
	...BorrowTableAPIGetValidators
};
