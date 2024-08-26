import { writable, type Unsubscriber, type Writable } from 'svelte/store';

export const get_or_set_default = <T>(key: string, default_value: T): T => {
	const stored_value = localStorage.getItem(key);

	if (stored_value === null) {
		localStorage.setItem(key, JSON.stringify(default_value));
		return default_value;
	}

	return JSON.parse(stored_value);
};

export const set_value = <T>(key: string, value: T) => {
	localStorage.setItem(key, JSON.stringify(value));
};

export const setup_synced_store = <T>(key: string, default_value: T) => {
	const store = writable(get_or_set_default(key, default_value));
	const unsubscriber = store.subscribe((v) => set_value(key, v));

	return [store, unsubscriber] as [Writable<T>, Unsubscriber];
};
