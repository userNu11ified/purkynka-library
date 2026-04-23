import { SvelteMap } from 'svelte/reactivity';
import { TableData, type DeleteError, type PatchError, type PostError } from './table_data.svelte';
import type { DatabaseMatchedByIdTableName } from '$shared/types/database/schema';
import { Result } from '$shared/types/result';
import { makeAPIRequest } from '$shared/types/database/api';
import type { InsertResponse } from '$server/worker/database_worker/messages/insert';
import type { DatabaseWorkerResult } from '$server/worker/database_worker/database_worker_types';
import { failedToDelete, failedToPatch, failedToPost } from '$shared/error/api_error';
import { APIGetValidators } from '$shared/database/validators/api/get/schema_api_get_validators';
import { type } from 'arktype';
import { createValidationResultErrorFromArkErrors } from '$shared/types/validators/validator_util';
import type { UpdateResponse } from '$server/worker/database_worker/messages/update';
import type { AtLeastOneKey, Nullable } from '$shared/types/util';
import type { RemoveResponse } from '$server/worker/database_worker/messages/remove';
import type { APIPostValidators } from '$shared/database/validators/api/post/schema_api_post_validators';
import type { APIPatchValidators } from '$shared/database/validators/api/patch/schema_api_patch_validators';

type PostOptions<T extends ObjectWithId> = Partial<T>[];
export const tableWithIdPostBody = (
	from: (typeof APIPostValidators)[DatabaseMatchedByIdTableName]
) => from.array().atLeastLength(1);

export type PatchOptions<T extends ObjectWithId> = {
	ids: number[];
	newValue: AtLeastOneKey<T>;
};
export const tableWithIdPatchBody = (
	from: (typeof APIPatchValidators)[DatabaseMatchedByIdTableName]
) =>
	type({
		ids: 'number[] >= 1',
		newValue: from
	});

type DeleteOptions = number[];
export const tableWithIdDeleteBody = type('number[] >= 1');

type ObjectWithId = { id: number };

export class TableWithIdData<
	T extends ObjectWithId,
	const TableName extends DatabaseMatchedByIdTableName
> extends TableData<T, T[], PatchOptions<T>, DeleteOptions, TableName> {
	private map: SvelteMap<number, T>;

	constructor(databaseTableName: TableName) {
		super(databaseTableName);
		this.map = new SvelteMap();
	}

	public override initialize(array: T[]) {
		super.initialize(array);
		this.array.forEach((v) => this.map.set(v.id, v));
	}

	public getMap() {
		return this.map;
	}

	public getValueByIdOrNull(id: Nullable<number>) {
		if (id === null) return null;
		return this.map.get(id) ?? null;
	}

	public async post(postedValues: PostOptions<T>): Promise<Result<T[], PostError>> {
		const postResult = await makeAPIRequest<DatabaseWorkerResult<InsertResponse<TableName>>>(
			'POST',
			this.apiTableName,
			postedValues
		);

		if (Result.isFlatError(postResult))
			return Result.error(failedToPost({ postError: postResult }));

		const selectValidator = APIGetValidators[this.databaseTableName].array();
		const insertedValues = selectValidator(postResult.values);
		if (insertedValues instanceof type.errors)
			return createValidationResultErrorFromArkErrors(insertedValues);

		const tableValues = insertedValues as T[];
		this.array.push(...tableValues);
		tableValues.forEach((v) => this.map.set(v.id, v));

		return Result.ok(tableValues);
	}

	public async patch(patchOptions: PatchOptions<T>): Promise<Result<T[], PatchError>> {
		const patchResult = await makeAPIRequest<DatabaseWorkerResult<UpdateResponse<TableName>>>(
			'PATCH',
			this.apiTableName,
			patchOptions
		);

		if (Result.isFlatError(patchResult))
			return Result.error(failedToPatch({ patchError: patchResult }));

		const selectValidator = APIGetValidators[this.databaseTableName].array();
		const updatedValues = selectValidator(patchResult.values);
		if (updatedValues instanceof type.errors)
			return createValidationResultErrorFromArkErrors(updatedValues);

		const tableValues = updatedValues as T[];
		const valueKeys = Object.keys(tableValues[0]) as (keyof T)[];
		tableValues.forEach((newValue) => {
			const oldValue = this.map.get(newValue.id)!;
			valueKeys.forEach((v) => (oldValue[v] = newValue[v]));
		});

		return Result.ok(tableValues);
	}

	public async delete(deletedIds: DeleteOptions): Promise<Result<T[], DeleteError>> {
		const deleteResult = await makeAPIRequest<DatabaseWorkerResult<RemoveResponse<TableName>>>(
			'DELETE',
			this.apiTableName,
			deletedIds
		);

		if (Result.isFlatError(deleteResult))
			return Result.error(failedToDelete({ deleteError: deleteResult }));

		const selectValidator = APIGetValidators[this.databaseTableName].array();
		const deletedValues = selectValidator(deleteResult.values);
		if (deletedValues instanceof type.errors)
			return createValidationResultErrorFromArkErrors(deletedValues);

		const tableValues = deletedValues as T[];

		const idsToRemove = tableValues.map((v) => v.id);
		const itemIndexes = idsToRemove
			.map((id) => this.array.findIndex((v) => v.id === id))
			.filter((v) => v !== -1);

		itemIndexes.sort((a, b) => b - a);

		idsToRemove.forEach((id) => this.map.delete(id));
		itemIndexes.forEach((index) => this.array.splice(index, 1));

		return Result.ok(tableValues);
	}
}
