import { create_database_getter, create_database_poster } from '$server/request/request';
import { TAuthor } from '$shared/book_types';

export const GET = create_database_getter('authors');
export const POST = create_database_poster('authors', TAuthor);
