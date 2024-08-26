import { writable, type Writable } from 'svelte/store';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import type { Nullable } from '$shared/common_types';

export type SavedPassword = {
	salt: Buffer;
	key: Buffer;
};

export const get_saved_password = async () => {
	if (existsSync('./data/password.json')) {
		const saved_password: SavedPassword = JSON.parse(await fs.readFile('./data/password.json', 'utf-8'));
		PASSWORD.set(Buffer.from(saved_password.key).toString('hex'));
	}
};

export const PASSWORD: Writable<Nullable<string>> = writable(null);
