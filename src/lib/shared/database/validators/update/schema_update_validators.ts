import * as BooksTableUpdateValidators from './books_table_update_validators.ts';
import * as JunctionTableUpdateValidators from './junction_table_update_validators.ts';
import * as LookupTableUpdateValidators from './lookup_table_update_validators.ts';
import * as ShorthandTableUpdateValidators from './shorthand_table_update_validators.ts';
import * as ReadersTableUpdateValidators from './readers_table_update_validators.ts';

export const SchemaUpdateValidators = {
	...BooksTableUpdateValidators,
	...JunctionTableUpdateValidators,
	...LookupTableUpdateValidators,
	...ShorthandTableUpdateValidators,
	...ReadersTableUpdateValidators
};
