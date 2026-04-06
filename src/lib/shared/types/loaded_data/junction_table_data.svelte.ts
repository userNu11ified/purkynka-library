import { SvelteMap } from 'svelte/reactivity';
import { TableData } from './table_data.svelte';

type KeyExtractor<T, K> = (value: T) => K;

export class JunctionTableData<Select, PrimaryKey, SecondaryKey> extends TableData<Select> {
	private byPrimaryKey: SvelteMap<PrimaryKey, Select[]>;
	private bySecondaryKey: SvelteMap<SecondaryKey, Select[]>;

	constructor(
		private primaryKeyExtractor: KeyExtractor<Select, PrimaryKey>,
		private secondaryKeyExtractor: KeyExtractor<Select, SecondaryKey>
	) {
		super();

		this.byPrimaryKey = new SvelteMap();
		this.bySecondaryKey = new SvelteMap();
	}

	public initialize(arrayValues: Select[]) {
		super.initialize(arrayValues);

		this.initializeMap(this.byPrimaryKey, arrayValues, this.primaryKeyExtractor);
		this.initializeMap(this.bySecondaryKey, arrayValues, this.secondaryKeyExtractor);
	}

	private initializeMap<const Key extends PrimaryKey | SecondaryKey>(
		addTo: SvelteMap<Key, Select[]>,
		values: Select[],
		keyExtractor: KeyExtractor<Select, Key>
	) {
		values.forEach((v) => {
			const key = keyExtractor(v);

			if (addTo.has(key)) addTo.get(key)!.push(v);
			else addTo.set(key, [v]);
		});
	}

	public getByPrimaryKey() {
		return this.byPrimaryKey;
	}

	public getBySecondaryKey() {
		return this.bySecondaryKey;
	}
}
