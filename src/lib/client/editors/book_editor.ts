import type { ID, Nullable } from '$shared/common_types';
import { writable, type Writable } from 'svelte/store';

export type BookEditorContext = { [key: string]: any };
export type BookEditorErrorContext = { [key: string]: Set<string> };

export type BookEditType = 'Vytvořit knihu' | 'Upravit knihu' | 'Vyřadit knihu' | 'Zrušit vyřazení knihy';
export const CURRENTLY_EDITING_BOOK: Writable<Nullable<[BookEditType, ID]>> = writable(null);
