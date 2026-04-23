<script lang="ts">
	import { page } from '$app/state';
	import { clientLogger } from '$client/client_loggers';
	import { stringFilter } from '$client/collation/filters';
	import {
		booleanSorter,
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

	const onPasswordResetClick = async (librarianId: number) => {
		const librarianPatchResult = await librarianData.librarians.patch({
			ids: [librarianId],
			newValue: { password: null }
		});
		if (Result.isError(librarianPatchResult)) {
			clientLogger.fatal('Failed to PATCH librarian!', { error: librarianPatchResult.value });
			throw new Error();
		}
	};

	const onDeleteClick = async (librarianId: number) => {
		tableView?.clearSelection();

		const librarianDeleteResult = await librarianData.librarians.delete([librarianId]);
		if (Result.isError(librarianDeleteResult)) {
			clientLogger.fatal('Failed to DELETE librarian!', { error: librarianDeleteResult.value });
			throw new Error();
		}
	};

	onMount(() => (createPageUsed('users').current = page.route.id));
</script>

<TableView
	renderAfterResolved={librarianData.loaded}
	items={librarianData.librarians.getArray()}
	itemMapper={({ id, email, password }) => ({ id, email, finishedRegistering: password !== null })}
	itemCopier={({ id, email, finishedRegistering }) => [
		id,
		email,
		finishedRegistering ? 'Yes' : 'No'
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
			columnName: 'Email',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.email },
			columnSorter: (l, r) => stringSorter(l.email, r.email),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.email, q) }
		},
		{
			columnName: 'Finished Registering',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => (v.finishedRegistering ? 'Yes' : 'No') },
			columnSorter: (l, r) => booleanSorter(l.finishedRegistering, r.finishedRegistering),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) =>
					stringFilter(v.finishedRegistering ? 'Y' : 'N', q) ||
					stringFilter(v.finishedRegistering ? 'Yes' : 'No', q)
			}
		}
	]}
>
	{#snippet singleSelectActions(selectedItem)}
		<TableViewSelectAction
			iconType="password-reset"
			onClick={() => onPasswordResetClick(selectedItem[0].id)}>Reset Password</TableViewSelectAction
		>
		<TableViewSelectAction
			iconType="trash-can"
			color="error"
			disabled={selectedItem[0].email === 'Admin'}
			onClick={() => onDeleteClick(selectedItem[0].id)}>Delete</TableViewSelectAction
		>
	{/snippet}
</TableView>
