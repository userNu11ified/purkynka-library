<script lang="ts">
	import { pushState } from '$app/navigation';
	import { clientLogger } from '$client/client_loggers';
	import { stringFilter } from '$client/collation/filters';
	import { mergeEditorSubmitCallbacks } from '$client/components/editors/MergeEditor.svelte';
	import {
		numberSorter,
		stringSorter
	} from '$client/components/table_view/logic/table_view_sorters';
	import TableViewSelectAction from '$client/components/table_view/selection/TableViewSelectAction.svelte';
	import TableView from '$client/components/table_view/TableView.svelte';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { Result } from '$shared/types/result';

	let tableView: TableView<any, any> | undefined = $state();

	const librarianData = LibrarianData.context.get();
	const discardReasons = $derived(librarianData.discardReasons.getArray());
	const books = $derived(librarianData.books.getArray());
	const usedDiscardReasonIds = $derived(new Set(books.map((v) => v.discardReasonId)));

	const onEditClick = (discardReasonId: number) => {
		tableView?.clearSelection();
		pushState('', { lookupEditorState: { type: 'discardReason', id: discardReasonId } });
	};

	const onDeleteClick = async (discardReasonId: number) => {
		tableView?.clearSelection();

		const deleteResult = await librarianData.discardReasons.delete([discardReasonId]);
		if (Result.isError(deleteResult)) {
			clientLogger.fatal('Failed to delete!', { error: deleteResult.value });
			throw new Error();
		}
	};

	const onMergeClick = (discardReasonValues: [string, number][]) => {
		tableView?.clearSelection();
		pushState('', { mergeEditorState: { values: discardReasonValues } });
	};

	mergeEditorSubmitCallbacks.registerCallback(async ([selectedIndex, mergedIndices]) => {
		const updateTo = discardReasons[selectedIndex].id;
		const toUpdate = mergedIndices
			.filter((v) => v !== selectedIndex)
			.map((index) => discardReasons[index].id);

		const booksToUpdate = books
			.filter((v) => v.discardReasonId !== null && toUpdate.includes(v.discardReasonId))
			.map((v) => ({ ...v, discardReasonId: updateTo }));

		if (booksToUpdate.length !== 0) {
			const results = await Promise.all(
				booksToUpdate.map((v) => librarianData.books.patch({ ids: [v.id], newValue: v }))
			);
			const patchErrors = results.filter((v) => Result.isError(v));
			if (patchErrors.length !== 0) {
				clientLogger.fatal('Failed to merge into books!', {
					errors: patchErrors.map((v) => v.value)
				});
				throw new Error();
			}
		}

		const deleteResult = await librarianData.discardReasons.delete(toUpdate);
		if (Result.isError(deleteResult)) {
			clientLogger.fatal('Failed to delete after merge!', { error: deleteResult.value });
			throw new Error();
		}
	});
</script>

<TableView
	bind:this={tableView}
	renderAfterResolved={librarianData.loaded}
	items={discardReasons}
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
			columnName: 'Discard Reason',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.value },
			columnSorter: (l, r) => stringSorter(l.value, r.value),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.value, q) }
		}
	]}
>
	{#snippet singleSelectActions(selectedItem)}
		<TableViewSelectAction iconType="edit" onClick={() => onEditClick(selectedItem[0].id)}>
			Edit
		</TableViewSelectAction>
		<TableViewSelectAction
			iconType="trash-can"
			color="error"
			disabled={usedDiscardReasonIds.has(selectedItem[0].id)}
			onClick={() => onDeleteClick(selectedItem[0].id)}
		>
			{#if usedDiscardReasonIds.has(selectedItem[0].id)}
				This item is used somewhere!
			{:else}
				Delete
			{/if}
		</TableViewSelectAction>
	{/snippet}

	{#snippet multiSelectActions(selectedItems)}
		<TableViewSelectAction
			iconType="merge"
			onClick={() => onMergeClick(selectedItems.map(([v, i]) => [v.value, i]))}
		>
			Merge
		</TableViewSelectAction>
	{/snippet}
</TableView>
