import { create_database_putter } from '$server/request/request';
import * as t from 'io-ts';

export const PUT = create_database_putter('discard_reasons', t.string);
