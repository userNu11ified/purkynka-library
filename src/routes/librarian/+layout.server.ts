import { SendSelectRequest } from '$server/worker/database_worker/messages/select';
import type { LoadedLibrarianData } from '$shared/types/loaded_data/librarian_data';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	return {
		librarianData: {
			bookNames: SendSelectRequest('bookNames'),
			authorNames: SendSelectRequest('authorNames'),
			publishers: SendSelectRequest('publishers'),
			placesOfPublishing: SendSelectRequest('placesOfPublishing'),
			obtainedFrom: SendSelectRequest('obtainedFrom'),
			discardReasons: SendSelectRequest('discardReasons'),

			literatureTypes: SendSelectRequest('literatureTypes'),
			udc: SendSelectRequest('udc'),

			books: SendSelectRequest('books'),
			authorToBook: SendSelectRequest('authorToBook'),

			readerClasses: SendSelectRequest('readerClasses'),
			readers: SendSelectRequest('readers'),

			borrows: SendSelectRequest('borrows'),
			borrowHistory: SendSelectRequest('borrowHistory')
		} satisfies LoadedLibrarianData
	};
};
