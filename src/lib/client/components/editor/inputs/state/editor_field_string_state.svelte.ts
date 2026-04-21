import { Result } from '$shared/types/result';
import type { Nullable } from '$shared/types/util';
import { EditorFieldState } from './editor_field_state.svelte';

export class EditorFieldStringState extends EditorFieldState<string> {
	protected parseValue(): Result<Nullable<string>, string[]> {
		if (this.trimmedValue === '') return Result.ok(null);
		return Result.ok(this.trimmedValue);
	}

	public setFromValue(value: Nullable<string>): void {
		this.value = value === null ? '' : value;
	}
}
