import { create_database_getter, create_database_poster } from '$lib/server/request/request';
import { TDatabaseReader } from '$shared/borrow_types';

export const GET = create_database_getter('readers');
export const POST = create_database_poster('readers', TDatabaseReader);
