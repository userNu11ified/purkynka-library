import type { Nullable } from '$shared/common_types';

export type AuthorEditorContext = { first_name: Nullable<string>; last_name: string };
export type AuthorEditorErrorContext = {
	last_name: Set<string>;
};
