<script lang="ts">
	import { stringFilter } from '$client/collation/filters';
	import { MINIMUM_COLUMN_WIDTH } from '$client/components/table_view/logic/table_view_column_sizing';
	import {
		booleanSorter,
		dateSorter,
		numberSorter,
		stringSorter
	} from '$client/components/table_view/logic/table_view_sorters';
	import TableView from '$client/components/table_view/TableView.svelte';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { formatDateOrNull } from '$shared/types/util';

	const librarianData = LibrarianData.context.get();
</script>

<TableView
	renderAfterResolved={librarianData.loaded}
	items={librarianData.borrowHistory.getArray()}
	itemMapper={({
		id,
		bookId,
		readerName,
		readerClass,
		borrowDate,
		returnDate,
		permanent,
		timesExtended
	}) => {
		const book = librarianData.books.getValueByIdOrNull(bookId);
		const borrowDateString = formatDateOrNull(borrowDate)!;
		const returnDateString = formatDateOrNull(returnDate);

		return {
			id,
			bookId,
			isLarge: book?.isLarge ?? null,
			bookName: librarianData.bookNames.getValueByIdOrNull(book?.bookNameId ?? -1)?.value ?? '',
			readerName,
			readerClass,
			borrowDate,
			borrowDateString,
			borrowDateCompactString: borrowDateString.replaceAll(' ', ''),
			returnDate: returnDate ?? new Date(1970, 1, 1),
			returnDateString: returnDateString ?? '-',
			returnDateCompactString: returnDateString?.replaceAll(' ', '') ?? '-',
			permanent,
			timesExtended
		};
	}}
	itemCopier={({
		id,
		bookId,
		isLarge,
		bookName,
		readerName,
		readerClass,
		borrowDateString,
		returnDateString,
		permanent,
		timesExtended
	}) => [
		id,
		bookId,
		isLarge === null ? '' : isLarge ? 'L' : 's',
		bookName,
		readerName,
		readerClass,
		borrowDateString,
		permanent ? 'Permanent' : returnDateString,
		`${timesExtended}x`
	]}
	columns={[
		{
			columnName: 'Borrow ID',
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
			columnName: 'Book ID',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.bookId },
			columnSorter: (l, r) => numberSorter(l.bookId, r.bookId),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) => stringFilter(`${v.bookId}`, q)
			}
		},
		{
			columnName: '',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'px', pixels: MINIMUM_COLUMN_WIDTH },

			columnRenderer: { type: 'text', textCreator: (v) => (v.isLarge ? 'L' : 's') },
			columnSorter: (l, r) => booleanSorter(l.isLarge ?? false, r.isLarge ?? false),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) => {
					if (v.isLarge === null && q.trimmedQuery === '') return true;

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
			columnName: 'Reader Name',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.readerName },
			columnSorter: (l, r) => stringSorter(l.readerName, r.readerName),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.readerName, q) }
		},
		{
			columnName: 'Reader Class',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.readerClass },
			columnSorter: (l, r) => stringSorter(l.readerClass, r.readerClass),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.readerClass, q) }
		},
		{
			columnName: 'Borrow Date',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.borrowDateString },
			columnSorter: (l, r) => dateSorter(l.borrowDate, r.borrowDate),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) =>
					stringFilter(v.borrowDateString, q) || stringFilter(v.borrowDateCompactString, q)
			}
		},
		{
			columnName: 'Return Date',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: {
				type: 'text',
				textCreator: (v) => v.returnDateString
			},
			columnSorter: (l, r) => dateSorter(l.returnDate, r.returnDate),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) =>
					stringFilter(v.returnDateString, q) || stringFilter(v.returnDateCompactString, q)
			}
		},
		{
			columnName: 'Permanent',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => (v.permanent ? 'Yes' : 'No') },
			columnSorter: (l, r) => booleanSorter(l.permanent, r.permanent),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) => {
					const queryAsBoolean =
						q.lowercaseQuery === 'yes' || q.lowercaseQuery === 'y'
							? true
							: q.lowercaseQuery === 'no' || q.lowercaseQuery === 'n'
								? false
								: null;
					if (queryAsBoolean === null) return false;
					return v.isLarge === queryAsBoolean;
				}
			}
		},
		{
			columnName: 'Times Extended',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => `${v.timesExtended}x` },
			columnSorter: (l, r) => numberSorter(l.timesExtended ?? -1, r.timesExtended ?? -1),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(`${v.timesExtended}x`, q) }
		}
	]}
></TableView>
