<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { clientLogger } from '$client/client_loggers';
	import { stringFilter } from '$client/collation/filters';
	import {
		numberSorter,
		stringSorter
	} from '$client/components/table_view/logic/table_view_sorters';
	import TableViewSelectAction from '$client/components/table_view/selection/TableViewSelectAction.svelte';
	import TableView from '$client/components/table_view/TableView.svelte';
	import { createPageUsed } from '$client/page_used';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { Result } from '$shared/types/result';
	import { onMount } from 'svelte';

	let tableView: TableView<any, any> | undefined = $state();

	const librarianData = LibrarianData.context.get();
	const udc = $derived(librarianData.udc.getArray());
	const books = $derived(librarianData.books.getArray());
	const usedLiteratureTypeIds = $derived(new Set(books.map((v) => v.udcId)));

	const onEditClick = (udcId: number) => {
		tableView?.clearSelection();
		pushState('', {
			shorthandEditorState: { type: 'udc', id: udcId }
		});
	};

	const onDeleteClick = async (udcId: number) => {
		tableView?.clearSelection();

		const deleteResult = await librarianData.udc.delete([udcId]);
		if (Result.isError(deleteResult)) {
			clientLogger.fatal('Failed to delete!', { error: deleteResult.value });
			throw new Error();
		}
	};

	onMount(() => (createPageUsed('other').current = page.route.id));
</script>

<TableView
	renderAfterResolved={librarianData.loaded}
	items={udc}
	itemMapper={(v) => v}
	itemCopier={({ id, shortName, longName }) => [id, shortName, longName]}
	columns={[
		{
			columnName: 'ID',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.id },
			columnSorter: (l, r) => numberSorter(l.id, r.id),
			columnSearcher: {
				type: 'jumper',
				jumper: (mappedItems, q) => {
					const queryAsNumber = parseInt(q.lowercaseQuery);
					if (Number.isNaN(queryAsNumber)) return null;

					const foundIndex = mappedItems.findIndex(([v]) => v.id === queryAsNumber);
					return foundIndex === -1 ? null : foundIndex;
				}
			}
		},
		{
			columnName: 'Short Name',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.shortName },
			columnSorter: (l, r) => stringSorter(l.shortName, r.shortName),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.shortName, q) }
		},
		{
			columnName: 'Long Name',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.longName },
			columnSorter: (l, r) => stringSorter(l.longName, r.longName),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.longName, q) }
		}
	]}
>
	{#snippet singleSelectActions(selectedItem)}
		<TableViewSelectAction iconType="edit" onClick={() => onEditClick(selectedItem[0].id)}
			>Edit</TableViewSelectAction
		>

		<TableViewSelectAction
			iconType="trash-can"
			color="error"
			disabled={usedLiteratureTypeIds.has(selectedItem[0].id)}
			onClick={() => onDeleteClick(selectedItem[0].id)}
		>
			{#if usedLiteratureTypeIds.has(selectedItem[0].id)}
				This item is used somewhere!
			{:else}
				Delete
			{/if}
		</TableViewSelectAction>
	{/snippet}
</TableView>
