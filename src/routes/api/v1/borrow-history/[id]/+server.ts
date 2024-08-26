import { create_database_putter } from '$server/request/request';
import { TBorrowHistory } from '$shared/borrow_types';

export const PUT = create_database_putter('borrow_history', TBorrowHistory);
