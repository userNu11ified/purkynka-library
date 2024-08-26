import { create_database_getter, create_database_poster } from '$lib/server/request/request';
import { TShorthand } from '$shared/book_types';

export const GET = create_database_getter('literature_types');
export const POST = create_database_poster('literature_types', TShorthand);
