import { goto } from '$app/navigation';
import { createPageUsed } from '$client/page_used';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const pageUsed = createPageUsed('books', '/librarian/books/view');
	if (pageUsed.current !== null) goto(pageUsed.current);
};
