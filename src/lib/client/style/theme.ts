import { setup_synced_store } from '$client/local_storage/local_storage';
import { type Unsubscriber, type Writable } from 'svelte/store';
import { pixels } from './css';

export const FONT_SIZE_REGULAR = pixels(16);
export const FONT_SIZE_LARGE = pixels(20);
export const FONT_SIZE_HUGE = pixels(32);
export const FONT_SIZE_MASSIVE = pixels(64);

export const BORDER_WIDTH = 2;

export const SCROLLBAR_WIDTH = 10;

export const SIDEBAR_CLOSED_WIDTH = 64 + BORDER_WIDTH;
export const SIDEBAR_OPENED_WIDTH = 256 + BORDER_WIDTH;

export const [DARK_THEME, DARK_THEME_UNSUBSCRIBER]: [Writable<boolean>, Unsubscriber] = setup_synced_store(
	'dark-theme',
	true
);
