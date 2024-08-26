import { create_database_putter } from '$server/request/request';
import * as t from 'io-ts';

export const PUT = create_database_putter('givers', t.string);
