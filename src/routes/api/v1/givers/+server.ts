import { create_database_getter, create_database_poster } from '$lib/server/request/request';
import * as t from 'io-ts';

export const GET = create_database_getter('givers');
export const POST = create_database_poster('givers', t.string);
