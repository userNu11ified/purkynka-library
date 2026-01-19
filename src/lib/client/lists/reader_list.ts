import type { Nullable } from '$shared/common_types';

export type ReaderListMappedItem = {
	id: number;
	name: string;
	class_name: string;
	added_date: Nullable<Date>;
	last_modifed_date: Nullable<Date>;
};
