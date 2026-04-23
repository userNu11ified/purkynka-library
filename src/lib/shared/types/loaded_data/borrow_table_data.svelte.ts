import type { BorrowInsert, BorrowSelect } from '$shared/database/tables/borrow_tables';
import { SvelteMap } from 'svelte/reactivity';
import { TableWithIdData, type PatchOptions } from './table_with_id_data.svelte';
import { Result } from '../result';
import type { DeleteError, PatchError, PostError } from './table_data.svelte';

export class BorrowTableData extends TableWithIdData<BorrowSelect, 'borrows'> {
	private byBookIdMap: SvelteMap<number, BorrowSelect>;

	constructor() {
		super('borrows');

		this.byBookIdMap = new SvelteMap();
	}

	public getByBookIdMap() {
		return this.byBookIdMap;
	}

	public getByBookIdOrNull(bookId: number) {
		return this.byBookIdMap.get(bookId) ?? null;
	}

	public override initialize(array: BorrowSelect[]) {
		super.initialize(array);
		this.array.forEach((v) => this.byBookIdMap.set(v.bookId, v));
	}

	public async post(postedValues: BorrowInsert[]): Promise<Result<BorrowSelect[], PostError>> {
		return super.post(postedValues).then((postResult) => {
			if (Result.isOk(postResult)) {
				postResult.value.forEach((v) => this.byBookIdMap.set(v.bookId, v));
			}

			return postResult;
		});
	}

	public async patch(
		patchOptions: PatchOptions<BorrowSelect>
	): Promise<Result<BorrowSelect[], PatchError>> {
		return super.patch(patchOptions).then((patchResult) => {
			if (Result.isOk(patchResult)) {
				patchResult.value.forEach((v) => this.byBookIdMap.set(v.bookId, v));
			}

			return patchResult;
		});
	}

	public async delete(removeIds: number[]): Promise<Result<BorrowSelect[], DeleteError>> {
		return super.delete(removeIds).then((patchResult) => {
			if (Result.isOk(patchResult)) {
				patchResult.value.forEach((v) => this.byBookIdMap.delete(v.bookId));
			}

			return patchResult;
		});
	}
}
