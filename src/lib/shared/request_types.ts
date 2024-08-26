import * as t from 'io-ts';
import { TDatabaseBook } from './book_types';

export const TBookRequest = t.type({
	amount: t.number,
	data: TDatabaseBook
});

export type BookRequest = t.TypeOf<typeof TBookRequest>;
