import { BORDER_WIDTH } from '$client/style/theme';
import type { Nullable } from '$shared/common_types';
import { writable } from 'svelte/store';

export type ItemMapper<T, V> = (item: T, index: number) => V;
export type ListItem<T> = [id: number, item: T];
export type Sorter<T> = (left: ListItem<T>, right: ListItem<T>) => number;
export type Filter<T> = (items: ListItem<T>[], lowercase_query: string) => Nullable<ListItem<T>[]>;
export type CopyTransformer<T> = (items: ListItem<T>[]) => string;

export const HEADER_HEIGHT = 48;
export const SEARCH_BAR_HEIGHT = 40;
export const ACTION_BAR_HEIGHT = 48;

export const ITEM_SIZE = 32;

export const get_list_height = (window_height: number) =>
	window_height - HEADER_HEIGHT - SEARCH_BAR_HEIGHT - ACTION_BAR_HEIGHT - BORDER_WIDTH * 3;

export const FORCE_UPDATE = writable(false);
