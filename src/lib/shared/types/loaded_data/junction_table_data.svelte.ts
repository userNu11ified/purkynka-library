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

		this.byPrimaryKey = $derived(this.combineEntries(this.array, this.primaryKeyExtractor));
		this.bySecondaryKey = $derived(this.combineEntries(this.array, this.secondaryKeyExtractor));
	}

	private combineEntries<const Key extends PrimaryKey | SecondaryKey>(
		values: Select[],
		keyExtractor: KeyExtractor<Select, Key>
	) {
		const combinedEntries: SvelteMap<Key, Select[]> = new SvelteMap();
		values.forEach((v) => {
			const key = keyExtractor(v);

			if (combinedEntries.has(key)) combinedEntries.get(key)!.push(v);
			else combinedEntries.set(key, [v]);
		});

		return combinedEntries;
	}

	public getByPrimaryKey() {
		return this.byPrimaryKey;
	}

	public getBySecondaryKey() {
		return this.bySecondaryKey;
	}
}
