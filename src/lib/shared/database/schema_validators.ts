import schema_api_get_validators from './validators/api/get/schema_api_get_validators';
import schema_api_patch_validators from './validators/api/patch/schema_api_patch_validators';
import schema_api_post_validators from './validators/api/post/schema_api_post_validators';
import schema_insert_validators from './validators/insert/schema_insert_validators';
import schema_update_validators from './validators/update/schema_update_validators';

export default {
	api: {
		get: schema_api_get_validators,
		post: schema_api_post_validators,
		patch: schema_api_patch_validators
	},
	insert: schema_insert_validators,
	update: schema_update_validators
};
