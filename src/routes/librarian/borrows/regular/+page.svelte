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
	const normalBorrows = $derived(librarianData.borrows.getArray().filter((v) => !v.permanent));

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

	const onExtendClick = async (borrowId: number) => {
		tableView?.clearSelection();

		const oldBorrow = librarianData.borrows.getValueByIdOrNull(borrowId)!;
		const timesExtended = oldBorrow.timesExtended ?? 0;

		const historyPatchResult = await librarianData.borrowHistory.patch({
			ids: [borrowId],
			newValue: { timesExtended: timesExtended + 1 }
		});
		if (Result.isError(historyPatchResult)) {
			clientLogger.fatal('Failed to PATCH borrow history', { error: historyPatchResult.value });
			throw new Error();
		}

		const borrowPatchResult = await librarianData.borrows.patch({
			ids: [borrowId],
			newValue: { timesExtended: timesExtended + 1 }
		});
		if (Result.isError(borrowPatchResult)) {
			clientLogger.fatal('Failed to PATCH borrow history', { error: borrowPatchResult.value });
			throw new Error();
		}
	};

	const onPermanentClick = async (borrowId: number) => {
		tableView?.clearSelection();

		const historyPatchResult = await librarianData.borrowHistory.patch({
			ids: [borrowId],
			newValue: { permanent: true }
		});
		if (Result.isError(historyPatchResult)) {
			clientLogger.fatal('Failed to PATCH borrow history', { error: historyPatchResult.value });
			throw new Error();
		}

		const borrowPatchResult = await librarianData.borrows.patch({
			ids: [borrowId],
			newValue: { permanent: true }
		});
		if (Result.isError(borrowPatchResult)) {
			clientLogger.fatal('Failed to PATCH borrow history', { error: borrowPatchResult.value });
			throw new Error();
		}
	};

	const getPastDueClassByWeekCount = (weekCount: number) => {
		if (weekCount <= 0) return 'not-past-due';
		if (weekCount <= 4) return 'past-due-month';
		if (weekCount <= 8) return 'past-due-two-months';
		if (weekCount <= 9) return 'past-due-two-months-one-week';
		if (weekCount <= 10) return 'past-due-two-months-two-weeks';
		return 'past-due-two-months-three-weeks-or-more';
	};

	onMount(() => (createPageUsed('borrows').current = page.route.id));
</script>

{#snippet returnUntilColumn(value: {
	returnUntilString: string;
	weeksPastDue: number;
	pastDueClassifier: string;
})}
	<div
		class="return-until-column fill-container center-grid"
		title={value.weeksPastDue <= 0 ? 'Před datem vrácení' : `${value.weeksPastDue} týd. pozdě!`}
		data-past-due-classifier={value.pastDueClassifier}
	>
		{value.returnUntilString}
	</div>
{/snippet}

<TableView
	renderAfterResolved={librarianData.loaded}
	persistentStateId="borrows-regular"
	items={normalBorrows}
	itemMapper={({ id, bookId, readerId, borrowDate, timesExtended }) => {
		const book = librarianData.books.getValueByIdOrNull(bookId)!;
		const reader = librarianData.readers.getValueByIdOrNull(readerId)!;

		const borrowDateString = formatDateOrNull(borrowDate)!;

		const returnUntil = new Date(
			borrowDate.getFullYear(),
			borrowDate.getMonth() + (timesExtended ?? 0) + 1,
			borrowDate.getDate()
		);
		const returnUntilString = formatDateOrNull(returnUntil)!;

		const weeksPastDue = Math.ceil(
			(new Date().getTime() - returnUntil.getTime()) / (1000 * 60 * 60 * 24 * 7)
		);
		const pastDueClassifier = getPastDueClassByWeekCount(weeksPastDue);

		return {
			borrowId: id,
			bookId,
			isLarge: book.isLarge,
			bookName: librarianData.bookNames.getValueByIdOrNull(book.bookNameId)?.value ?? '',
			readerName: reader.readerName,
			readerClass:
				librarianData.readerClasses.getValueByIdOrNull(reader.readerClassId)?.value ?? '',
			borrowDate,
			borrowDateString,
			borrowDateCompactString: borrowDateString.replaceAll(' ', ''),
			timesExtended,
			returnUntil,
			returnUntilString,
			returnUntilCompactString: returnUntilString.replaceAll(' ', ''),
			weeksPastDue,
			pastDueClassifier
		};
	}}
	itemCopier={({
		bookId,
		isLarge,
		bookName,
		readerName,
		readerClass,
		borrowDateString,
		timesExtended,
		returnUntilString
	}) => [
		bookId,
		isLarge ? 'V' : 'm',
		bookName,
		readerName,
		readerClass,
		borrowDateString,
		`${timesExtended}x`,
		returnUntilString
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
		},
		{
			columnName: 'Prodlouženo',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => `${v.timesExtended ?? 0}x` },
			columnSorter: (l, r) => numberSorter(l.timesExtended ?? -1, r.timesExtended ?? -1),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) => stringFilter(`${v.timesExtended ?? 0}`, q)
			}
		},
		{
			columnName: 'Vrátit do',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'snippet', snippet: returnUntilColumn },
			columnSorter: (l, r) => dateSorter(l.returnUntil, r.returnUntil),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) =>
					stringFilter(v.returnUntilString, q) || stringFilter(v.returnUntilCompactString, q)
			}
		}
	]}
>
	{#snippet singleSelectActions(selectedItem)}
		<TableViewSelectAction
			iconType="book-return"
			onClick={() => onReturnClick(selectedItem[0].borrowId)}>Vrátit</TableViewSelectAction
		>

		<TableViewSelectAction
			iconType="book-add"
			onClick={() => onExtendClick(selectedItem[0].borrowId)}>Prodloužit</TableViewSelectAction
		>

		<TableViewSelectAction
			iconType="book-lock"
			onClick={() => onPermanentClick(selectedItem[0].borrowId)}>Trvale</TableViewSelectAction
		>
	{/snippet}
</TableView>

<style>
	.return-until-column {
		position: absolute;
		left: 0;
		top: 0;

		background-color: transparent;
	}

	.return-until-column[data-past-due-classifier='not-past-due'] {
		background-color: var(--not-past-due);
	}

	.return-until-column[data-past-due-classifier='past-due-month'] {
		background-color: var(--past-due-month);
	}

	.return-until-column[data-past-due-classifier='past-due-two-months'] {
		background-color: var(--past-due-two-months);
	}

	.return-until-column[data-past-due-classifier='past-due-two-months-one-week'] {
		background-color: var(--past-due-two-months-one-week);
	}

	.return-until-column[data-past-due-classifier='past-due-two-months-two-weeks'] {
		background-color: var(--past-due-two-months-two-weeks);
	}

	.return-until-column[data-past-due-classifier='past-due-two-months-three-weeks-or-more'] {
		background-color: var(--past-due-two-months-three-weeks-or-more);
	}
</style>
