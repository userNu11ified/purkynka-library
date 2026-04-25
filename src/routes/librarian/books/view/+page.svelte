<script lang="ts">
	import { pushState } from '$app/navigation';
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

	const librarianData = LibrarianData.context.get();
	const authorToBook = $derived(librarianData.authorToBook.getByBookIdMap());

	const getAuthorString = (bookId: number) => {
		const authors = authorToBook.get(bookId);
		if (authors === undefined) return '';

		return authors
			.map(({ authorId }) => librarianData.authorNames.getValueByIdOrNull(authorId))
			.filter((v) => v !== null)
			.map(({ value }) => value)
			.join(' — ');
	};

	const onEditClick = (bookId: number) =>
		pushState('', { bookEditorState: { type: 'edit', bookId } });
	const onBorrowClick = (bookId: number) => pushState('', { borrowEditorState: { bookId } });
	const onReturnClick = async (borrowId: number) => {
		const borrow = librarianData.borrows.getValueByIdOrNull(borrowId)!;
		const borrowRemoveResult = await librarianData.borrows.delete([borrow.id]);
		if (Result.isError(borrowRemoveResult)) {
			clientLogger.fatal('Failed to PATCH returned borrow!', { error: borrowRemoveResult.value });
			throw new Error();
		}

		const borrowHistoryPatchResult = await librarianData.borrowHistory.patch({
			ids: [borrow.id],
			newValue: { returnDate: new Date() }
		});
		if (Result.isError(borrowHistoryPatchResult)) {
			clientLogger.fatal('Failed to PATCH borrow history!', {
				error: borrowHistoryPatchResult.value
			});
			throw new Error();
		}
	};
	const onNewCopyClick = (bookId: number) =>
		pushState('', { bookEditorState: { type: 'new-copy', bookId } });
	const onDiscardClick = (bookId: number) =>
		pushState('', { bookEditorState: { type: 'discard', bookId } });
	const onRestoreClick = async (bookId: number) => {
		const book = { ...librarianData.books.getValueByIdOrNull(bookId)! };
		book.discardDate = null;
		book.discardDocument = null;
		book.discardReasonId = null;

		const bookPatchResult = await librarianData.books.patch({ ids: [bookId], newValue: book });
		if (Result.isError(bookPatchResult)) {
			clientLogger.fatal('Failed to PATCH undiscarding book!', { error: bookPatchResult.value });
			throw new Error();
		}
	};

	onMount(() => (createPageUsed('books').current = page.route.id));
</script>

<TableView
	renderAfterResolved={librarianData.loaded}
	persistentStateId="view-column-sizes"
	items={librarianData.books.getArray()}
	itemMapper={(book) => {
		const { id, isLarge, bookNameId, annotation, udcId, note, discardDate } = book;

		const bookName = librarianData.bookNames.getValueByIdOrNull(bookNameId);
		const udc = librarianData.udc.getValueByIdOrNull(udcId);
		const discardDateString = formatDateOrNull(discardDate) ?? '';
		const borrow = librarianData.borrows.getByBookIdOrNull(id);
		const reader = librarianData.readers.getValueByIdOrNull(borrow?.readerId ?? null);

		return {
			id,
			isLarge,
			bookName: bookName?.value ?? '',
			authorString: getAuthorString(id),
			annotation: annotation ?? '',
			udcShortName: udc?.shortName ?? '',
			udcLongName: udc?.longName ?? '',
			note: note ?? '',
			discardDate: discardDate ?? new Date(1, 1, 1970),
			discardDateString,
			discardDateCompactString: discardDateString.replaceAll(' ', ''),
			borrowId: borrow?.id ?? null,
			borrowClassName:
				librarianData.readerClasses.getValueByIdOrNull(reader?.readerClassId ?? null)?.value ?? '',
			borrowReaderName: reader?.readerName ?? '',
			borrowDate: formatDateOrNull(borrow?.borrowDate ?? null) ?? ''
		};
	}}
	itemCopier={({
		id,
		isLarge,
		bookName,
		authorString,
		annotation,
		udcShortName,
		note,
		discardDateString
	}) => [
		id,
		isLarge ? 'V' : 'm',
		bookName,
		authorString,
		annotation,
		udcShortName,
		note,
		'',
		discardDateString
	]}
	columns={[
		{
			columnName: 'Přír. č.',
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
			columnName: '',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'px', pixels: MINIMUM_COLUMN_WIDTH },

			columnRenderer: { type: 'text', textCreator: (v) => (v.isLarge ? 'V' : 'm') },
			columnSorter: (l, r) => booleanSorter(l.isLarge, r.isLarge),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) => {
					const queryAsBoolean =
						q.lowercaseQuery === 'V' ? true : q.lowercaseQuery === 'm' ? false : null;
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
			columnName: 'Autor',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.authorString },
			columnSorter: (l, r) => stringSorter(l.authorString, r.authorString),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.authorString, q) }
		},
		{
			columnName: 'Anotace',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.annotation },
			columnSorter: (l, r) => stringSorter(l.annotation, r.annotation),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.annotation, q) }
		},
		{
			columnName: 'MDT',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.udcShortName },
			columnSorter: (l, r) => stringSorter(l.udcShortName, r.udcShortName),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) => stringFilter(v.udcShortName, q) || stringFilter(v.udcLongName, q)
			}
		},
		{
			columnName: 'Pozn.',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.note },
			columnSorter: (l, r) => stringSorter(l.note, r.note),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.note, q) }
		},
		{
			columnName: 'Půjč.',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: {
				type: 'text',
				textCreator: (v) => v.borrowClassName,
				titleCreator: (v) => `${v.borrowReaderName}\n${v.borrowDate}`
			},
			columnSorter: () => 0,
			columnSearcher: { type: 'filter', filter: () => true }
		},
		{
			columnName: 'Vyřaz.',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.discardDateString },
			columnSorter: (l, r) => dateSorter(l.discardDate, r.discardDate),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) =>
					stringFilter(v.discardDateString, q) || stringFilter(v.discardDateCompactString, q)
			}
		}
	]}
>
	{#snippet singleSelectActions(selectedItem)}
		{#if selectedItem[0].borrowId !== null}
			<TableViewSelectAction
				iconType="book-return"
				onClick={() => onReturnClick(selectedItem[0].borrowId!)}
			>
				Vrátit
			</TableViewSelectAction>
		{:else}
			<TableViewSelectAction
				iconType="book-borrow"
				onClick={() => onBorrowClick(selectedItem[0].id)}
			>
				Půjčit
			</TableViewSelectAction>
		{/if}
		<TableViewSelectAction iconType="edit" onClick={() => onEditClick(selectedItem[0].id)}
			>Upravit</TableViewSelectAction
		>

		<TableViewSelectAction iconType="book-add" onClick={() => onNewCopyClick(selectedItem[0].id)}>
			Přidat znovu
		</TableViewSelectAction>
		{#if selectedItem[0].discardDateString === ''}
			<TableViewSelectAction
				iconType="book-discard"
				color="error"
				onClick={() => onDiscardClick(selectedItem[0].id)}
			>
				Vyřadit
			</TableViewSelectAction>
		{:else}
			<TableViewSelectAction
				iconType="book-restore"
				color="success"
				onClick={() => onRestoreClick(selectedItem[0].id)}
			>
				Zrušit vyřazení
			</TableViewSelectAction>
		{/if}
	{/snippet}
</TableView>
