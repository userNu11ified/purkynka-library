<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { clientLogger } from '$client/client_loggers';
	import { stringFilter } from '$client/collation/filters';
	import { mergeEditorSubmitCallbacks } from '$client/components/editors/MergeEditor.svelte';
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
	const authorNames = $derived(librarianData.authorNames.getArray());
	const authorToBookByAuthorIdMap = $derived(librarianData.authorToBook.getByAuthorIdMap());
	const authorToBookAuthorIdKeys = $derived(authorToBookByAuthorIdMap.keys().toArray());

	const onEditClick = (authorNameId: number) => {
		tableView?.clearSelection();
		pushState('', { lookupEditorState: { type: 'authorName', id: authorNameId } });
	};

	const onDeleteClick = async (authorNameId: number) => {
		tableView?.clearSelection();

		const deleteResult = await librarianData.authorNames.delete([authorNameId]);
		if (Result.isError(deleteResult)) {
			clientLogger.fatal('Failed to delete!', { error: deleteResult.value });
			throw new Error();
		}
	};

	const onMergeClick = (authorNameValues: [string, number][]) => {
		tableView?.clearSelection();
		pushState('', { mergeEditorState: { values: authorNameValues } });
	};

	mergeEditorSubmitCallbacks.registerCallback(async ([selectedIndex, mergedIndices]) => {
		const updateTo = authorNames[selectedIndex].id;
		const toUpdate = mergedIndices
			.filter((v) => v !== selectedIndex)
			.map((index) => authorNames[index].id);

		const authorToBookDeleteResult = await librarianData.authorToBook.delete({
			deleteBy: 'authorId',
			ids: toUpdate
		});
		if (Result.isError(authorToBookDeleteResult)) {
			clientLogger.fatal('Failed to delete after merge!', {
				error: authorToBookDeleteResult.value
			});
			throw new Error();
		}

		const authorNamesDeleteResult = await librarianData.authorNames.delete(toUpdate);
		if (Result.isError(authorNamesDeleteResult)) {
			clientLogger.fatal('Failed to delete after merge!', {
				error: authorNamesDeleteResult.value
			});
			throw new Error();
		}

		const deletedAuthorToBooks = authorToBookDeleteResult.value;
		if (deletedAuthorToBooks.length === 0) return;

		const newAuthorToBooks = deletedAuthorToBooks.map((v) => ({
			bookId: v.bookId,
			authorId: updateTo
		}));
		const postResult = await librarianData.authorToBook.post(newAuthorToBooks);
		if (Result.isError(postResult)) {
			clientLogger.fatal('Failed to post after merge!', { error: postResult.value });
			throw new Error();
		}
	});

	onMount(() => (createPageUsed('other').current = page.route.id));
</script>

<TableView
	bind:this={tableView}
	renderAfterResolved={librarianData.loaded}
	persistentStateId="other-author-names"
	items={authorNames}
	itemMapper={({ id, value }) => ({ id, value })}
	itemCopier={({ id, value }) => [id, value]}
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
			columnName: 'Jméno autora',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.value },
			columnSorter: (l, r) => stringSorter(l.value, r.value),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.value, q) }
		}
	]}
>
	{#snippet singleSelectActions(selectedItem)}
		<TableViewSelectAction iconType="edit" onClick={() => onEditClick(selectedItem[0].id)}>
			Upravit
		</TableViewSelectAction>
		<TableViewSelectAction
			iconType="trash-can"
			color="error"
			disabled={authorToBookAuthorIdKeys.includes(selectedItem[0].id)}
			onClick={() => onDeleteClick(selectedItem[0].id)}
		>
			{#if authorToBookAuthorIdKeys.includes(selectedItem[0].id)}
				Někde použito!
			{:else}
				Vymazat
			{/if}
		</TableViewSelectAction>
	{/snippet}

	{#snippet multiSelectActions(selectedItems)}
		<TableViewSelectAction
			iconType="merge"
			onClick={() => onMergeClick(selectedItems.map(([v, i]) => [v.value, i]))}
		>
			Spojit
		</TableViewSelectAction>
	{/snippet}
</TableView>
