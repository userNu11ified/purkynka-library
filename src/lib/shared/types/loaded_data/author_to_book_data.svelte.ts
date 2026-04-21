import { SvelteMap } from 'svelte/reactivity';
import { TableData } from './table_data.svelte';
import type { DatabaseSchema, DatabaseTableName } from '../database/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { Result } from '../result';

type KeyExtractor<T, K> = (value: T) => K;

export class AuthorToBookData<
	const TableName extends DatabaseTableName,
	PrimaryKey,
	SecondaryKey
> extends TableData<TableName, string> {
	private byPrimaryKey: SvelteMap<PrimaryKey, InferSelectModel<DatabaseSchema[TableName]>[]>;
	private bySecondaryKey: SvelteMap<SecondaryKey, InferSelectModel<DatabaseSchema[TableName]>[]>;

	constructor(
		tableName: TableName,
		private primaryKeyExtractor: KeyExtractor<
			InferSelectModel<DatabaseSchema[TableName]>,
			PrimaryKey
		>,
		private secondaryKeyExtractor: KeyExtractor<
			InferSelectModel<DatabaseSchema[TableName]>,
			SecondaryKey
		>
	) {
		super(tableName, (v) => `${this.primaryKeyExtractor(v)};${this.secondaryKeyExtractor(v)}`);

		this.byPrimaryKey = new SvelteMap();
		this.bySecondaryKey = new SvelteMap();
	}

	public initialize(arrayValues: InferSelectModel<DatabaseSchema[TableName]>[]) {
		super.initialize(arrayValues);
		this.generatePrecalculatedMaps();
	}

	public generatePrecalculatedMaps() {
		this.initializeMaps(this.byPrimaryKey, this.array, this.primaryKeyExtractor);
		this.initializeMaps(this.bySecondaryKey, this.array, this.secondaryKeyExtractor);
	}

	private initializeMaps<const Key extends PrimaryKey | SecondaryKey>(
		addTo: SvelteMap<Key, InferSelectModel<DatabaseSchema[TableName]>[]>,
		values: InferSelectModel<DatabaseSchema[TableName]>[],
		keyExtractor: KeyExtractor<InferSelectModel<DatabaseSchema[TableName]>, Key>
	) {
		addTo.clear();

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

	public override async post(...args: Parameters<TableData<TableName>['post']>) {
		return super.post(...args).then((result) => {
			if (Result.isOk(result)) this.generatePrecalculatedMaps();
			return result;
		});
	}

	public override async patch(): Promise<never> {
		throw new Error('PATCH not supported!');
	}
}
