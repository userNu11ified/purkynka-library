import { create_database_putter } from '$server/request/request';
import { TShorthand } from '$shared/book_types';
import * as t from 'io-ts';

export const PUT = create_database_putter('publishers', t.string);
