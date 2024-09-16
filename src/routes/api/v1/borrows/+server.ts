import { create_database_getter, create_database_poster, is_authenticated } from '$lib/server/request/request';
import { DATABASE } from '$server/database/database';
import { TDatabaseBorrow, type BorrowHistory } from '$shared/borrow_types';
import { json, type RequestHandler } from '@sveltejs/kit';
import { isLeft } from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter';

export const GET = create_database_getter('borrows');

export const POST: RequestHandler = async ({ request }) => {
	const authenticated = is_authenticated(request);
	if (authenticated !== null) return authenticated;

	const body = await request.json().catch(() => undefined);
	if (body === undefined)
		return new Response('Invalid body!', {
			status: 400
		});

	const validation = TDatabaseBorrow.decode(body);
	if (isLeft(validation)) {
		return new Response(`Could not parse data for borrows!\n${PathReporter.report(validation).join('\n')}`, {
			status: 400
		});
	}

	const value = validation.right;

	let borrow_history: BorrowHistory;

	DATABASE.update((v) => {
		v.borrows.push(value);

		const reader = v.readers.find((v) => v.id === value.reader)!;

		borrow_history = {
			book_id: value.book,
			reader_name: reader.name,
			reader_class: reader.class_name,
			borrow_date: value.borrow_date,
			return_date: null,
			permanent: value.permanent,
			times_extended: value.times_extended
		};

		v.borrow_history.push(borrow_history);

		return v;
	});

	return json(borrow_history!);
};

// export const POST = create_database_poster('borrows', TDatabaseBorrow);
