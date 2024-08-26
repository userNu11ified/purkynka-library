import { create_database_getter, create_database_poster } from '$lib/server/request/request';
import * as t from 'io-ts';

export const GET = create_database_getter('book_names');
export const POST = create_database_poster('book_names', t.string);
