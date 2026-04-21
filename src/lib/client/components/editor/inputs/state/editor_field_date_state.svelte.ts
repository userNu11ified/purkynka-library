import { Result } from '$shared/types/result';
import type { Nullable } from '$shared/types/util';
import { EditorFieldState, type EditorFieldStateSettings } from './editor_field_state.svelte';

const dotBeforeNumberWithNoSpace = /\.(\d)/g;
const dateRegex = /^([1-9]|[12][0-9]|3[01])\. ?([1-9]|1[012])\. ?(\d+)$/;

export class EditorFieldDateState extends EditorFieldState<Date> {
	constructor(name: string, settings?: EditorFieldStateSettings) {
		super(name, settings);
		this.wrapOnFocusOut();
	}

	private wrapOnFocusOut() {
		if (this.settings === undefined)
			this.settings = { inputOptions: { onFocusOut: () => this.onFocusOut() } };
		else if (this.settings.inputOptions === undefined)
			this.settings.inputOptions = { onFocusOut: () => this.onFocusOut() };
		else if (this.settings.inputOptions.onFocusOut === undefined)
			this.settings.inputOptions.onFocusOut = () => this.onFocusOut();
		else {
			const providedOnFocusOut = this.settings.inputOptions.onFocusOut!;
			this.settings.inputOptions.onFocusOut = () => {
				this.onFocusOut();
				providedOnFocusOut();
			};
		}
	}

	private onFocusOut() {
		if (this.parsed.parseErrors.length !== 0) return;
		this.value = this.value.replaceAll(dotBeforeNumberWithNoSpace, '. $1');
	}

	protected parseValue(): Result<Nullable<Date>, string[]> {
		if (this.trimmedValue === '') return Result.ok(null);

		const validDate = dateRegex.exec(this.trimmedValue);
		if (validDate === null) return Result.error(['Invalid format date!']);

		const [_, day, month, year] = validDate;
		return Result.ok(new Date(+year, +month - 1, +day));
	}

	public setFromValue(value: Nullable<Date>): void {
		this.value = value === null ? '' : value.toLocaleDateString('cs');
	}
}
