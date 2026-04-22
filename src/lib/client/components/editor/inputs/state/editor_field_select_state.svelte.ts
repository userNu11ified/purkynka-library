import { Result } from '$shared/types/result';
import type { Nullable } from '$shared/types/util';
import { EditorFieldState, type EditorFieldStateSettings } from './editor_field_state.svelte';

export type EditorFieldSelectOption<T> = {
	item: T;
	text: string;
	title: string;
};

export type EditorFieldSelectStateSettings<T> = {
	options: T[];
	textCreator: (item: T) => string;
	titleCreator: (item: T) => string;
} & EditorFieldStateSettings;

export class EditorFieldSelectState<T> extends EditorFieldState<
	T,
	EditorFieldSelectStateSettings<T>
> {
	public selectedOptionIndex: Nullable<number>;

	public selectOptions: EditorFieldSelectOption<T>[];

	constructor(name: string, settings: EditorFieldSelectStateSettings<T>) {
		super(name, settings);

		this.empty = () => this.selectedOptionIndex === null;

		this.selectedOptionIndex = $state(null);
		this.selectOptions = $derived(
			this.settings!.options.map((v) => ({
				item: v,
				text: this.settings!.textCreator(v),
				title: this.settings!.titleCreator(v)
			}))
		);
	}

	protected parseValue(): Result<Nullable<T>, string[]> {
		if (this.selectedOptionIndex !== null)
			return Result.ok(this.settings!.options[this.selectedOptionIndex]);

		return Result.ok(null);
	}

	public setFromValue(value: Nullable<T>): void {
		if (value === null) {
			this.selectedOptionIndex = null;
			return;
		}

		const valueText = this.settings!.textCreator(value);
		const foundIndex = this.selectOptions.findIndex((v) => v.text === valueText);
		this.selectedOptionIndex = foundIndex === -1 ? null : foundIndex;
	}

	public setFromIndex(index: Nullable<number>) {
		this.selectedOptionIndex = index;
	}
}
