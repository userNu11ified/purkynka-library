<script lang="ts">
	import { DATABASE } from '$client/database/database';
	import { CURRENTLY_EDITING_UDC } from '$client/editors/udc_editor';
	import type { CopyTransformer, Filter, Sorter } from '$client/list/list';
	import List from '$components/list/List.svelte';
	import ListAction from '$components/list/ListAction.svelte';
	import ListOption from '$components/list/ListOption.svelte';
	import UdcEditor from '$components/udc_editor/UDCEditor.svelte';
	import type { Shorthand } from '$shared/book_types';
	import { string_compare } from '$shared/common_util';
	import Udc from './UDC.svelte';

	let list: List<Shorthand, Shorthand>;

	const sorters: Sorter<Shorthand>[] = [
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.short_name, right_item.short_name),
		([left_id, left_item], [right_id, right_item]) => string_compare(left_item.long_name, right_item.long_name)
	];

	const filters: Filter<Shorthand>[] = [
		(items, lowercase_query) =>
			items.filter(([id, item]) => item.short_name.toLocaleLowerCase('cs').includes(lowercase_query)),
		(items, lowercase_query) =>
			items.filter(([id, item]) => item.long_name.toLocaleLowerCase('cs').includes(lowercase_query))
	];

	const copy_transformer: CopyTransformer<Shorthand> = (items) =>
		items.map(([id, item]) => `${item.short_name}\t${item.long_name}`).join('\n');

	const on_click_add_udc = () => {
		$CURRENTLY_EDITING_UDC = ['Přidat MDT', null];
		list.close_options();
	};

	const on_click_edit_udc = (udc_index: number) => {
		$CURRENTLY_EDITING_UDC = ['Upravit MDT', udc_index];
		list.close_options();
	};

	const cancel = () => ($CURRENTLY_EDITING_UDC = null);
	const submit = () => ($CURRENTLY_EDITING_UDC = null);
</script>

{#if $CURRENTLY_EDITING_UDC !== null}
	<UdcEditor {cancel} {submit}></UdcEditor>
{/if}

<List
	bind:this={list}
	local_storage_key="udc-list"
	headers={['Zkratka', 'Celé jméno']}
	items={$DATABASE.udc}
	item_mapper={(item) => item}
	{sorters}
	{filters}
	{copy_transformer}
>
	<Udc slot="item" let:list_item {list_item} let:even {even} let:searched {searched} let:selected {selected}></Udc>
	<svelte:fragment slot="options" let:item>
		<ListOption icon_type="edit" on:click={() => on_click_edit_udc(item[0])}>Upravit</ListOption>
	</svelte:fragment>
	<svelte:fragment slot="action-bar">
		<ListAction icon_type="plus" on:click={on_click_add_udc}>Přidat MDT</ListAction>
	</svelte:fragment>
</List>
