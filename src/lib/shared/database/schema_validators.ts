import schema_insert_validators from './validators/insert/schema_insert_validators';
import schema_update_validators from './validators/update/schema_update_validators';

export default {
	insert: schema_insert_validators,
	update: schema_update_validators
};
