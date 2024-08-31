import { create_database_getter, create_database_poster } from '$server/request/request';
import * as t from 'io-ts';

export const GET = create_database_getter('authors');
export const POST = create_database_poster('authors', t.string);
