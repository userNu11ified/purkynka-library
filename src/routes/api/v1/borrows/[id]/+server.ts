import { DATABASE } from '$server/database/database';
import { TDatabaseBorrow, type BorrowHistory } from '$shared/borrow_types';
import type { ID } from '$shared/common_types';
import { json, type RequestHandler } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { isLeft } from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter';
import { is_authenticated } from '$server/request/request';

export const PUT: RequestHandler = async ({ request, params }) => {
	const authenticated = is_authenticated(request);
	if (authenticated !== null) return authenticated;

	const id_parameter = params['id'];
	if (id_parameter === undefined) return new Response('ID not set!', { status: 400 });

	const id = +id_parameter as ID;
	if (isNaN(id) || id < 0) return new Response('Invalid ID!', { status: 400 });
	if (Object.keys(get(DATABASE).borrows).length <= id) return new Response('ID out of range!', { status: 400 });

	const body = await request.json().catch(() => undefined);
	if (body === undefined)
		return new Response('Invalid body!', {
			status: 400
		});

	const body_validation = TDatabaseBorrow.decode(body);

	if (isLeft(body_validation))
		return new Response(`Could not parse data for borrows!\n${PathReporter.report(body_validation).join('\n')}`, {
			status: 400
		});

	const data = body_validation.right;

	let borrow_history: BorrowHistory;

	DATABASE.update((v) => {
		borrow_history = v.borrow_history[data.id];
		borrow_history.times_extended = data.times_extended;
		borrow_history.permanent = data.permanent;

		if (data.return_date !== null) {
			borrow_history.return_date = data.return_date;
			v.borrows.splice(id, 1);
		} else {
			v.borrows[id] = data;
		}

		v.borrow_history[data.id] = borrow_history;
		return v;
	});

	return json(borrow_history!);
};
