import { Result } from '$shared/types/result';
import type { Nullable } from '$shared/types/util';

export type EditorFieldStateSettings = {
	inputOptions?: {
		width?: string;
		disabled?: boolean;
		textAlignment?: 'left' | 'center' | 'right';
		errorAlignment?: 'left' | 'right';
		onFocusOut?: () => void;
	};
	required?: boolean;
	hintTextCreator?: () => string;
};

export abstract class EditorFieldState<
	T,
	S extends EditorFieldStateSettings = EditorFieldStateSettings
> {
	public internal: { disableOnFocusOut: boolean };

	public name: string;
	public settings: S | undefined;

	public value: string;
	public trimmedValue: string;
	public valueState: { value: string; trimmedValue: string };

	public empty: () => boolean;

	public parsed: { parsedValue: Nullable<T>; parseErrors: string[] };
	public invalid: boolean;

	constructor(name: string, settings?: S) {
		this.internal = $state({ disableOnFocusOut: false });

		this.name = name;
		this.settings = $state(settings);

		this.value = $state('');
		this.trimmedValue = $derived(this.value.trim());
		this.valueState = $derived({ value: this.value, trimmedValue: this.trimmedValue });

		this.empty = $state(() => this.valueState.trimmedValue === '');

		this.parsed = $derived.by(() => {
			if (this.settings?.required && this.empty()) {
				return { parsedValue: null, parseErrors: ['This field is required!'] };
			}

			const parseValueResult = this.parseValue();
			if (Result.isOk(parseValueResult)) {
				return { parsedValue: parseValueResult.value, parseErrors: [] };
			} else {
				return { parsedValue: null, parseErrors: parseValueResult.value };
			}
		});
		this.invalid = $derived(this.parsed.parseErrors.length !== 0);
	}

	protected abstract parseValue(): Result<Nullable<T>, string[]>;
	public abstract setFromValue(value: Nullable<T>): void;

	public getParsedValue() {
		return this.parsed.parsedValue;
	}
}
