import type { QueryState } from '$client/collation/query_state';
import type { DatabaseSchema, DatabaseTableName } from '$shared/types/database/schema';
import type { DescriptiveError } from '$shared/types/descriptive_error';
import { Result } from '$shared/types/result';
import type { Nullable } from '$shared/types/util';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { EditorFieldState, type EditorFieldStateSettings } from './editor_field_state.svelte';
import type { TableData } from '$shared/types/loaded_data/table_data.svelte';

let editorSearchableFieldCaseSensitive = $state(false);

export const getEditorSearchableFieldCaseSensitive = () => editorSearchableFieldCaseSensitive;
export const setEditorSearchableFieldCaseSensitive = (value: boolean) =>
	(editorSearchableFieldCaseSensitive = value);

export type EditorFieldSearchableStateParser<
	T,
	E extends DescriptiveError<string, string, unknown> = DescriptiveError<string, string, unknown>
> = (value: Nullable<EditorSearchableFieldValue<T>>) => Promise<Result<Nullable<T>, E>>;

export const createEditorFieldSearchableStateParser =
	<const T extends DatabaseTableName>(
		tableData: TableData<InferSelectModel<DatabaseSchema[T]>, unknown, unknown, unknown, T>,
		newValueCreator: (value: string) => InferInsertModel<DatabaseSchema[T]>
	) =>
	async (
		editorSearchableState: EditorFieldSearchableState<InferSelectModel<DatabaseSchema[T]>>
	) => {
		const value = editorSearchableState.parsed.parsedValue;
		if (value === null) return Result.ok(null);

		if (value.type === 'new') {
			const result = await tableData.post([newValueCreator(value.value)]);
			if (Result.isError(result)) return result;

			const values = result.value;
			return Result.ok(values[0]!);
		}

		return Result.ok(value.value.item);
	};

export type EditorFieldSearchableStateListItem<T> = {
	index: number;
	item: T;
	identifier: string | number;
	text: string | number;
};

export type EditorSearchableFieldValue<T> =
	| { type: 'new'; value: string }
	| { type: 'matched'; value: EditorFieldSearchableStateListItem<T> };

type EditorFieldSearchableStateSettings<T> = {
	list: {
		searchIn: T[];
		itemHeight?: number;
		identifierCreator?: (item: T) => string | number;
		textCreator: (item: T) => string | number;
		filter: (item: EditorFieldSearchableStateListItem<T>, queryState: QueryState) => boolean;
		matcher: (item: EditorFieldSearchableStateListItem<T>, queryState: QueryState) => boolean;
		onSpecialAdderClick?: () => void;
	};
} & EditorFieldStateSettings;

export class EditorFieldSearchableState<T> extends EditorFieldState<
	EditorSearchableFieldValue<T>,
	EditorFieldSearchableStateSettings<T>
> {
	public lowercasedValue: string;

	public queryState: QueryState;

	public listItems: EditorFieldSearchableStateListItem<T>[];
	public filteredListItems: EditorFieldSearchableStateListItem<T>[];

	public matchedItem: Nullable<EditorFieldSearchableStateListItem<T>>;

	constructor(name: string, settings: EditorFieldSearchableStateSettings<T>) {
		super(name, settings);
		this.internal.disableOnFocusOut = true;

		this.lowercasedValue = $derived(this.trimmedValue.toLocaleLowerCase('cs'));
		this.queryState = $derived({
			trimmedQuery: this.trimmedValue,
			lowercaseQuery: this.lowercasedValue,
			caseSensitive: editorSearchableFieldCaseSensitive
		});

		this.listItems = $derived.by(() => {
			const identifierCreator = this.settings!.list.identifierCreator;
			const identifiers =
				identifierCreator === undefined
					? this.settings!.list.searchIn.map((_, i) => `#${i + 1}`)
					: this.settings!.list.searchIn.map((v) => identifierCreator(v));

			const texts = this.settings!.list.searchIn.map((v) => this.settings!.list.textCreator(v));

			return texts.map((v, i) => ({
				index: i,
				item: this.settings!.list.searchIn[i],
				identifier: identifiers[i],
				text: v
			}));
		});

		this.filteredListItems = $derived(
			this.listItems.filter((v) => this.settings!.list.filter(v, this.queryState))
		);

		this.matchedItem = $derived.by(() => {
			const foundItem = this.filteredListItems.find((v) =>
				this.settings!.list.matcher(v, this.queryState)
			);
			return foundItem === undefined ? null : foundItem;
		});
	}

	protected parseValue(): Result<Nullable<EditorSearchableFieldValue<T>>, string[]> {
		if (this.settings!.list.onSpecialAdderClick !== undefined && this.matchedItem === null) {
			if (this.trimmedValue === '') return Result.ok(null);
			else return Result.error(['Value needs to be selected from list!']);
		}

		if (this.trimmedValue === '' && this.matchedItem === null) return Result.ok(null);
		if (this.matchedItem === null) return Result.ok({ type: 'new', value: this.trimmedValue });
		return Result.ok({ type: 'matched', value: this.matchedItem });
	}

	public setFromValue(value: Nullable<EditorSearchableFieldValue<T>>): void {
		if (value === null) this.value = '';
		else this.value = value.type === 'new' ? value.value : `${value.value.text}`;
	}

	public setFromListItem(value: Nullable<T>): void {
		this.value = value === null ? '' : `${this.settings!.list.textCreator(value)}`;
	}
}
