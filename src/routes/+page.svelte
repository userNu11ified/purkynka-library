<script lang="ts">
	import { StudentData } from '$shared/types/loaded_data/student_data';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { clientLogger } from '$client/client_loggers';
	import Loading from '$client/components/loading/Loading.svelte';
	import TableView from '$client/components/table_view/TableView.svelte';
	import { MINIMUM_COLUMN_WIDTH } from '$client/components/table_view/logic/table_view_column_sizing';
	import {
		booleanSorter,
		numberSorter,
		stringSorter
	} from '$client/components/table_view/logic/table_view_sorters';
	import { stringFilter } from '$client/collation/filters';
	import { formatDateOrNull, type Nullable } from '$shared/types/util';

	const { data }: PageProps = $props();

	const studentData = StudentData.context.set(new StudentData());
	const authorToBook = $derived(studentData.authorToBook.getByBookIdMap());

	const getAuthorString = (bookId: number) => {
		const authors = authorToBook.get(bookId);
		if (authors === undefined) return '';

		return authors
			.map(({ authorId }) => studentData.authorNames.getValueByIdOrNull(authorId))
			.filter((v) => v !== null)
			.map(({ value }) => value)
			.join(' — ');
	};

	onMount(() => {
		(document.querySelector(':root') as HTMLElement).dataset.theme = 'light';

		studentData.initialize(data.studentData).then(() => {
			clientLogger.info('Loaded Student Data!');
		});

		setInterval(() => window.location.reload(), 1000 * 60 * 5);
	});
</script>

<svelte:head>
	<title>Knihovna - Čtenáři</title>
</svelte:head>

{#snippet borrowed(item: { permanent: boolean; returnDateString: Nullable<string> })}
	{@const permanent = item.permanent}
	{@const borrowed = !item.permanent && item.returnDateString !== null}
	<div
		class="borrowed fill-container center-grid"
		class:permanent
		class:currently-borrowed={borrowed}
	>
		{item.permanent ? 'Trvale' : item.returnDateString === null ? 'Volná' : item.returnDateString}
	</div>
{/snippet}

{#await studentData.loaded}
	<Loading></Loading>
{:then}
	<TableView
		renderAfterResolved={studentData.loaded}
		persistentStateId="student"
		items={studentData.books.getArray()}
		itemMapper={(book) => {
			const { id, isLarge, bookNameId, udcId, annotation } = book;
			const udc = studentData.udc.getValueByIdOrNull(udcId);

			const borrow = studentData.borrows.getByBookIdOrNull(id);
			const returnDate =
				borrow === null
					? null
					: new Date(
							borrow.borrowDate.getFullYear(),
							borrow.borrowDate.getMonth() + (borrow.timesExtended ?? 0) + 1,
							borrow.borrowDate.getDate()
						);

			return {
				id,
				isLarge,
				bookName: studentData.bookNames.getValueByIdOrNull(bookNameId)?.value ?? '',
				authorString: getAuthorString(id),
				udcShortName: udc?.shortName ?? '',
				udcLongName: udc?.longName ?? '',
				annotation: annotation ?? '',
				returnDate: returnDate,
				permanent: borrow?.permanent ?? false,
				returnDateString: formatDateOrNull(returnDate)
			};
		}}
		itemCopier={({ id }) => [id]}
		columns={[
			{
				columnName: 'Půjčeno',
				columnAlignment: 'center',
				defaultColumnSize: { type: 'fr', fractions: 0.5 },
				columnRenderer: { type: 'snippet', snippet: borrowed },
				columnSorter: () => 0,
				columnSearcher: {
					type: 'filter',
					filter: () => true
				}
			},
			{
				columnName: 'Přír. č.',
				columnAlignment: 'center',
				defaultColumnSize: { type: 'fr', fractions: 0.5 },

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
				defaultColumnSize: { type: 'fr', fractions: 2 },

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
				columnName: 'MDT',
				columnAlignment: 'center',
				defaultColumnSize: { type: 'fr', fractions: 0.5 },

				columnRenderer: {
					type: 'text',
					textCreator: (v) => v.udcShortName,
					titleCreator: (v) => v.udcLongName
				},
				columnSorter: (l, r) => stringSorter(l.udcShortName, r.udcShortName),
				columnSearcher: {
					type: 'filter',
					filter: (v, q) => stringFilter(v.udcShortName, q) || stringFilter(v.udcLongName, q)
				}
			},
			{
				columnName: 'Anotace',
				defaultColumnSize: { type: 'fr', fractions: 1.5 },

				columnRenderer: { type: 'text', containsLinks: true, textCreator: (v) => v.annotation },
				columnSorter: (l, r) => stringSorter(l.annotation, r.annotation),
				columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.annotation, q) }
			}
		]}
	></TableView>
{/await}

<style>
	.borrowed {
		position: absolute;
		top: 0;
		left: 0;

		background-color: var(--bg-jumped-to);
		color: var(--bg-primary);
	}

	.borrowed.permanent {
		background-color: var(--warning-color);
	}

	.borrowed.currently-borrowed {
		background-color: var(--error-color);
	}
</style>
