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
	const discardedBooks = $derived(
		librarianData.books.getArray().filter((v) => v.discardDate !== null)
	);

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

		tableView?.clearSelection();
	};

	onMount(() => (createPageUsed('books').current = page.route.id));
</script>

<TableView
	bind:this={tableView}
	renderAfterResolved={librarianData.loaded}
	persistentStateId="discarded-column-sizes"
	items={discardedBooks}
	itemMapper={({
		id,
		isLarge,
		bookNameId,
		discardDate,
		price,
		literatureTypeId,
		discardReasonId,
		discardDocument
	}) => {
		const bookName = librarianData.bookNames.getValueByIdOrNull(bookNameId);
		const discardDateString = formatDateOrNull(discardDate) ?? '';
		const literatureType = librarianData.literatureTypes.getValueByIdOrNull(literatureTypeId);
		const discardReason = librarianData.discardReasons.getValueByIdOrNull(discardReasonId);

		return {
			id,
			isLarge,
			bookName: bookName?.value ?? '',
			authorString: getAuthorString(id),
			discardDate: discardDate ?? new Date(1, 1, 1970),
			discardDateString,
			discardDateCompactString: discardDateString.replaceAll(' ', ''),
			price: price ?? '',
			literatureTypeShortName: literatureType?.shortName ?? '',
			literatureTypeLongName: literatureType?.longName ?? '',
			discardReason: discardReason?.value ?? '',
			discardDocument: discardDocument ?? ''
		};
	}}
	itemCopier={({
		id,
		isLarge,
		bookName,
		authorString,
		discardDateString,
		price,
		literatureTypeShortName,
		discardReason,
		discardDocument
	}) => [
		id,
		isLarge ? 'V' : 'm',
		bookName,
		authorString,
		discardDateString,
		price,
		literatureTypeShortName,
		discardReason,
		discardDocument
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
			columnName: 'Autor',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.authorString },
			columnSorter: (l, r) => stringSorter(l.authorString, r.authorString),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.authorString, q) }
		},
		{
			columnName: 'Datum odpisu',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.discardDateString },
			columnSorter: (l, r) => dateSorter(l.discardDate, r.discardDate),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) =>
					stringFilter(v.discardDateString, q) || stringFilter(v.discardDateCompactString, q)
			}
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
			columnName: 'Literatura',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: {
				type: 'text',
				textCreator: (v) => v.literatureTypeShortName,
				titleCreator: (v) => v.literatureTypeLongName
			},
			columnSorter: (l, r) => stringSorter(l.literatureTypeShortName, r.literatureTypeShortName),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) =>
					stringFilter(v.literatureTypeShortName, q) || stringFilter(v.literatureTypeLongName, q)
			}
		},
		{
			columnName: 'Důvod',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.discardReason },
			columnSorter: (l, r) => stringSorter(l.discardReason, r.discardReason),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.discardReason, q) }
		},
		{
			columnName: 'Doklad odpisu',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.discardDocument },
			columnSorter: (l, r) => stringSorter(l.discardDocument, r.discardDocument),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.discardDocument, q) }
		}
	]}
>
	{#snippet singleSelectActions(selectedItem)}
		<TableViewSelectAction
			iconType="book-restore"
			color="success"
			onClick={() => onRestoreClick(selectedItem[0].id)}
		>
			Vrátit
		</TableViewSelectAction>
	{/snippet}
</TableView>
