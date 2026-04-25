import type { AvailableTheme } from '$client/theme.svelte';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const json = (await request.json()) as { theme: AvailableTheme };
	cookies.set('theme', json.theme, {
		path: '/',
		expires: new Date(new Date().getFullYear() + 1, 1, 1)
	});

	return new Response();
};
