<script lang="ts">
	import { DATABASE } from '$client/database/database';
	import type { CopyTransformer, Filter, ListItem, Sorter } from '$client/list/list';
	import type { BookListMappedItem } from '$client/lists/book_list';
	import List from '$components/list/List.svelte';
	import { type Shorthand, type DatabaseBook } from '$shared/book_types';
	import { concat_authors, format_date, map_authors, map_date_or_null, map_or_null } from '$shared/book_util';
	import { date_compare, string_compare } from '$shared/common_util';
	import { onDestroy, onMount } from 'svelte';
	import Book from './Book.svelte';
	import ListOption from '$components/list/ListOption.svelte';
	import { CURRENTLY_EDITING_BOOK } from '$client/editors/book_editor';
	import type { ID } from '$shared/common_types';
	import { CURRENTLY_EDITING_BORROW } from '$client/editors/borrow_editor';
	import type { DatabaseReader } from '$shared/borrow_types';
	import { put_request } from '$client/request/request';

	let list: List<DatabaseBook, BookListMappedItem>;
	let current_items: ListItem<BookListMappedItem>[] = [];

	const item_mapper = ({
		string_id,
		is_large,
		name,
		author,
		udc,
		discard_date,
		annotation
	}: DatabaseBook): BookListMappedItem => {
		const borrow = $DATABASE.borrows.find((v) => v.book === +string_id - 1);
		const reader = borrow ? $DATABASE.readers.find((v) => v.id === borrow.reader) : null;
		const class_name = reader ? map_or_null<string>($DATABASE, 'reader_classes', reader.class_name) : null;

		return {
			string_id,
			is_large,
			name: map_or_null<string>($DATABASE, 'book_names', name),
			author: concat_authors(map_authors($DATABASE, author)),
			udc: map_or_null<Shorthand>($DATABASE, 'udc', udc),
			borrowed_to_class: class_name,
			borrowed_to_name: reader?.name ?? null,
			discard_date: map_date_or_null(discard_date),
			annotation
		};
	};

	const sorters: Sorter<BookListMappedItem>[] = [
		([left_id, left_item], [right_id, right_item]) => left_id - right_id,
		([left_id, left_item], [right_id, right_item]) => +left_item.is_large - +right_item.is_large,
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.name, right_item.name),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.author, right_item.author),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.annotation, right_item.annotation),
		([left_id, left_item], [right_id, right_item]) =>
			string_compare(left_item.udc?.short_name, right_item.udc?.short_name),
		([left_id, left_item], [right_id, right_item]) =>
			string_compare(left_item.borrowed_to_class, right_item.borrowed_to_class),
		([left_id, left_item], [right_id, right_item]) => date_compare(left_item.discard_date, right_item.discard_date)
	];

	const filters: Filter<BookListMappedItem>[] = [
		(items, lowercase_query) => {
			if (list === undefined) return null;

			let found_index = items.findIndex(([id, item]) => item.string_id === lowercase_query);
			list.go_to_index(found_index === -1 ? undefined : found_index, true);

			return null;
		},
		(items, lowercase_query) =>
			items.filter(
				([id, item]) => (item.is_large && lowercase_query === 'v') || (!item.is_large && lowercase_query === 'm')
			),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.author ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.annotation ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(
				([id, item]) =>
					(item.udc?.short_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query) ||
					(item.udc?.long_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)
			),
		(items, lowercase_query) =>
			items.filter(([id, item]) =>
				item.borrowed_to_class ? item.borrowed_to_class.toLocaleLowerCase('cs').includes(lowercase_query) : false
			),
		(items, lowercase_query) =>
			items.filter(([id, item]) => item.discard_date && format_date(item.discard_date).includes(lowercase_query))
	];

	const copy_transformer: CopyTransformer<BookListMappedItem> = (items) =>
		items
			.map(([id, item]) => {
				const borrow = $DATABASE.borrows.find((v) => v.book === id);
				const reader = borrow ? $DATABASE.readers.find((v) => v.id === borrow.reader) : null;
				const class_name = reader ? map_or_null<string>($DATABASE, 'reader_classes', reader.class_name) : null;

				return `${item.string_id}\t${item.is_large ? 'V' : 'm'}\t${item.name ?? ''}\t${item.author}\t${item.annotation ? item.annotation : ''}\t${item.udc?.short_name ?? ''}\t${class_name ? class_name : ''}\t${item.discard_date ? format_date(item.discard_date) : ''}`;
			})
			.join('\n');

	const on_click_edit_book = (book_id: number) => {
		$CURRENTLY_EDITING_BOOK = ['Upravit knihu', book_id as ID];
		list.close_options();
	};

	const on_click_borrow_book = (book_id: number) => {
		$CURRENTLY_EDITING_BORROW = ['Půjčit knihu', book_id];
		list.close_options();
	};

	const on_click_return_book = async (book_id: number) => {
		const borrow_index = $DATABASE.borrows.findIndex((v) => v.book === book_id);
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

			list.close_options();
		}
	};

	const on_click_discard_book = (book_id: number) => {
		$CURRENTLY_EDITING_BOOK = ['Vyřadit knihu', book_id as ID];
		list.close_options();
	};

	const on_click_cancel_discard_book = (book_id: number) => {
		$CURRENTLY_EDITING_BOOK = ['Zrušit vyřazení knihy', book_id as ID];
		list.close_options();
	};

	const on_click_add_again_book = (book_id: number) => {
		$CURRENTLY_EDITING_BOOK = ['Vytvořit knihu', book_id as ID];
		list.close_options();
	};

	onMount(() => {
		list.refresh_items();
	});
</script>

<List
	bind:this={list}
	bind:current_items
	local_storage_key="book-list"
	headers={['Přír. č.', '', 'Název knihy', 'Autor', 'Anotace', 'MDT', 'Půjčeno', 'Vyřazeno']}
	items={$DATABASE.books}
	{item_mapper}
	{sorters}
	{filters}
	{copy_transformer}
>
	<Book slot="item" let:list_item {list_item} let:even {even} let:searched {searched} let:selected {selected} />
	<svelte:fragment slot="options" let:item>
		{#if item[1].borrowed_to_class !== null}
			<ListOption icon_type="book-return" on:click={() => on_click_return_book(item[0])}>Vrátit</ListOption>
		{:else}
			<ListOption icon_type="book-borrow" on:click={() => on_click_borrow_book(item[0])}>Půjčit</ListOption>
		{/if}
		<ListOption icon_type="book-edit" on:click={() => on_click_edit_book(item[0])}>Upravit</ListOption>
		{#if item[1].discard_date !== null}
			<ListOption icon_type="book-return-discard" on:click={() => on_click_cancel_discard_book(item[0])}>
				Zrušit vyřazení
			</ListOption>
		{:else}
			<ListOption icon_type="book-discard" on:click={() => on_click_discard_book(item[0])} red>Vyřadit</ListOption>
		{/if}
		<ListOption icon_type="book-add" on:click={() => on_click_add_again_book(item[0])}>Přidat znovu</ListOption>
	</svelte:fragment>

	<svelte:fragment slot="action-bar">
		<div class="book-count">
			<div class="text">Počet knih</div>
			<div class="info">
				<div class="part">{current_items.length}</div>
				<div class="part">/</div>
				<div class="part">{$DATABASE.books.length}</div>
			</div>
			<div class="border"></div>
		</div>
	</svelte:fragment>
</List>

<style>
	.book-count {
		position: relative;

		display: grid;
		grid-template-rows: 1fr 1fr;

		color: var(--text-color);
		text-align: center;
	}

	.text {
		font-weight: bold;
	}

	.info {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}

	.border {
		position: absolute;
		left: -24px;
		right: -24px;
		top: 25%;
		bottom: 25%;

		border-right: var(--border);
		border-left: var(--border);
	}
</style>
