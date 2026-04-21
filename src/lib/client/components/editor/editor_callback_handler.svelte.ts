import { onDestroy } from 'svelte';

type Callback<T> = (value: T) => void;

export class EditorCallbackHandler<T = void> {
	public callbacks: Callback<T>[];

	constructor() {
		this.callbacks = $state([]);
	}

	public registerCallback(callback: Callback<T>) {
		this.registerCallbackManual(callback);
		onDestroy(() => this.unregisterCallback(callback));
	}

	public registerCallbackManual(callback: Callback<T>) {
		this.callbacks.push(callback);
	}

	public unregisterCallback(callback: Callback<T>) {
		const callbackIndex = this.callbacks.indexOf(callback);
		if (callbackIndex !== -1) this.callbacks.splice(callbackIndex, 1);
	}
}
