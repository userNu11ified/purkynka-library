<script lang="ts">
	import { page } from '$app/state';
	import { clientLogger } from '$client/client_loggers';
	import { stringFilter } from '$client/collation/filters';
	import { MINIMUM_COLUMN_WIDTH } from '$client/components/table_view/logic/table_view_column_sizing';
	import {
		booleanSorter,
		dateSorter,
		numberSorter,
		stringSorter
	} from '$client/components/table_view/logic/table_view_sorters';
	import TableViewSelectAction from '$client/components/table_view/selection/TableViewSelectAction.svelte';
	import TableView from '$client/components/table_view/TableView.svelte';
	import { createPageUsed } from '$client/page_used';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { Result } from '$shared/types/result';
	import { formatDateOrNull } from '$shared/types/util';
	import { onMount } from 'svelte';

	let tableView: TableView<any, any> | undefined = $state();

	const librarianData = LibrarianData.context.get();
	const permanentBorrows = $derived(librarianData.borrows.getArray().filter((v) => v.permanent));

	const onReturnClick = async (borrowId: number) => {
		tableView?.clearSelection();

		const historyPatchResult = await librarianData.borrowHistory.patch({
			ids: [borrowId],
			newValue: { returnDate: new Date() }
		});

		if (Result.isError(historyPatchResult)) {
			clientLogger.fatal('Failed to PATCH borrow history', { error: historyPatchResult.value });
			throw new Error();
		}

		const borrowRemoveResult = await librarianData.borrows.delete([borrowId]);
		if (Result.isError(borrowRemoveResult)) {
			clientLogger.fatal('Failed to REMOVE borrow', { error: borrowRemoveResult.value });
			throw new Error();
		}
	};

	onMount(() => (createPageUsed('borrows').current = page.route.id));
</script>

<TableView
	bind:this={tableView}
	renderAfterResolved={librarianData.loaded}
	persistentStateId="permanent-column-sizes"
	items={permanentBorrows}
	itemMapper={({ id, bookId, readerId, borrowDate }) => {
		const book = librarianData.books.getValueByIdOrNull(bookId)!;
		const reader = librarianData.readers.getValueByIdOrNull(readerId)!;

		const borrowDateString = formatDateOrNull(borrowDate)!;

		return {
			borrowId: id,
			bookId,
			isLarge: book.isLarge,
			bookName: librarianData.bookNames.getValueByIdOrNull(book.bookNameId)?.value ?? '',
			price: book.price ?? '',
			readerName: reader.readerName,
			readerClass: librarianData.readerClasses.getValueByIdOrNull(reader.readerClassId)!.value,
			borrowDate,
			borrowDateString,
			borrowDateCompactString: borrowDateString.replaceAll(' ', '')
		};
	}}
	itemCopier={({ bookId, isLarge, bookName, price, readerName, borrowDateString }) => [
		bookId,
		isLarge ? 'V' : 'm',
		bookName,
		price,
		readerName,
		borrowDateString
	]}
	columns={[
		{
			columnName: 'Přír. č.',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.bookId },
			columnSorter: (l, r) => numberSorter(l.bookId, r.bookId),
			columnSearcher: {
				type: 'jumper',
				jumper: (mappedItems, q) => {
					const queryAsNumber = parseInt(q.lowercaseQuery);
					if (Number.isNaN(queryAsNumber)) return null;

					const foundIndex = mappedItems.findIndex(([v]) => v.bookId === queryAsNumber);
					return foundIndex === -1 ? null : foundIndex;
				}
			}
		},
		{
			columnName: '',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'px', pixels: MINIMUM_COLUMN_WIDTH },

			columnRenderer: {
				type: 'text',
				textCreator: (v) => (v.isLarge ? 'V' : 'm'),
				titleCreator: (v) => (v.isLarge ? 'Velká' : 'Malá')
			},
			columnSorter: (l, r) => booleanSorter(l.isLarge, r.isLarge),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) => {
					const queryAsBoolean =
						q.lowercaseQuery === 'v' ? true : q.lowercaseQuery === 'm' ? false : null;
					if (queryAsBoolean === null) return false;
					return v.isLarge === queryAsBoolean;
				}
			}
		},
		{
			columnName: 'Název knihy',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.bookName },
			columnSorter: (l, r) => stringSorter(l.bookName, r.bookName),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.bookName, q) }
		},
		{
			columnName: 'Cena',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.price },
			columnSorter: (l, r) => stringSorter(l.price, r.price),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.price, q) }
		},
		{
			columnName: 'Čtenář',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.readerName },
			columnSorter: (l, r) => stringSorter(l.readerName, r.readerName),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.readerName, q) }
		},

		{
			columnName: 'Třída',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.readerClass },
			columnSorter: (l, r) => stringSorter(l.readerClass, r.readerClass),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.readerClass, q) }
		},
		{
			columnName: 'Půjčeno dne',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.borrowDateString },
			columnSorter: (l, r) => dateSorter(l.borrowDate, r.borrowDate),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) =>
					stringFilter(v.borrowDateString, q) || stringFilter(v.borrowDateCompactString, q)
			}
		}
	]}
>
	{#snippet singleSelectActions(selectedItem)}
		<TableViewSelectAction
			iconType="book-return"
			onClick={() => onReturnClick(selectedItem[0].borrowId)}>Vrátit</TableViewSelectAction
		>
	{/snippet}
</TableView>
