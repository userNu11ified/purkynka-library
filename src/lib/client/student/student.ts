import type { Shorthand, DatabaseBook } from '$shared/book_types';
import type { DatabaseBorrow } from '$shared/borrow_types';
import type { Nullable } from '$shared/common_types';
import { writable, type Writable } from 'svelte/store';

export type StudentDatabase = {
	book_names: string[];
	authors: string[];

	udc: Shorthand[];

	books: DatabaseBook[];
	borrows: DatabaseBorrow[];
};

export const STUDENT_DATABASE: Writable<StudentDatabase> = writable();
export const INFO_OPENED = writable(false);
export const UDC_LIST_OPENED = writable(false);
export const LIST_SORT_BY_UDC: Writable<Nullable<string>> = writable(null);