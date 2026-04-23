import type {
	AuthorToBookInsert,
	AuthorToBookSelect
} from '$shared/database/tables/junction_tables';
import { type } from 'arktype';
import { TableData, type DeleteError, type PostError } from './table_data.svelte';
import { APIPostValidators } from '$shared/database/validators/api/post/schema_api_post_validators';
import { makeAPIJsonRequest } from '$shared/types/database/api';
import type { DatabaseWorkerResult } from '$server/worker/database_worker/database_worker_types';
import type { InsertResponse } from '$server/worker/database_worker/messages/insert';
import { Result } from '$shared/types/result';
import { failedToDelete, failedToPost } from '$shared/error/api_error';
import { APIGetValidators } from '$shared/database/validators/api/get/schema_api_get_validators';
import { createValidationResultErrorFromArkErrors } from '$shared/types/validators/validator_util';
import { SvelteMap } from 'svelte/reactivity';
import type { RemoveResponse } from '$server/worker/database_worker/messages/remove';
import type { Nullable } from '../util';

type PostOptions = AuthorToBookInsert[];
export const authorToBookPostBody = APIPostValidators.authorToBook.array().atLeastLength(1);

type PatchOptions = never;

type DeleteOptions = typeof authorToBookDeleteBody.infer;
export const authorToBookDeleteBody = type({
	deleteBy: "'bookId' | 'authorId'",
	ids: 'number[] >= 1'
}).or({
	deleteBy: "'both'",
	ids: type({ bookId: 'number', authorId: 'number' }).array().atLeastLength(1)
});

export class AuthorToBookTableData extends TableData<
	AuthorToBookSelect,
	PostOptions,
	PatchOptions,
	DeleteOptions,
	'authorToBook'
> {
	private byBookIdMap: SvelteMap<number, AuthorToBookSelect[]>;
	private byAuthorIdMap: SvelteMap<number, AuthorToBookSelect[]>;

	constructor(private selectValidator = APIGetValidators.authorToBook.array()) {
		super('authorToBook');

		this.byBookIdMap = new SvelteMap();
		this.byAuthorIdMap = new SvelteMap();
	}

	private addToMaps(values: AuthorToBookSelect[]) {
		values.forEach((toAdd) => {
			const byBookIdValue = this.byBookIdMap.get(toAdd.bookId);
			if (byBookIdValue === undefined) this.byBookIdMap.set(toAdd.bookId, [toAdd]);
			else byBookIdValue.push(toAdd);

			const byAuthorIdValue = this.byAuthorIdMap.get(toAdd.authorId);
			if (byAuthorIdValue === undefined) this.byAuthorIdMap.set(toAdd.authorId, [toAdd]);
			else byAuthorIdValue.push(toAdd);
		});
	}

	private removeFromMaps(values: AuthorToBookSelect[]) {
		values.forEach((toRemove) => {
			const byBookIdValue = this.byBookIdMap.get(toRemove.bookId);
			if (byBookIdValue !== undefined) {
				const removeIndex = byBookIdValue.findIndex((v) => v.authorId === toRemove.authorId);
				if (removeIndex !== -1) byBookIdValue.splice(removeIndex, 1);
				if (byBookIdValue.length === 0) this.byBookIdMap.delete(toRemove.bookId);
			}

			const byAuthorIdValue = this.byAuthorIdMap.get(toRemove.authorId);
			if (byAuthorIdValue !== undefined) {
				const removeIndex = byAuthorIdValue.findIndex((v) => v.bookId === toRemove.bookId);
				if (removeIndex !== -1) byAuthorIdValue.splice(removeIndex, 1);
				if (byAuthorIdValue.length === 0) this.byAuthorIdMap.delete(toRemove.authorId);
			}
		});
	}

	public override initialize(array: AuthorToBookSelect[]) {
		super.initialize(array);
		this.addToMaps(this.array);
	}

	public getByBookIdMap() {
		return this.byBookIdMap;
	}

	public getByAuthorIdMap() {
		return this.byAuthorIdMap;
	}

	public getValueByBookIdOrNull(bookId: Nullable<number>) {
		if (bookId === null) return null;
		return this.byBookIdMap.get(bookId) ?? null;
	}

	public getValueByAuthorIdOrNull(authorId: Nullable<number>) {
		if (authorId === null) return null;
		return this.byAuthorIdMap.get(authorId) ?? null;
	}

	public async post(postedValues: PostOptions): Promise<Result<AuthorToBookSelect[], PostError>> {
		const postResult = await makeAPIJsonRequest<
			DatabaseWorkerResult<InsertResponse<'authorToBook'>>
		>('POST', this.apiTableName, postedValues);

		if (Result.isFlatError(postResult))
			return Result.error(failedToPost({ postError: postResult }));

		const insertedValues = this.selectValidator(postResult.values);
		if (insertedValues instanceof type.errors)
			return createValidationResultErrorFromArkErrors(insertedValues);

		const tableValues = insertedValues as AuthorToBookSelect[];

		this.array.push(...tableValues);
		this.addToMaps(tableValues);

		return Result.ok(tableValues);
	}

	public override patch(): never {
		throw new Error('PATCH not supported!');
	}

	public async delete(
		deleteOptions: DeleteOptions
	): Promise<Result<AuthorToBookSelect[], DeleteError>> {
		const deleteResult = await makeAPIJsonRequest<
			DatabaseWorkerResult<RemoveResponse<'authorToBook'>>
		>('DELETE', this.apiTableName, deleteOptions);

		if (Result.isFlatError(deleteResult))
			return Result.error(failedToDelete({ deleteError: deleteResult }));

		const deletedValues = this.selectValidator(deleteResult.values);
		if (deletedValues instanceof type.errors)
			return createValidationResultErrorFromArkErrors(deletedValues);

		const tableValues = deletedValues as AuthorToBookSelect[];

		const indexesToRemove = tableValues
			.map(({ bookId, authorId }) =>
				this.array.findIndex((v) => v.bookId === bookId && v.authorId === authorId)
			)
			.filter((v) => v !== -1);

		indexesToRemove.sort((a, b) => b - a);

		this.removeFromMaps(tableValues);
		indexesToRemove.forEach((index) => this.array.splice(index, 1));

		return Result.ok(tableValues);
	}
}
