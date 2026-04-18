import type { Nullable } from '../util';

export class TableData<Select> {
	protected array: Select[];

	constructor() {
		this.array = $state([]);
	}

	public initialize(arrayValues: Select[]) {
		this.array = arrayValues;
	}

	public getArray() {
		return this.array;
	}

	public getByIdOrNull(id: Nullable<number>) {
		if (id === null) return null;
		return this.array[id - 1] ?? null;
	}
}
