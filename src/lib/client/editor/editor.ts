import type { Nullable } from '$shared/common_types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const EDITOR_CONTEXT_KEY = 'editor';
const EDITOR_ERROR_CONTEXT_KEY = 'editor-error';

export type EditorContext = { [key: string]: any };
export type EditorErrorContext = { [key: string]: Set<string> };

export const create_editor_context = <T>(default_value: any) => {
	setContext<Writable<T>>(EDITOR_CONTEXT_KEY, writable(default_value));
	return getContext<Writable<T>>(EDITOR_CONTEXT_KEY);
};

export const get_editor_context = <T>() => getContext<Writable<T>>(EDITOR_CONTEXT_KEY);

export const create_editor_error_context = <T>(default_value: any) => {
	setContext<Writable<T>>(EDITOR_ERROR_CONTEXT_KEY, writable(default_value));
	return getContext<Writable<T>>(EDITOR_ERROR_CONTEXT_KEY);
};

export const get_editor_error_context = <T>() => getContext<Writable<T>>(EDITOR_ERROR_CONTEXT_KEY);

export const find_item_ids = <T>(items: T[], find: T[], finder: (find_item: T, item: T) => boolean) => {
	return find.map((find_item) => items.findIndex((item) => finder(find_item, item))).filter((v) => v !== -1);
};
