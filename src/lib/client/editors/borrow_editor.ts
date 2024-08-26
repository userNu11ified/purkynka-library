import type { ID, Nullable } from '$shared/common_types';
import { writable, type Writable } from 'svelte/store';

export type BorrowEditorContext = {
	book_id: ID;
	book_name: string;
	reader_class: string;
	reader: string;
};

export type BorrowEditorErrorContext = {
	book_id: Set<string>;
	book_name: Set<string>;
	reader_class: Set<string>;
	reader: Set<string>;
};

export type BorrowEditType = 'Půjčit knihu';
export const CURRENTLY_EDITING_BORROW: Writable<Nullable<[BorrowEditType, number]>> = writable(null);
