import type { ID, Nullable } from '$shared/common_types';
import { writable, type Writable } from 'svelte/store';

export type ReaderEditorContext = {
	id: ID;
	name: string;
	class_name: ID;
	added_date: Nullable<string>;
	last_modified_date: Nullable<string>;
};

export type ReaderEditorErrorContext = {
	name: Set<string>;
	class_name: Set<string>;
};

export type ReaderEditType = 'Přidat čtenáře' | 'Upravit čtenáře' | 'Vymazat čtenáře';
export const CURRENTLY_EDITING_READER: Writable<Nullable<[ReaderEditType, number]>> = writable(null);
