<script lang="ts">
	import '$style/app.css';
	import '$style/theme.css';

	import type { CopyTransformer, Filter, Sorter } from '$client/list/list';
	import type { StudentBookListMappedItem } from '$client/lists/student_book_list';
	import { INFO_OPENED, UDC_LIST_OPENED, STUDENT_DATABASE, LIST_SORT_BY_UDC } from '$client/student/student';
	import { pixels } from '$client/style/css';
	import {
		DARK_THEME,
		BORDER_WIDTH,
		FONT_SIZE_REGULAR,
		FONT_SIZE_LARGE,
		FONT_SIZE_HUGE,
		FONT_SIZE_MASSIVE,
		SIDEBAR_CLOSED_WIDTH,
		SIDEBAR_OPENED_WIDTH,
		SCROLLBAR_WIDTH
	} from '$client/style/theme';
	import List from '$components/list/List.svelte';
	import ListAction from '$components/list/ListAction.svelte';
	import StudentBook from '$components/student_book_list/StudentBook.svelte';
	import type { DatabaseBook, Shorthand } from '$shared/book_types';
	import { concat_authors, format_date, map_authors, map_or_null } from '$shared/book_util';
	import { date_compare, string_compare } from '$shared/common_util';
	import type { Database } from '$shared/database_types';
	import { get_return_date } from '$shared/borrow_util';
	import StudentInfo from '$components/student_info/StudentInfo.svelte';
	import StudentUdcList from '$components/student_udc_list/StudentUDCList.svelte';
	import { onMount } from 'svelte';
	import {
		get_endpoint_reload,
		load_student,
		STUDENT_CURRENT_STEP,
		STUDENT_TOTAL_STEPS
	} from '$client/student_loading_screen/student_loading_screen';
	import LoadingScreen from '$components/loading_screen/LoadingScreen.svelte';

	export let data;
	const { book_count, borrow_count } = data;

	let list: List<DatabaseBook, StudentBookListMappedItem>;

	const item_mapper = (
		{ string_id, is_large, name, author, udc, annotation }: DatabaseBook,
		index: number
	): StudentBookListMappedItem => {
		const book_id = index;

		const borrow = $STUDENT_DATABASE.borrows.find((v) => v.book === book_id);
		const borrow_date = borrow ? get_return_date(new Date(borrow.borrow_date), borrow.times_extended) : null;
		const permanent = borrow ? borrow.permanent : false;

		return {
			return_date: borrow_date,
			permanent,
			book_id: string_id,
			is_large,
			book_name: map_or_null<string>($STUDENT_DATABASE as Database, 'book_names', name)!,
			book_author: concat_authors(map_authors($STUDENT_DATABASE as Database, author)),
			book_udc: structuredClone(map_or_null<Shorthand>($STUDENT_DATABASE as Database, 'udc', udc)),
			annotation
		};
	};

	const sorters: Sorter<StudentBookListMappedItem>[] = [
		([left_id, left_item], [right_id, right_item]) => {
			if (left_item.return_date === null || right_item.return_date === null)
				return +(left_item.return_date === null) - +(right_item.return_date === null);
			if (left_item.permanent || right_item.permanent) return +left_item.permanent - +right_item.permanent;
			return date_compare(left_item.return_date, right_item.return_date);
		},
		([left_id, left_item], [right_id, right_item]) => +left_item.book_id - +right_item.book_id,
		([left_id, left_item], [right_id, right_item]) => +left_item.is_large - +right_item.is_large,
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.book_name, right_item.book_name),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.book_author, right_item.book_author),
		([left_id, left_item], [right_id, right_item]) =>
			string_compare(left_item.book_udc?.short_name, right_item.book_udc?.short_name),
		([left_id, left_item], [right_id, right_item]) =>
			+(left_item.annotation !== null) - +(right_item.annotation !== null)
	];

	const filters: Filter<StudentBookListMappedItem>[] = [
		(items, lowercase_query) =>
			items.filter(
				([id, item]) =>
					(item.permanent && lowercase_query === 'trvale') ||
					(item.return_date === null && lowercase_query === 'volné') ||
					(!item.permanent && item.return_date && format_date(item.return_date!).includes(lowercase_query))
			),
		(items, lowercase_query) => {
			if (list === undefined) return null;

			let found_index = items.findIndex(([id, item]) => item.book_id === lowercase_query);
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
			items.filter(([id, item]) => (item.book_author ?? '').toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(
				([id, item]) =>
					(item.book_udc?.short_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query) ||
					(item.book_udc?.long_name ?? '').toLocaleLowerCase('cs').includes(lowercase_query)
			),
		(items, lowercase_query) =>
			items.filter(([id, item]) => item.annotation?.toLocaleLowerCase('cs').includes(lowercase_query))
	];

	const copy_transformer: CopyTransformer<StudentBookListMappedItem> = (items) =>
		items
			.map(
				([id, item]) =>
					`${item.permanent ? 'Trvale' : item.return_date ? format_date(item.return_date) : 'Volné'}\t${item.book_id}\t${item.is_large ? 'V' : 'm'}\t${item.book_name}\t${item.annotation}\t${item.book_udc?.short_name ?? ''}\t${item.annotation}`
			)
			.join('\n');

	const on_click_info = () => ($INFO_OPENED = true);
	const on_click_udc_list = () => ($UDC_LIST_OPENED = true);
	const on_click_theme_switcher = () => ($DARK_THEME = !$DARK_THEME);

	const subscribe_to_updates = () => {
		const event = new EventSource(`${window.origin}/api/v1/event/database-update`);
		event.onmessage = async () => await load_student(get_endpoint_reload);
		return () => event.close();
	};

	LIST_SORT_BY_UDC.subscribe((v) => {
		if (v !== null) list.set_search(v!, 5);
	});

	onMount(() => {
		subscribe_to_updates();
		$INFO_OPENED = true;

		setInterval(
			() => {
				if (list === undefined) return;

				list.reset_search_bars();
				list.reset_sorted_by();
				list.reset_selected();

				$UDC_LIST_OPENED = false;
			},
			2 * 60 * 1000
		);
	});
</script>

<svelte:head>
	<title>Knihovna - Čtenáři</title>
	{#if $DARK_THEME}
		<link rel="icon" href="../favicon-dark.svg" />
	{:else}
		<link rel="icon" href="../favicon-light.svg" />
	{/if}
</svelte:head>

<div
	class="app-mount"
	style:--border-width={pixels(BORDER_WIDTH)}
	style:--font-size-regular={FONT_SIZE_REGULAR}
	style:--font-size-large={FONT_SIZE_LARGE}
	style:--font-size-huge={FONT_SIZE_HUGE}
	style:--font-size-massive={FONT_SIZE_MASSIVE}
	style:--sidebar-closed-width={pixels(SIDEBAR_CLOSED_WIDTH)}
	style:--sidebar-opened-width={pixels(SIDEBAR_OPENED_WIDTH)}
	style:--scrollbar-width={pixels(SCROLLBAR_WIDTH)}
	class:dark-theme={$DARK_THEME}
	class:light-theme={!$DARK_THEME}
>
	{#await load_student()}
		<LoadingScreen
			current_step={$STUDENT_CURRENT_STEP}
			total_steps={STUDENT_TOTAL_STEPS}
			is_student
			{book_count}
			{borrow_count}
		></LoadingScreen>
	{:then}
		{#if $INFO_OPENED}
			<StudentInfo></StudentInfo>
		{:else if $UDC_LIST_OPENED}
			<StudentUdcList></StudentUdcList>
		{/if}

		<List
			bind:this={list}
			local_storage_key="student-list"
			fractions={[1, 1, 1, 4, 3, 1, 2]}
			default_sorted_by={[1, true]}
			headers={['Půjčeno', 'Přír. č.', '', 'Název knihy', 'Autor', 'MDT', 'Anotace']}
			placeholders={[null, null, null, 'Zde zadejte název knihy', 'Zde zadejte autora', null, null]}
			items={$STUDENT_DATABASE.books}
			{item_mapper}
			{sorters}
			{filters}
			{copy_transformer}
			has_options={false}
			has_sidebar={false}
			sync_searched_by_to_local_storage={false}
			sync_sorted_by_to_local_storage={false}
		>
			<StudentBook slot="item" let:list_item {list_item} let:even {even} let:searched {searched} let:selected {selected}
			></StudentBook>
			<svelte:fragment slot="action-bar">
				<ListAction icon_type="info" on:click={on_click_info}>Informace</ListAction>
				<div class="divider"></div>
				<ListAction icon_type="list" on:click={on_click_udc_list}>Seznam MDT</ListAction>
				<div class="divider"></div>
				<ListAction
					icon_type={$DARK_THEME ? 'dark-theme' : 'light-theme'}
					icon_size={26}
					on:click={on_click_theme_switcher}
				></ListAction>
			</svelte:fragment>
		</List>
	{/await}
</div>

<style>
	.app-mount {
		--scrollbar-thumb-color: var(--border-color);

		position: absolute;
		inset: 0;

		transition: var(--variable-transitions);
	}

	.divider {
		height: 50%;
		width: 4px;

		margin-inline: 16px;
		border-radius: var(--border-radius-regular);

		background-color: var(--border-color);
	}
</style>
