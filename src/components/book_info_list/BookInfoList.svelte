<script lang="ts">
	import { DATABASE } from '$client/database/database';
	import type { CopyTransformer, Filter, ListItem, Sorter } from '$client/list/list';
	import type { BookListMappedItem } from '$client/lists/book_list';
	import List from '$components/list/List.svelte';
	import { type Shorthand, type DatabaseBook } from '$shared/book_types';
	import { concat_authors, format_date, map_authors, map_date_or_null, map_or_null } from '$shared/book_util';
	import { date_compare, string_compare } from '$shared/common_util';
	import { onDestroy, onMount } from 'svelte';
	import ListOption from '$components/list/ListOption.svelte';
	import { CURRENTLY_EDITING_BOOK } from '$client/editors/book_editor';
	import type { ID } from '$shared/common_types';
	import { CURRENTLY_EDITING_BORROW } from '$client/editors/borrow_editor';
	import type { DatabaseReader } from '$shared/borrow_types';
	import { put_request } from '$client/request/request';
	import type { BookInfoListMappedItem } from '$client/lists/book_info_list';
	import BookInfo from './BookInfo.svelte';

	let list: List<DatabaseBook, BookInfoListMappedItem>;
	let current_items: ListItem<BookInfoListMappedItem>[] = [];

	const item_mapper = ({
		string_id,
		name,
		publisher,
		place_of_publishing,
		year_of_publishing,
		edition,
		page_count,
		literature_type,
		price,
		giver
	}: DatabaseBook): BookInfoListMappedItem => {
		return {
			string_id,
			name: map_or_null<string>($DATABASE, 'book_names', name),
			publisher: map_or_null<string>($DATABASE, 'publishers', publisher),
			place_of_publishing: map_or_null<string>($DATABASE, 'places_of_publishing', place_of_publishing),
			year_of_publishing,
			edition,
			page_count,
			literature_type: map_or_null<Shorthand>($DATABASE, 'literature_types', literature_type),
			price,
			giver: map_or_null<string>($DATABASE, 'givers', giver)
		};
	};

	const sorters: Sorter<BookInfoListMappedItem>[] = [
		([left_id, left_item], [right_id, right_item]) => left_id - right_id,
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.name, right_item.name),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.publisher, right_item.publisher),
		([left_id, left_item], [right_id, right_item]) =>
			string_compare(left_item.place_of_publishing, right_item.place_of_publishing),
		([left_id, left_item], [right_id, right_item]) =>
			string_compare(left_item.year_of_publishing, right_item.year_of_publishing),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.edition, right_item.edition),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.page_count, right_item.page_count),
		([left_id, left_item], [right_id, right_item]) =>
			string_compare(left_item.literature_type?.short_name, right_item.literature_type?.short_name),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.price, right_item.price),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.giver, right_item.giver)
	];

	const filters: Filter<BookInfoListMappedItem>[] = [
		(items, lowercase_query) => {
			if (list === undefined) return null;

			let found_index = items.findIndex(([id, item]) => item.string_id === lowercase_query);
			list.go_to_index(found_index === -1 ? undefined : found_index, true);

			return null;
		},
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.publisher ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.place_of_publishing ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.year_of_publishing ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.edition ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.page_count ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(
				([id, item]) =>
					(item.literature_type?.short_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query) ||
					(item.literature_type?.long_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)
			),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.price ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => (item.giver ?? '').toLocaleLowerCase('cs').includes(lowercase_query))
	];

	const copy_transformer: CopyTransformer<BookInfoListMappedItem> = (items) =>
		items
			.map(([id, item]) => {
				return `${item.string_id}\t${item.name ?? ''}\t${item.publisher ?? ''}\t${item.place_of_publishing ?? ''}\t${item.year_of_publishing ?? ''}\t${item.edition ?? ''}\t${item.page_count ?? ''}\t${item.literature_type?.short_name ?? ''}\t${item.price ?? ''}\t${item.giver ?? ''}`;
			})
			.join('\n');

	const on_click_edit_book = (book_id: number) => {
		$CURRENTLY_EDITING_BOOK = ['Upravit knihu', book_id as ID];
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
	headers={['Přír. č.', 'Název knihy', 'Naklad.', 'Místo', 'Rok', 'Číslo', 'Str.', 'Typ', 'Cena', 'Od']}
	items={$DATABASE.books}
	{item_mapper}
	{sorters}
	{filters}
	{copy_transformer}
>
	<BookInfo slot="item" let:list_item {list_item} let:even {even} let:searched {searched} let:selected {selected} />
	<svelte:fragment slot="options" let:item>
		<ListOption icon_type="book-edit" on:click={() => on_click_edit_book(item[0])}>Upravit</ListOption>
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
