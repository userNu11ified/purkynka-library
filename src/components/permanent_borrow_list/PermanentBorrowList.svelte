<script lang="ts">
	import { DATABASE } from '$client/database/database';
	import type { CopyTransformer, Filter, Sorter } from '$client/list/list';
	import type { PermanentBorrowListMappedItem } from '$client/lists/permanent_borrow_list';
	import { put_request } from '$client/request/request';
	import List from '$components/list/List.svelte';
	import ListOption from '$components/list/ListOption.svelte';
	import { format_date, map_or_null } from '$shared/book_util';
	import type { DatabaseBorrow } from '$shared/borrow_types';
	import { date_compare, string_compare } from '$shared/common_util';
	import PermanentBorrow from './PermanentBorrow.svelte';

	let list: List<DatabaseBorrow, PermanentBorrowListMappedItem>;

	const item_mapper = ({ book, reader, borrow_date }: DatabaseBorrow): PermanentBorrowListMappedItem => {
		const database_book = $DATABASE.books[book];
		const database_reader = $DATABASE.readers[reader];

		return {
			book_id: book,
			is_large: database_book.is_large,
			book_name: map_or_null<string>($DATABASE, 'book_names', database_book.name)!,
			reader_name: database_reader.name,
			price: database_book.price,
			borrow_date: new Date(borrow_date)
		};
	};

	const sorters: Sorter<PermanentBorrowListMappedItem>[] = [
		([left_id, left_item], [right_id, right_item]) => left_item.book_id - right_item.book_id,
		([left_id, left_item], [right_id, right_item]) => +left_item.is_large - +right_item.is_large,
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.book_name, right_item.book_name),
		([left_id, left_item], [right_id, right_item]) => +(left_item.price ?? 0) - +(right_item.price ?? 0),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.reader_name, right_item.reader_name),
		([left_id, left_item], [right_id, right_item]) => date_compare(left_item.borrow_date, right_item.borrow_date)
	];

	const filters: Filter<PermanentBorrowListMappedItem>[] = [
		(items, lowercase_query) => {
			if (list === undefined) return null;
			const transformed_search_query = +lowercase_query - 1;

			let found_index = items.findIndex(([id, item]) => item.book_id === transformed_search_query);
			list.go_to_index(found_index === -1 ? undefined : found_index, true);

			return null;
		},
		(items, lowercase_query) =>
			items.filter(
				([id, item]) => (item.is_large && lowercase_query === 'v') || (!item.is_large && lowercase_query === 'm')
			),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.book_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.price ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.reader_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) => items.filter(([id, item]) => format_date(item.borrow_date).includes(lowercase_query))
	];

	const copy_transformer: CopyTransformer<PermanentBorrowListMappedItem> = (items) =>
		items
			.map(
				([id, item]) =>
					`${item.book_id + 1}\t${item.is_large ? 'V' : 'm'}\t${item.book_name}\t${item.price ?? ''}\t${item.reader_name}\t${format_date(item.borrow_date)}`
			)
			.join('\n');

	$: items = $DATABASE.borrows.filter((v) => v.permanent);

	const on_click_return_book = async (borrow_index: number) => {
		const borrow = $DATABASE.borrows[borrow_index];
		borrow.return_date = new Date().toISOString();

		const res = await put_request(`${window.origin}/api/v1/borrows/${borrow_index}`, borrow);

		if (res.ok) {
			const borrow_history = await res.json();
			DATABASE.update((v) => {
				v.borrows.splice(borrow_index, 1);
				v.borrow_history[borrow.id] = borrow_history;

				return v;
			});
		}
	};
</script>

<List
	bind:this={list}
	local_storage_key="permanent-borrow-list"
	headers={['Přír. č.', '', 'Název knihy', 'Cena', 'Čtenář', 'Půjčeno dne']}
	{items}
	{item_mapper}
	{sorters}
	{filters}
	{copy_transformer}
>
	<PermanentBorrow slot="item" let:list_item {list_item} let:even {even} let:searched {searched} let:selected {selected}
	></PermanentBorrow>
	<svelte:fragment slot="options" let:item>
		<ListOption icon_type="book-return" on:click={() => on_click_return_book(item[0])}>Vrátit</ListOption>
	</svelte:fragment>
</List>
