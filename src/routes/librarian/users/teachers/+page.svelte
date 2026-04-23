<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { stringFilter } from '$client/collation/filters';
	import {
		dateSorter,
		numberSorter,
		stringSorter
	} from '$client/components/table_view/logic/table_view_sorters';
	import TableViewSelectAction from '$client/components/table_view/selection/TableViewSelectAction.svelte';
	import TableView from '$client/components/table_view/TableView.svelte';
	import { createPageUsed } from '$client/page_used';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { formatDateOrNull } from '$shared/types/util';
	import { onMount } from 'svelte';

	const librarianData = LibrarianData.context.get();
	const students = $derived(librarianData.readers.getArray().filter((v) => v.readerType === 'T'));

	const onEditClick = (userId: number) =>
		pushState('', {
			userEditorState: { type: 'edit', userId }
		});

	onMount(() => (createPageUsed('users').current = page.route.id));
</script>

<TableView
	renderAfterResolved={librarianData.loaded}
	persistentStateId="teachers-column-sizes"
	items={students}
	itemMapper={({ id, readerName, readerClassId, createdOn, updatedOn }) => {
		const readerClass = librarianData.readerClasses.getValueByIdOrNull(readerClassId)!;

		const createdOnString = formatDateOrNull(createdOn)!;
		const updatedOnString = formatDateOrNull(updatedOn)!;

		return {
			id,
			readerName,
			readerClass: readerClass.value ?? '',
			createdOn,
			createdOnString,
			createdOnCompactString: createdOnString.replaceAll(' ', ''),
			updatedOn,
			updatedOnString,
			updatedOnCompactString: updatedOnString.replaceAll(' ', '')
		};
	}}
	itemCopier={({ id, readerName, readerClass, createdOnString, updatedOnString }) => [
		id,
		readerName,
		readerClass,
		createdOnString,
		updatedOnString
	]}
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
			columnName: 'Teacher Name',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.readerName },
			columnSorter: (l, r) => stringSorter(l.readerName, r.readerName),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.readerName, q) }
		},
		{
			columnName: 'Teacher Shortname',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.readerClass },
			columnSorter: (l, r) => stringSorter(l.readerClass, r.readerClass),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.readerClass, q) }
		},
		{
			columnName: 'Created',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.createdOnString },
			columnSorter: (l, r) => dateSorter(l.createdOn, r.createdOn),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) =>
					stringFilter(v.createdOnString, q) || stringFilter(v.createdOnCompactString, q)
			}
		},
		{
			columnName: 'Last Updated',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.updatedOnString },
			columnSorter: (l, r) => dateSorter(l.updatedOn, r.updatedOn),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) =>
					stringFilter(v.updatedOnString, q) || stringFilter(v.updatedOnCompactString, q)
			}
		}
	]}
>
	{#snippet singleSelectActions(selectedItem)}
		<TableViewSelectAction iconType="edit" onClick={() => onEditClick(selectedItem[0].id)}
			>Edit</TableViewSelectAction
		>
	{/snippet}
</TableView>
