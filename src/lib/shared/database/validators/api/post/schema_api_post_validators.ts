import * as BooksTableAPIPostValidators from './books_table_api_post_validators.ts';
import * as JunctionTableAPIPostValidators from './junction_table_api_post_validators.ts';
import * as LookupTableAPIPostValidators from './lookup_table_api_post_validators.ts';
import * as ShorthandTableAPIPostValidators from './shorthand_table_api_post_validators.ts';

export default {
	...BooksTableAPIPostValidators,
	...JunctionTableAPIPostValidators,
	...LookupTableAPIPostValidators,
	...ShorthandTableAPIPostValidators
};
