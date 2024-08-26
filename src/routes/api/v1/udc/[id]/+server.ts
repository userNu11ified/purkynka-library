import { create_database_putter } from '$server/request/request';
import { TShorthand } from '$shared/book_types';

export const PUT = create_database_putter('udc', TShorthand);
