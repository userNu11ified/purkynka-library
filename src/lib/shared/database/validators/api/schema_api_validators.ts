import * as BooksTableAPIValidators from './books_table_api_validators.ts';
import * as JunctionTableAPIValidators from './junction_table_api_validators.ts';
import * as LookupTableAPIValidators from './lookup_table_api_validators.ts';
import * as ShorthandTableAPIValidators from './shorthand_table_api_validators.ts';

export default {
	...BooksTableAPIValidators,
	...JunctionTableAPIValidators,
	...LookupTableAPIValidators,
	...ShorthandTableAPIValidators
};
