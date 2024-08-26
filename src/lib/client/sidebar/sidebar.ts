import { CURRENTLY_EDITING_BOOK } from '$client/editors/book_editor';
import { setup_synced_store } from '$client/local_storage/local_storage';
import type { Nullable } from '$shared/common_types';
import { derived, writable, type Readable, type Unsubscriber, type Writable } from 'svelte/store';

export type Page = 'Seznam' | 'Zapsat knihu' | 'Výpůjčky' | 'Trvalé' | 'Vyřazené' | 'Historie' | 'Čtenáři' | 'MDT';

export const [CURRENT_PAGE_OPENED, CURRENT_PAGE_OPENED_UNSUBSCRIBER]: [Writable<Nullable<Page>>, Unsubscriber] =
	setup_synced_store('last-page', null);

export const SIDEBAR_OPENED: Readable<boolean> = derived(
	[CURRENT_PAGE_OPENED, CURRENTLY_EDITING_BOOK],
	([current_page_opened, currently_editing_book]) => current_page_opened === null && currently_editing_book === null
);
