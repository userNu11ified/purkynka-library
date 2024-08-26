import { create_database_getter, create_database_poster } from '$lib/server/request/request';
import { TBorrowHistory } from '$shared/borrow_types';

export const GET = create_database_getter('borrow_history');
export const POST = create_database_poster('borrow_history', TBorrowHistory);
