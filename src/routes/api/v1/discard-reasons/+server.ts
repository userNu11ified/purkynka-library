import { create_database_getter, create_database_poster } from '$lib/server/request/request';
import * as t from 'io-ts';

export const GET = create_database_getter('discard_reasons');
export const POST = create_database_poster('discard_reasons', t.string);
