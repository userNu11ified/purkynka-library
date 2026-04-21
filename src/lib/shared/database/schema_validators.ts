import schema_api_validators from './validators/api/schema_api_validators';
import schema_insert_validators from './validators/insert/schema_insert_validators';
import schema_update_validators from './validators/update/schema_update_validators';

export default {
	api: schema_api_validators,
	insert: schema_insert_validators,
	update: schema_update_validators
};
