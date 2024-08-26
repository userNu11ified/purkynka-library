import { DATABASE } from '$server/database/database';
import type { Unsubscriber } from 'svelte/store';

export const GET = () => {
	let unsubscriber: Unsubscriber;

	const stream = new ReadableStream({
		start(controller) {
			unsubscriber = DATABASE.subscribe((_) => {
				controller.enqueue('event: message\ndata:\n\n');
			});
		},
		cancel() {
			unsubscriber();
		}
	});

	const headers = new Headers();
	headers.append('Content-Type', 'text/event-stream');
	headers.append('Cache-Control', 'no-cache');
	headers.append('Connection', 'keep-alive');

	return new Response(stream, { headers });
};
