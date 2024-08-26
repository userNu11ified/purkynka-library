import { PASSWORD, type SavedPassword } from '$server/password/password';
import { is_authenticated } from '$server/request/request';
import type { RequestHandler } from '@sveltejs/kit';
import { randomBytes, scryptSync } from 'crypto';
import { existsSync } from 'fs';
import fs from 'fs/promises';

const create_password = async (text_password: Buffer) => {
	const salt = randomBytes(32);
	const key = scryptSync(text_password, salt, 64);

	fs.writeFile(
		'./data/password.json',
		JSON.stringify({
			salt: salt,
			key: key
		})
	);

	PASSWORD.set(key.toString('hex'));

	return new Response(key.toString('hex'));
};

const recheck_password = async (text_password: Buffer) => {
	const saved: SavedPassword = JSON.parse(await fs.readFile('./data/password.json', 'utf-8'));
	const saved_salt = Buffer.from(saved.salt);
	const saved_key = Buffer.from(saved.key);

	const key = scryptSync(text_password, saved_salt, 64);

	console.log(key);
	console.log(saved_key);

	if (key.equals(saved_key)) {
		return new Response(saved_key.toString('hex'));
	} else {
		return new Response('Invalid password!', {
			status: 401
		});
	}
};

export const POST: RequestHandler = async ({ request }) => {
	const text_password = Buffer.from((await request.text()).normalize('NFKC'));

	return existsSync('./data/password.json') ? recheck_password(text_password) : create_password(text_password);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const authenticated = is_authenticated(request);
	if (authenticated !== null) return authenticated;

	await fs.rm('./data/password.json');
	PASSWORD.set(null);

	return new Response();
};
