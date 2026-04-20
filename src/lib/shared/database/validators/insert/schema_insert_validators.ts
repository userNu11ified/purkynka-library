import * as BooksTableInsertValidators from './books_table_insert_validators.ts';
import * as JunctionTableInsertValidators from './junction_table_insert_validators.ts';
import * as LookupTableInsertValidators from './lookup_table_insert_validators.ts';
import * as ShorthandTableInsertValidators from './shorthand_table_insert_validators.ts';

export default {
	...BooksTableInsertValidators,
	...JunctionTableInsertValidators,
	...LookupTableInsertValidators,
	...ShorthandTableInsertValidators
};
