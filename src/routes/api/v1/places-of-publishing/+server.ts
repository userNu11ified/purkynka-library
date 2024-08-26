import { create_database_getter, create_database_poster } from '$lib/server/request/request';
import * as t from 'io-ts';

export const GET = create_database_getter('places_of_publishing');
export const POST = create_database_poster('places_of_publishing', t.string);
