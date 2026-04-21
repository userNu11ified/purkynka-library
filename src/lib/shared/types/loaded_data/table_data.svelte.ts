import type { DatabaseWorkerResult } from '$server/worker/database_worker/database_worker_types';
import type { InsertResponse } from '$server/worker/database_worker/messages/insert';
import { makeAPIRequest } from '../database/api';
import type { DatabaseSchema, DatabaseTableName } from '../database/schema';
import { Result, type FlattenedResult } from '../result';
import { camelCaseToKebabCase, type CamelCaseToKebabCase } from '../string_util';
import type { Nullable } from '../util';
import { type } from 'arktype';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
	failedToDelete,
	failedToPatch,
	failedToPost,
	type FailedToDelete,
	type FailedToPatch,
	type FailedToPost,
	type ValidationError
} from '$shared/error/api_error';
import schema_api_get_validators from '$shared/database/validators/api/get/schema_api_get_validators';
import { createValidationResultErrorFromArkErrors } from '../validators/validator_util';
import type schema_update_validators from '$shared/database/validators/update/schema_update_validators';
import { SvelteMap } from 'svelte/reactivity';
import type { RemoveResponse } from '$server/worker/database_worker/messages/remove';

export type TableDataType<T extends TableData<K>, K extends DatabaseTableName = DatabaseTableName> =
	T extends TableData<infer TableName> ? InferSelectModel<DatabaseSchema[TableName]> : never;

export class TableData<const TableName extends DatabaseTableName, K = number> {
	protected tableName: TableName;
	protected endpoint: CamelCaseToKebabCase<TableName>;
	protected array: InferSelectModel<DatabaseSchema[TableName]>[];
	protected map: SvelteMap<K, InferSelectModel<DatabaseSchema[TableName]>>;

	protected keyExtractor: (value: InferSelectModel<DatabaseSchema[TableName]>) => K;

	constructor(tableName: TableName, keyExtractor: typeof this.keyExtractor) {
		this.tableName = tableName;
		this.endpoint = camelCaseToKebabCase(tableName);

		this.array = $state([]);
		this.map = new SvelteMap();
		this.keyExtractor = keyExtractor;
	}

	public initialize(arrayValues: typeof this.array) {
		this.array = arrayValues;
		this.initializeMap();
	}

	public initializeMap() {
		this.map.clear();
		this.array.forEach((v) => this.map.set(this.keyExtractor(v), v));
	}

	public getArray() {
		return this.array;
	}

	public getByIdOrNull(id: Nullable<number>) {
		if (id === null) return null;
		return this.array[id - 1] ?? null;
	}

	public async post(
		values: InferInsertModel<DatabaseSchema[TableName]>[]
	): Promise<Result<typeof this.array, FailedToPost | ValidationError>> {
		const insertResponse = (await makeAPIRequest('POST', this.endpoint, values).then((r) =>
			r.json()
		)) as FlattenedResult<DatabaseWorkerResult<InsertResponse<TableName>>>;

		if (Result.isFlatError(insertResponse)) {
			return Result.error(failedToPost({ postError: insertResponse }));
		}

		const validator = schema_api_get_validators[this.tableName].array();
		const validatedValues = validator(insertResponse.values);

		if (validatedValues instanceof type.errors) {
			return createValidationResultErrorFromArkErrors(validatedValues);
		}

		const morphedValues = validatedValues as typeof this.array;
		this.array.push(...morphedValues);

		return Result.ok(morphedValues);
	}

	public async patch(
		ids: K[],
		newValue: (typeof schema_update_validators)[TableName]['infer']
	): Promise<Result<typeof this.array, FailedToPatch | ValidationError>> {
		const updateResponse = (await makeAPIRequest('PATCH', this.endpoint, { ids, newValue }).then(
			(r) => r.json()
		)) as FlattenedResult<DatabaseWorkerResult<InsertResponse<TableName>>>;

		if (Result.isFlatError(updateResponse)) {
			return Result.error(failedToPatch({ patchError: updateResponse }));
		}

		const validator = schema_api_get_validators[this.tableName].array();
		const validatedValues = validator(updateResponse.values);

		if (validatedValues instanceof type.errors) {
			return createValidationResultErrorFromArkErrors(validatedValues);
		}

		const morphedValues = validatedValues as typeof this.array;
		ids.forEach((id) => {
			const oldObject = this.map.get(id)!;
			const newObject = morphedValues.find(
				(morphedValue) => this.keyExtractor(morphedValue) === id
			)! as typeof oldObject;

			Object.keys(newObject).forEach((v) => {
				oldObject[v as keyof typeof oldObject] = newObject[v as keyof typeof oldObject];
			});
		});

		return Result.ok(morphedValues);
	}

	public async delete(
		ids: K[]
	): Promise<Result<typeof this.array, FailedToDelete | ValidationError>> {
		const removeResponse = (await makeAPIRequest('DELETE', this.endpoint, { ids }).then((r) =>
			r.json()
		)) as FlattenedResult<DatabaseWorkerResult<RemoveResponse<TableName>>>;

		if (Result.isFlatError(removeResponse)) {
			return Result.error(failedToDelete({ patchError: removeResponse }));
		}

		const validator = schema_api_get_validators[this.tableName].array();
		const validatedValues = validator(removeResponse.values);

		if (validatedValues instanceof type.errors) {
			return createValidationResultErrorFromArkErrors(validatedValues);
		}

		const morphedValues = validatedValues as typeof this.array;
		const morphedValueKeys = morphedValues.map((v) => this.keyExtractor(v));

		this.array = this.array.filter((v) => !morphedValueKeys.includes(this.keyExtractor(v)));
		this.initializeMap();

		return Result.ok(morphedValues);
	}
}
