import { create_database_putter } from '$server/request/request';
import { TDatabaseReader } from '$shared/borrow_types';

export const PUT = create_database_putter('readers', TDatabaseReader);
