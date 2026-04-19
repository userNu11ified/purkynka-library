<script lang="ts">
	import { MINIMUM_COLUMN_WIDTH } from '$client/components/table_view/logic/table_view_column_sizing';
	import { stringFilter } from '$client/components/table_view/logic/table_view_filters';
	import {
		booleanSorter,
		dateSorter,
		numberSorter,
		stringSorter
	} from '$client/components/table_view/logic/table_view_sorters';
	import TableViewSelectAction from '$client/components/table_view/selection/TableViewSelectAction.svelte';
	import TableView from '$client/components/table_view/TableView.svelte';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { formatDateOrNull } from '$shared/types/util';

	const librarianData = LibrarianData.getContext();
	const authorToBook = librarianData.authorToBook.getByPrimaryKey();

	const getAuthorString = (bookId: number) => {
		const authors = authorToBook.get(bookId);
		if (authors === undefined) return '';

		return authors
			.map(({ authorId }) => librarianData.authorNames.getByIdOrNull(authorId))
			.filter((v) => v !== null)
			.map(({ value }) => value)
			.join(' — ');
	};

	const onEditClick = () => {};
	const onBorrowClick = () => {};
	const onDuplicateClick = () => {};
	const onDiscardClick = () => {};
</script>

<TableView
	renderAfterResolved={librarianData.loaded}
	items={librarianData.books.getArray()}
	itemMapper={({ id, isLarge, bookNameId, annotation, udcId, note, discardDate }) => {
		const bookName = librarianData.bookNames.getByIdOrNull(bookNameId);
		const udc = librarianData.udc.getByIdOrNull(udcId);
		const discardDateString = formatDateOrNull(discardDate) ?? '';

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
			discardDateCompactString: discardDateString.replaceAll(' ', '')
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
		isLarge ? 'L' : 's',
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
			columnName: '',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'px', pixels: MINIMUM_COLUMN_WIDTH },

			columnRenderer: { type: 'text', textCreator: (v) => (v.isLarge ? 'L' : 's') },
			columnSorter: (l, r) => booleanSorter(l.isLarge, r.isLarge),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) => {
					const queryAsBoolean =
						q.lowercaseQuery === 'l' ? true : q.lowercaseQuery === 's' ? false : null;
					if (queryAsBoolean === null) return false;
					return v.isLarge === queryAsBoolean;
				}
			}
		},
		{
			columnName: 'Book Name',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.bookName },
			columnSorter: (l, r) => stringSorter(l.bookName, r.bookName),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.bookName, q) }
		},
		{
			columnName: 'Author',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.authorString },
			columnSorter: (l, r) => stringSorter(l.authorString, r.authorString),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.authorString, q) }
		},
		{
			columnName: 'Annotation',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.annotation },
			columnSorter: (l, r) => stringSorter(l.annotation, r.annotation),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.annotation, q) }
		},
		{
			columnName: 'UDC',
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
			columnName: 'Note',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.note },
			columnSorter: (l, r) => stringSorter(l.note, r.note),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.note, q) }
		},
		{
			columnName: 'Borrowed',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: () => '' },
			columnSorter: () => 0,
			columnSearcher: { type: 'filter', filter: () => true }
		},
		{
			columnName: 'Discarded',
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
	{#snippet singleSelectActions()}
		<TableViewSelectAction iconType="edit" onClick={onEditClick}>Edit</TableViewSelectAction>
		<TableViewSelectAction iconType="book-borrow" onClick={onBorrowClick}>
			Borrow
		</TableViewSelectAction>
		<TableViewSelectAction iconType="book-add" onClick={onDuplicateClick}>
			Duplicate
		</TableViewSelectAction>
		<TableViewSelectAction iconType="book-discard" onClick={onDiscardClick}>
			Discard
		</TableViewSelectAction>
	{/snippet}
</TableView>
