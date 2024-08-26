import { create_database_getter, create_database_poster } from '$lib/server/request/request';
import * as t from 'io-ts';

export const GET = create_database_getter('reader_classes');
export const POST = create_database_poster('reader_classes', t.string);
