import { Result } from '$shared/types/result';
import type { Nullable } from '$shared/types/util';
import { EditorFieldState, type EditorFieldStateSettings } from './editor_field_state.svelte';

const integerStringRegex = /^-?\d+$/;

type EditorFieldIntegerStateSettings = {
	range?: {
		minimum?: number;
		maximum?: number;
	};
} & EditorFieldStateSettings;

export class EditorFieldIntegerState extends EditorFieldState<
	number,
	EditorFieldIntegerStateSettings
> {
	protected parseValue(): Result<Nullable<number>, string[]> {
		if (this.trimmedValue === '') return Result.ok(null);

		const isIntegerString = integerStringRegex.test(this.trimmedValue);
		if (!isIntegerString) return Result.error(['Hodnota není celé číslo!']);

		const stringAsInteger = +this.valueState.trimmedValue;
		if (this.settings?.range !== undefined) {
			const { minimum, maximum } = this.settings.range;

			const rangeErrors: string[] = [];
			if (minimum !== undefined && stringAsInteger < minimum)
				rangeErrors.push(`Musí být alespoň ${minimum}!`);
			if (maximum !== undefined && stringAsInteger > maximum)
				rangeErrors.push(`Musí být maximálně ${maximum}!`);

			if (rangeErrors.length !== 0) return Result.error(rangeErrors);
		}

		return Result.ok(stringAsInteger);
	}

	public setFromValue(value: Nullable<number>): void {
		this.value = value === null ? '' : `${value}`;
	}
}
