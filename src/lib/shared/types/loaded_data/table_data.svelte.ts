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
}
