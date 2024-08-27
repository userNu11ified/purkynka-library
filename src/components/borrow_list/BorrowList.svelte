<script lang="ts">
	import { DATABASE } from '$client/database/database';
	import type { CopyTransformer, Filter, Sorter } from '$client/list/list';
	import type { BorrowListMappedItem } from '$client/lists/borrow_list';
	import { put_request } from '$client/request/request';
	import List from '$components/list/List.svelte';
	import ListOption from '$components/list/ListOption.svelte';
	import { format_date, map_or_null } from '$shared/book_util';
	import type { DatabaseBorrow } from '$shared/borrow_types';
	import { get_return_date } from '$shared/borrow_util';
	import { date_compare, string_compare } from '$shared/common_util';
	import Borrow from './Borrow.svelte';

	let list: List<DatabaseBorrow, BorrowListMappedItem>;

	const item_mapper = ({ book, reader, borrow_date, times_extended }: DatabaseBorrow): BorrowListMappedItem => {
		const database_book = $DATABASE.books[book];
		const database_reader = $DATABASE.readers[reader];

		const mapped_borrow_date = new Date(borrow_date);

		return {
			book_id: book,
			is_large: database_book.is_large,
			book_name: map_or_null<string>($DATABASE, 'book_names', database_book.name)!,
			reader_name: database_reader.name,
			reader_class: map_or_null<string>($DATABASE, 'reader_classes', database_reader.class_name)!,
			borrow_date: mapped_borrow_date,
			times_extended,
			return_date: get_return_date(mapped_borrow_date, times_extended)
		};
	};

	const sorters: Sorter<BorrowListMappedItem>[] = [
		([left_id, left_item], [right_id, right_item]) => left_item.book_id - right_item.book_id,
		([left_id, left_item], [right_id, right_item]) => +left_item.is_large - +right_item.is_large,
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.book_name, right_item.book_name),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.reader_name, right_item.reader_name),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.reader_class, right_item.reader_class),
		([left_id, left_item], [right_id, right_item]) => date_compare(left_item.borrow_date, right_item.borrow_date),
		([left_id, left_item], [right_id, right_item]) => left_item.times_extended - right_item.times_extended,
		([left_id, left_item], [right_id, right_item]) => date_compare(left_item.return_date, right_item.return_date)
	];

	const filters: Filter<BorrowListMappedItem>[] = [
		(items, lowercase_query) => {
			if (list === undefined) return null;
			const transformed_search_query = +lowercase_query - 1;

			let found_index = items.findIndex(([id, item]) => item.book_id === transformed_search_query);
			list.go_to_index(found_index === -1 ? undefined : found_index, true);

			return null;
		},
		(items, lowercase_query) =>
			items.filter(
				([id, item]) => (item.is_large && lowercase_query === 'V') || (!item.is_large && lowercase_query === 'm')
			),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.book_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.reader_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.reader_class ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) => items.filter(([id, item]) => format_date(item.borrow_date).includes(lowercase_query)),
		(items, lowercase_query) => items.filter(([id, item]) => `${item.times_extended}`.includes(lowercase_query)),
		(items, lowercase_query) => items.filter(([id, item]) => format_date(item.return_date).includes(lowercase_query))
	];

	const copy_transformer: CopyTransformer<BorrowListMappedItem> = (items) =>
		items
			.map(
				([id, item]) =>
					`${item.book_id + 1}\t${item.is_large ? 'V' : 'm'}\t${item.book_name}\t${item.reader_name}\t${item.reader_class}\t${format_date(item.borrow_date)}\t${item.times_extended}x\t${format_date(item.return_date)}`
			)
			.join('\n');

	$: items = $DATABASE.borrows.filter((v) => !v.permanent);

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

	const on_click_extend_book = async (borrow_index: number) => {
		const borrow = $DATABASE.borrows[borrow_index];
		borrow.times_extended += 1;

		const res = await put_request(`${window.origin}/api/v1/borrows/${borrow_index}`, borrow);

		if (res.ok) {
			const borrow_history = await res.json();
			DATABASE.update((v) => {
				v.borrows[borrow_index] = borrow;
				v.borrow_history[borrow.id] = borrow_history;

				return v;
			});

			list.close_options();
		}
	};

	const on_click_permanent_book = async (borrow_index: number) => {
		const borrow = $DATABASE.borrows[borrow_index];
		borrow.permanent = true;

		const res = await put_request(`${window.origin}/api/v1/borrows/${borrow_index}`, borrow);

		if (res.ok) {
			const borrow_history = await res.json();
			DATABASE.update((v) => {
				v.borrows[borrow_index] = borrow;
				v.borrow_history[borrow.id] = borrow_history;

				return v;
			});

			list.close_options();
		}
	};
</script>

<List
	bind:this={list}
	local_storage_key="borrow-list"
	headers={['Přír. č.', '', 'Název knihy', 'Čtenář', 'Třída', 'Půjčeno dne', 'Prodlouženo', 'Vrátit do']}
	{items}
	{item_mapper}
	{sorters}
	{filters}
	{copy_transformer}
>
	<Borrow slot="item" let:list_item {list_item} let:even {even} let:searched {searched} let:selected {selected}
	></Borrow>
	<svelte:fragment slot="options" let:item>
		<ListOption icon_type="book-return" on:click={() => on_click_return_book(item[0])}>Vrátit</ListOption>
		<ListOption icon_type="extend" on:click={() => on_click_extend_book(item[0])}>Prodloužit</ListOption>
		<ListOption icon_type="book-lock" on:click={() => on_click_permanent_book(item[0])}>Trvale</ListOption>
	</svelte:fragment>
</List>
