<script lang="ts">
	import { ITEM_SIZE, type CopyTransformer, type Filter, type Sorter } from '$client/list/list';
	import type { BorrowHistoryListMappedItem } from '$client/lists/borrow_history_list';
	import List from '$components/list/List.svelte';
	import { format_date, map_date_or_null, map_or_null } from '$shared/book_util';
	import type { BorrowHistory } from '$shared/borrow_types';
	import type { ID } from '$shared/common_types';
	import { date_compare, string_compare } from '$shared/common_util';
	import BorrowHistoryItem from '$components/borrow_history_list/BorrowHistoryItem.svelte';
	import { DATABASE } from '$client/database/database';

	let list: List<BorrowHistory, BorrowHistoryListMappedItem>;

	const item_mapper = ({
		book_id,
		reader_name,
		reader_class,
		borrow_date,
		return_date,
		permanent,
		times_extended
	}: BorrowHistory): BorrowHistoryListMappedItem => {
		const database_book = $DATABASE.books[book_id];

		return {
			book_id,
			is_large: database_book.is_large,
			book_name: map_or_null<string>($DATABASE, 'book_names', database_book.name)!,
			reader_name,
			reader_class: map_or_null<string>($DATABASE, 'reader_classes', reader_class as ID)!,
			borrow_date: new Date(borrow_date),
			return_date: map_date_or_null(return_date),
			permanent,
			times_extended
		};
	};

	const sorters: Sorter<BorrowHistoryListMappedItem>[] = [
		([left_id, left_item], [right_id, right_item]) => left_id - right_id,
		([left_id, left_item], [right_id, right_item]) => left_item.book_id - right_item.book_id,
		([left_id, left_item], [right_id, right_item]) => +left_item.is_large - +right_item.is_large,
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.book_name, right_item.book_name),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.reader_name, right_item.reader_name),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.reader_class, right_item.reader_class),
		([left_id, left_item], [right_id, right_item]) => date_compare(left_item.borrow_date, right_item.borrow_date),
		([left_id, left_item], [right_id, right_item]) => {
			if (left_item.permanent || right_item.permanent) return +left_item.permanent - +right_item.permanent;
			else return date_compare(left_item.return_date, right_item.return_date);
		},
		([left_id, left_item], [right_id, right_item]) => +left_item.permanent - +right_item.permanent,
		([left_id, left_item], [right_id, right_item]) => left_item.times_extended - right_item.times_extended
	];

	const filters: Filter<BorrowHistoryListMappedItem>[] = [
		(items, lowercase_query) => {
			if (list === undefined) return null;
			const transformed_search_query = `${+lowercase_query - 1}`;

			let found_index = items.findIndex(([id, item]) => `${id}` === transformed_search_query);
			list.go_to_index(found_index === -1 ? undefined : found_index, true);

			return null;
		},
		(items, lowercase_query) => {
			if (lowercase_query === '') return items;

			const transformed_search_query = +lowercase_query - 1;
			return items.filter(([id, item]) => item.book_id === transformed_search_query);
		},
		(items, lowercase_query) =>
			items.filter(
				([id, item]) => (item.is_large && lowercase_query === 'v') || (!item.is_large && lowercase_query === 'm')
			),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.book_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.reader_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.reader_class ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) => items.filter(([id, item]) => format_date(item.borrow_date).includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => item.return_date && format_date(item.return_date).includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(
				([id, item]) => (item.permanent && lowercase_query === 'ano') || (!item.permanent && lowercase_query === 'ne')
			),
		(items, lowercase_query) => items.filter(([id, item]) => `${item.times_extended}`.includes(lowercase_query))
	];

	const copy_transformer: CopyTransformer<BorrowHistoryListMappedItem> = (items) =>
		items
			.map(
				([id, item]) =>
					`${id + 1}\t${item.book_id + 1}\t${item.is_large ? 'V' : 'm'}\t${item.book_name}\t${item.reader_name}\t${item.reader_class}\t${format_date(item.borrow_date)}\t${item.permanent ? 'Trvale' : item.return_date ? format_date(item.return_date) : '—'}\t${item.permanent ? 'Ano' : 'Ne'}\t${item.times_extended}x`
			)
			.join('\n');
</script>

<List
	bind:this={list}
	local_storage_key="borrow-history-list"
	headers={[
		'Výpůjčka č.',
		'Přír. č.',
		'',
		'Název knihy',
		'Čtenář',
		'Třída',
		'Půjčeno',
		'Vráceno',
		'Trvale',
		'Prodlouženo'
	]}
	items={$DATABASE.borrow_history}
	{item_mapper}
	{sorters}
	{filters}
	{copy_transformer}
	has_options={false}
>
	<BorrowHistoryItem
		slot="item"
		let:list_item
		{list_item}
		let:even
		{even}
		let:searched
		{searched}
		let:selected
		{selected}
	/>
</List>
