import { goto } from '$app/navigation';
import { createPageUsed } from '$client/page_used';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const pageUsed = createPageUsed('users', '/librarian/users/students');
	if (pageUsed.current !== null) goto(pageUsed.current);
};
