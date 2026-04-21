// See https://svelte.dev/docs/kit/types#app.d.ts

import type {
	BookEditorPageState,
	UDCEditorPageState
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
		}
		// interface Platform {}
	}
}

export {};
