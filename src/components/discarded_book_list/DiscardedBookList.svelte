<script lang="ts">
	import { DATABASE } from '$client/database/database';
	import type { CopyTransformer, Filter, Sorter } from '$client/list/list';
	import type { DiscardedBookListMappedItem } from '$client/lists/discarded_book_list';
	import { put_request } from '$client/request/request';
	import List from '$components/list/List.svelte';
	import ListOption from '$components/list/ListOption.svelte';
	import type { DatabaseBook, Shorthand } from '$shared/book_types';
	import { concat_authors, format_date, map_authors, map_or_null } from '$shared/book_util';
	import { date_compare, string_compare } from '$shared/common_util';
	import DiscardedBook from './DiscardedBook.svelte';

	let list: List<DatabaseBook, DiscardedBookListMappedItem>;

	const item_mapper = ({
		string_id,
		is_large,
		name,
		author,
		discard_date,
		price,
		literature_type,
		discard_reason,
		discard_document
	}: DatabaseBook): DiscardedBookListMappedItem => {
		return {
			string_id,
			is_large,
			book_name: map_or_null<string>($DATABASE, 'book_names', name)!,
			book_author: concat_authors(map_authors($DATABASE, author)),
			discard_date: new Date(discard_date!),
			price,
			literature_type: map_or_null<Shorthand>($DATABASE, 'literature_types', literature_type),
			discard_reason: map_or_null<string>($DATABASE, 'discard_reasons', discard_reason),
			discard_document
		};
	};

	const sorters: Sorter<DiscardedBookListMappedItem>[] = [
		([left_id, left_item], [right_id, right_item]) => +left_item.string_id - +right_item.string_id,
		([left_id, left_item], [right_id, right_item]) => +left_item.is_large - +right_item.is_large,
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.book_name, right_item.book_name),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.book_author, right_item.book_author),
		([left_id, left_item], [right_id, right_item]) => date_compare(left_item.discard_date, right_item.discard_date),
		([left_id, left_item], [right_id, right_item]) => +(left_item.price ?? 0) - +(right_item.price ?? 0),
		([left_id, left_item], [right_id, right_item]) => {
			if (left_item.literature_type === null || right_item.literature_type === null)
				return +(left_item.literature_type === null) - +(right_item.literature_type === null);

			const left_literature_type_id = $DATABASE.literature_types.findIndex(
				(v) =>
					v.short_name === left_item.literature_type!.short_name && v.long_name === left_item.literature_type!.long_name
			);
			const right_literature_type_id = $DATABASE.literature_types.findIndex(
				(v) =>
					v.short_name === right_item.literature_type!.short_name &&
					v.long_name === right_item.literature_type!.long_name
			);

			return left_literature_type_id - right_literature_type_id;
		},
		([left_id, left_item], [right_id, right_item]) =>
			string_compare(left_item.discard_reason, right_item.discard_reason),
		([left_id, left_item], [right_id, right_item]) =>
			string_compare(left_item.discard_document, right_item.discard_document)
	];

	const filters: Filter<DiscardedBookListMappedItem>[] = [
		(items, lowercase_query) => {
			if (list === undefined) return null;

			let found_index = items.findIndex(([id, item]) => item.string_id === lowercase_query);
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
			items.filter(([id, item]) => (item.book_author ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) => items.filter(([id, item]) => format_date(item.discard_date).includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.price ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(
				([id, item]) =>
					(item.literature_type?.short_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query) ||
					(item.literature_type?.long_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)
			),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.discard_reason ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.discard_document ?? '').toLocaleLowerCase('cs').includes(lowercase_query))
	];

	const copy_transformer: CopyTransformer<DiscardedBookListMappedItem> = (items) =>
		items
			.map(
				([id, item]) =>
					`${item.string_id}\t${item.is_large ? 'V' : 'm'}\t${item.book_name}\t${item.book_author}\t${format_date(item.discard_date)}\t${item.price ?? ''}\t${item.literature_type?.short_name ?? ''}\t${item.discard_reason ?? ''}\t${item.discard_document ?? ''}`
			)
			.join('\n');

	$: items = $DATABASE.books.filter((v) => v.discard_date !== null);

	const on_click_return_book = async (book_string_id: string) => {
		const book_index = $DATABASE.books.findIndex((v) => v.string_id === book_string_id);
		const book = $DATABASE.books[book_index];
		book.discard_date = null;
		book.discard_document = null;
		book.discard_reason = null;

		const res = await put_request(`${window.origin}/api/v1/books/${book_index}`, book);

		if (res.ok) {
			DATABASE.update((v) => {
				v.books[book_index] = book;
				return v;
			});
		}
	};
</script>

<List
	bind:this={list}
	local_storage_key="discarded-books-list"
	headers={['Přír. č.', '', 'Název knihy', 'Autor', 'Datum odpisu', 'Cena', 'Literatura', 'Důvod', 'Doklad odpisu']}
	{items}
	{item_mapper}
	{sorters}
	{filters}
	{copy_transformer}
>
	<DiscardedBook slot="item" let:list_item {list_item} let:even {even} let:searched {searched} let:selected {selected}
	></DiscardedBook>
	<svelte:fragment slot="options" let:item>
		<ListOption icon_type="book-return-discard" on:click={() => on_click_return_book(item[1].string_id)}
			>Vrátit</ListOption
		>
	</svelte:fragment>
</List>
