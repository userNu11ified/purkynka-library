import { TAuthor } from '$shared/book_types';
import { create_database_putter } from '$server/request/request';

export const PUT = create_database_putter('authors', TAuthor);
