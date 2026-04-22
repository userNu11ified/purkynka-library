import * as BooksTableAPIPatchValidators from './books_table_api_patch_validators.ts';
import * as JunctionTableAPIPatchValidators from './junction_table_api_patch_validators.ts';
import * as LookupTableAPIPatchValidators from './lookup_table_api_patch_validators.ts';
import * as ShorthandTableAPIPatchValidators from './shorthand_table_api_patch_validators.ts';
import * as ReadersTableAPIPatchValidators from './readers_table_api_patch_validators.ts';
import * as BorrowTableAPIPatchValidators from './borrow_table_api_patch_validators.ts';

export const APIPatchValidators = {
	...BooksTableAPIPatchValidators,
	...JunctionTableAPIPatchValidators,
	...LookupTableAPIPatchValidators,
	...ShorthandTableAPIPatchValidators,
	...ReadersTableAPIPatchValidators,
	...BorrowTableAPIPatchValidators
};
