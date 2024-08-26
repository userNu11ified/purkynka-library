import type { Nullable } from '$shared/common_types';

export type SortedBy = [column_index: number, ascending: boolean];
export type SearchedBy = [column_index: Nullable<number>, search_query: string];

export const get_placeholder = (header: string) => (header.endsWith('.') ? `${header}..` : `${header}...`);
