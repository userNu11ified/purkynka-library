import { writable } from 'svelte/store';

export const WINDOW_WIDTH = writable(window.innerWidth);
export const WINDOW_HEIGHT = writable(window.innerHeight);
