<script lang="ts">
	import { page } from '$app/state';
	import { stringFilter } from '$client/collation/filters';
	import { MINIMUM_COLUMN_WIDTH } from '$client/components/table_view/logic/table_view_column_sizing';
	import {
		booleanSorter,
		dateSorter,
		numberSorter,
		stringSorter
	} from '$client/components/table_view/logic/table_view_sorters';
	import TableView from '$client/components/table_view/TableView.svelte';
	import { createPageUsed } from '$client/page_used';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { formatDateOrNull } from '$shared/types/util';
	import { onMount } from 'svelte';

	const librarianData = LibrarianData.context.get();

	onMount(() => (createPageUsed('borrows').current = page.route.id));
</script>

<TableView
	renderAfterResolved={librarianData.loaded}
	persistentStateId="history-column-sizes"
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
		isLarge === null ? '' : isLarge ? 'V' : 'm',
		bookName,
		readerName,
		readerClass,
		borrowDateString,
		permanent ? 'Trvale' : returnDateString,
		`${timesExtended}x`
	]}
	columns={[
		{
			columnName: 'Výpůjčka č.',
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
			columnName: 'Přír. č.',
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

			columnRenderer: {
				type: 'text',
				textCreator: (v) => (v.isLarge ? 'V' : 'm'),
				titleCreator: (v) => (v.isLarge ? 'Velká' : 'Malá')
			},
			columnSorter: (l, r) => booleanSorter(l.isLarge ?? false, r.isLarge ?? false),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) => {
					if (v.isLarge === null && q.trimmedQuery === '') return true;

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
			columnName: 'Půjčeno',
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
			columnName: 'Vráceno',
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
			columnName: 'Trvale',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => (v.permanent ? 'Ano' : 'Ne') },
			columnSorter: (l, r) => booleanSorter(l.permanent, r.permanent),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) => {
					const queryAsBoolean =
						q.lowercaseQuery === 'ano' || q.lowercaseQuery === 'a'
							? true
							: q.lowercaseQuery === 'ne' || q.lowercaseQuery === 'n'
								? false
								: null;
					if (queryAsBoolean === null) return false;
					return v.permanent === queryAsBoolean;
				}
			}
		},
		{
			columnName: 'Prodlouženo',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => `${v.timesExtended}x` },
			columnSorter: (l, r) => numberSorter(l.timesExtended ?? -1, r.timesExtended ?? -1),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(`${v.timesExtended}x`, q) }
		}
	]}
></TableView>
