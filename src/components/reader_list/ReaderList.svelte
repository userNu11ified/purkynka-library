<script lang="ts">
	import { DATABASE } from '$client/database/database';
	import { CURRENTLY_EDITING_READER } from '$client/editors/reader_editor';
	import type { CopyTransformer, Filter, ItemMapper, Sorter } from '$client/list/list';
	import type { ReaderListMappedItem } from '$client/lists/reader_list';
	import List from '$components/list/List.svelte';
	import ListAction from '$components/list/ListAction.svelte';
	import ListOption from '$components/list/ListOption.svelte';
	import ReaderEditor from '$components/reader_editor/ReaderEditor.svelte';
	import { map_or_null } from '$shared/book_util';
	import type { DatabaseReader } from '$shared/borrow_types';
	import { get_lowest_missing_id, string_compare } from '$shared/common_util';
	import Reader from './Reader.svelte';

	let list: List<DatabaseReader, ReaderListMappedItem>;

	const cancel = () => ($CURRENTLY_EDITING_READER = null);
	const on_click_add_reader = () => {
		$CURRENTLY_EDITING_READER = ['Přidat čtenáře', get_lowest_missing_id($DATABASE.readers)];
		list.close_options();
	};

	const on_click_edit_reader = (id: number) => {
		$CURRENTLY_EDITING_READER = ['Upravit čtenáře', id];
		list.close_options();
	};

	const item_mapper: ItemMapper<DatabaseReader, ReaderListMappedItem> = ({ id, name, class_name }) => {
		return {
			id,
			name,
			class_name: map_or_null<string>($DATABASE, 'reader_classes', class_name)!
		};
	};

	const sorters: Sorter<ReaderListMappedItem>[] = [
		([left_index, left_item], [right_index, right_item]) => left_item.id - right_item.id,
		([left_index, left_item], [right_index, right_item]) => string_compare(left_item.name, right_item.name),
		([left_index, left_item], [right_index, right_item]) => string_compare(left_item.class_name, right_item.class_name)
	];

	const filters: Filter<ReaderListMappedItem>[] = [
		(items, lowercase_query) => items.filter(([index, item]) => `${item.id}`.includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([index, item]) => item.name.toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([index, item]) => item.class_name.toLocaleLowerCase('cs').includes(lowercase_query))
	];

	const copy_transformer: CopyTransformer<ReaderListMappedItem> = (items) =>
		items.map(([index, item]) => `${item.id}\t${item.name}\t${item.class_name}`).join('\n');
</script>

{#if $CURRENTLY_EDITING_READER !== null}
	{#if $CURRENTLY_EDITING_READER[0] !== 'Vymazat čtenáře'}
		<ReaderEditor {cancel} submit={cancel} />
	{/if}
{/if}

<List
	bind:this={list}
	local_storage_key="reader-list"
	headers={['ID čtenáře', 'Jméno', 'Třída']}
	items={$DATABASE.readers}
	{item_mapper}
	{sorters}
	{filters}
	{copy_transformer}
>
	<Reader slot="item" let:list_item {list_item} let:even {even} let:searched {searched} let:selected {selected} />
	<svelte:fragment slot="options" let:item>
		<ListOption icon_type="edit" on:click={() => on_click_edit_reader(item[0])}>Upravit</ListOption>
		<ListOption icon_type="remove" red>Vymazat</ListOption>
	</svelte:fragment>
	<svelte:fragment slot="action-bar">
		<ListAction icon_type="plus" on:click={on_click_add_reader}>Přidat čtenáře</ListAction>
	</svelte:fragment>
</List>
