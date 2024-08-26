import type { Database } from '$shared/database_types';
import { writable, type Writable } from 'svelte/store';

export const DATABASE: Writable<Database> = writable();
