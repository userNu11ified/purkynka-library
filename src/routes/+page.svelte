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
		dateSorter,
		numberSorter,
		stringSorter
	} from '$client/components/table_view/logic/table_view_sorters';
	import { stringFilter } from '$client/collation/filters';
	import { formatDateOrNull, type Nullable } from '$shared/types/util';
	import { StudentState } from '$client/components/student/student_state.svelte';
	import Icon from '$client/components/icon/Icon.svelte';
	import StudentUDCList from '$client/components/student/StudentUDCList.svelte';
	import { watch } from 'runed';
	import StudentSimpleHelp from '$client/components/student/StudentSimpleHelp.svelte';

	let tableView: TableView<any, any> = $state()!;

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

	const studentState = StudentState.context.set(new StudentState());

	const onHelpClick = () => {
		studentState.isStudentHelpVisible = true;
	};

	const onUDCListClick = () => {
		studentState.isUDCListVisible = true;
	};

	watch(
		() => studentState.udcSearchedBy,
		(udcSearchedBy) => {
			if (udcSearchedBy === null) return;
			tableView.searchBy(5, udcSearchedBy);
		}
	);

	let timeoutId: Nullable<number> = null;
	const resetReloadTimeout = () => {
		if (timeoutId !== null) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => window.location.reload(), 1000 * 60 * 5) as any;
	};

	onMount(() => {
		(document.querySelector(':root') as HTMLElement).dataset.theme = 'light';

		studentData.initialize(data.studentData).then(() => {
			clientLogger.info('Loaded Student Data!');

			tableView.resetColumnSizes();
			tableView.resetFilter();
			tableView.sortBy(1, false);
		});

		resetReloadTimeout();
	});
</script>

<svelte:head>
	<title>Knihovna - Čtenáři</title>
</svelte:head>

{#snippet borrowed(item: { permanent: boolean; returnDateString: Nullable<string> })}
	<div
		class="borrowed fill-container center-grid"
		class:permanent={item.permanent}
		class:currently-borrowed={!item.permanent && item.returnDateString !== null}
	>
		{item.permanent
			? 'Trvale'
			: !item.permanent && item.returnDateString === null
				? 'Volná'
				: item.returnDateString}
	</div>
{/snippet}

<svelte:window onmousemove={() => resetReloadTimeout()} />

{#await studentData.loaded}
	<Loading></Loading>
{:then}
	{#if studentState.isStudentHelpVisible}
		<StudentSimpleHelp></StudentSimpleHelp>
	{/if}
	{#if studentState.isUDCListVisible}
		<StudentUDCList></StudentUDCList>
	{/if}
	<TableView
		bind:this={tableView}
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
				columnSorter: (l, r) => {
					if (l.returnDate === null || r.returnDate === null)
						return booleanSorter(l.returnDate === null, r.returnDate === null);
					if (l.permanent || r.permanent) return booleanSorter(l.permanent, r.permanent);

					return dateSorter(l.returnDate, r.returnDate);
				},
				columnSearcher: {
					type: 'filter',
					filter: (m, q) => {
						if (m.returnDate === null && 'volná'.startsWith(q.lowercaseQuery)) return true;
						if (m.permanent && 'trvale'.startsWith(q.lowercaseQuery)) return true;
						if (!m.permanent && (m.returnDateString ?? ''.startsWith(q.lowercaseQuery)))
							return true;

						return false;
					}
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
	<button class="extra-button help-button center-flex" onclick={onHelpClick}>
		<Icon iconType="help" width={20}></Icon>
		Nápověda
	</button>
	<button class="extra-button udc-list-button center-flex" onclick={onUDCListClick}>
		<Icon iconType="list" width={20}></Icon>
		Seznam MDT
	</button>
{/await}

<style>
	.borrowed {
		position: absolute;
		top: 0;
		left: 0;

		background-color: var(--bg-jumped-to);
	}

	.borrowed.permanent {
		background-color: var(--warning-color);
	}

	.borrowed.currently-borrowed {
		background-color: var(--error-color);
	}

	.extra-button {
		gap: 8px;

		position: absolute;
		bottom: 0;
		transform: translateX(-50%);

		height: 32px;

		padding-inline: 8px;

		font-weight: bold;
	}

	.help-button {
		left: 40%;
	}

	.udc-list-button {
		left: 60%;
	}
</style>
