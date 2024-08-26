import { map_or_null } from './book_util';
import type { MappedReader } from './borrow_types';
import type { ID } from './common_types';
import type { Database } from './database_types';

export const map_id_reader = (database: Database, reader_id: ID): MappedReader => {
	const { class_name, ...rest } = database.readers[reader_id];

	return {
		class_name: map_or_null<string>(database, 'reader_classes', class_name)!,
		...rest
	};
};

export const get_return_date = (borrow_date: Date, times_extended: number) => {
	const return_date = new Date(borrow_date);
	return_date.setMonth(return_date.getMonth() + 1 + times_extended);

	return return_date;
};
