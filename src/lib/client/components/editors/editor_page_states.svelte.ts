import { page } from '$app/state';
import { Context } from 'runed';

export type BookEditorPageState =
	| { type: 'new' }
	| { type: 'new-copy'; bookId: number }
	| { type: 'edit'; bookId: number }
	| { type: 'discard'; bookId: number };

export type UDCEditorPageState = { type: 'new' } | { type: 'edit'; udcId: number };

export type MergeEditorPageState = { values: [string, number][] };

export type LookupEditorPageState = {
	type:
		| 'bookName'
		| 'authorName'
		| 'publisher'
		| 'placeOfPublishing'
		| 'obtainedFrom'
		| 'discardReason';
	id: number;
};
export type ShorthandEditorPageState = { type: 'literatureType' | 'udc'; id: number };

export class EditorPageStates {
	public static context = new Context<EditorPageStates>('editor-page-states');

	public bookEditorState: BookEditorPageState | undefined;
	public bookEditorActive: boolean;

	public udcEditorState: UDCEditorPageState | undefined;
	public udcEditorActive: boolean;

	public mergeEditorState: MergeEditorPageState | undefined;
	public mergeEditorActive: boolean;

	public lookupEditorState: LookupEditorPageState | undefined;
	public lookupEditorActive: boolean;

	public shorthandEditorState: ShorthandEditorPageState | undefined;
	public shorthandEditorActive: boolean;

	constructor() {
		this.bookEditorState = $derived(page.state.bookEditorState);
		this.bookEditorActive = $derived(this.bookEditorState !== undefined);

		this.udcEditorState = $derived(page.state.udcEditorState);
		this.udcEditorActive = $derived(this.udcEditorState !== undefined);

		this.mergeEditorState = $derived(page.state.mergeEditorState);
		this.mergeEditorActive = $derived(this.mergeEditorState !== undefined);

		this.lookupEditorState = $derived(page.state.lookupEditorState);
		this.lookupEditorActive = $derived(this.lookupEditorState !== undefined);

		this.shorthandEditorState = $derived(page.state.shorthandEditorState);
		this.shorthandEditorActive = $derived(this.shorthandEditorState !== undefined);
	}
}
