import { SendSelectRequest } from '$server/worker/database_worker/messages/select';
import type { LoadedStudentData } from '$shared/types/loaded_data/student_data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		studentData: {
			bookNames: SendSelectRequest('bookNames'),
			authorNames: SendSelectRequest('authorNames'),
			udc: SendSelectRequest('udc'),
			books: SendSelectRequest('books'),
			authorToBook: SendSelectRequest('authorToBook'),
			borrows: SendSelectRequest('borrows')
		} satisfies LoadedStudentData
	};
};
