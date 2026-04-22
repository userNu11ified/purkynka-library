// See https://svelte.dev/docs/kit/types#app.d.ts

import type {
	BookEditorPageState,
	LookupEditorPageState,
	MergeEditorPageState,
	ShorthandEditorPageState,
	UDCEditorPageState,
	UserEditorPageState
} from '$client/components/editors/editor_page_states.svelte';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			bookEditorState?: BookEditorPageState;
			udcEditorState?: UDCEditorPageState;
			mergeEditorState?: MergeEditorPageState;
			lookupEditorState?: LookupEditorPageState;
			shorthandEditorState?: ShorthandEditorPageState;
			userEditorState?: UserEditorPageState;
		}
		// interface Platform {}
	}
}

export {};
