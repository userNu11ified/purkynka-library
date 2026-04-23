<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { stringFilter } from '$client/collation/filters';
	import {
		numberSorter,
		stringSorter
	} from '$client/components/table_view/logic/table_view_sorters';
	import TableViewSelectAction from '$client/components/table_view/selection/TableViewSelectAction.svelte';
	import TableView from '$client/components/table_view/TableView.svelte';
	import { createPageUsed } from '$client/page_used';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { onMount } from 'svelte';

	const librarianData = LibrarianData.context.get();

	const onEditClick = (bookId: number) =>
		pushState('', { bookEditorState: { type: 'edit', bookId } });

	onMount(() => (createPageUsed('books').current = page.route.id));
</script>

<TableView
	renderAfterResolved={librarianData.loaded}
	items={librarianData.books.getArray()}
	itemMapper={({
		id,
		bookNameId,
		publisherId,
		placeOfPublishingId,
		yearOfPublishing,
		edition,
		pageCount,
		literatureTypeId,
		price,
		obtainedFromId
	}) => {
		const bookName = librarianData.bookNames.getValueByIdOrNull(bookNameId);
		const publisher = librarianData.publishers.getValueByIdOrNull(publisherId);
		const placeOfPublishing =
			librarianData.placesOfPublishing.getValueByIdOrNull(placeOfPublishingId);
		const literatureType = librarianData.literatureTypes.getValueByIdOrNull(literatureTypeId);
		const obtainedFrom = librarianData.obtainedFrom.getValueByIdOrNull(obtainedFromId);

		return {
			id,
			bookName: bookName?.value ?? '',
			publisher: publisher?.value ?? '',
			placeOfPublishing: placeOfPublishing?.value ?? '',
			yearOfPublishing: yearOfPublishing ?? '',
			edition: edition ?? '',
			pageCount: pageCount ?? '',
			literatureTypeShortName: literatureType?.shortName ?? '',
			literatureTypeLongName: literatureType?.longName ?? '',
			price: price ?? '',
			obtainedFrom: obtainedFrom?.value ?? ''
		};
	}}
	itemCopier={({
		id,
		bookName,
		publisher,
		placeOfPublishing,
		yearOfPublishing,
		edition,
		pageCount,
		literatureTypeShortName,
		price,
		obtainedFrom
	}) => [
		id,
		bookName,
		publisher,
		placeOfPublishing,
		yearOfPublishing,
		edition,
		pageCount,
		literatureTypeShortName,
		price,
		obtainedFrom
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
			columnName: 'Book Name',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.bookName },
			columnSorter: (l, r) => stringSorter(l.bookName, r.bookName),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.bookName, q) }
		},
		{
			columnName: 'Publisher',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.publisher },
			columnSorter: (l, r) => stringSorter(l.publisher, r.publisher),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.publisher, q) }
		},
		{
			columnName: 'Place Of Publishing',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.placeOfPublishing },
			columnSorter: (l, r) => stringSorter(l.placeOfPublishing, r.placeOfPublishing),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.placeOfPublishing, q) }
		},
		{
			columnName: 'Year Of Publishing',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.yearOfPublishing },
			columnSorter: (l, r) => stringSorter(l.yearOfPublishing, r.yearOfPublishing),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.yearOfPublishing, q) }
		},
		{
			columnName: 'Edition',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.edition },
			columnSorter: (l, r) => stringSorter(l.edition, r.edition),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.edition, q) }
		},
		{
			columnName: 'Page Count',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.pageCount },
			columnSorter: (l, r) => stringSorter(l.pageCount, r.pageCount),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.pageCount, q) }
		},
		{
			columnName: 'Literature Type',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.literatureTypeShortName },
			columnSorter: (l, r) => stringSorter(l.literatureTypeShortName, r.literatureTypeShortName),
			columnSearcher: {
				type: 'filter',
				filter: (v, q) =>
					stringFilter(v.literatureTypeShortName, q) || stringFilter(v.literatureTypeLongName, q)
			}
		},
		{
			columnName: 'Price',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.price },
			columnSorter: (l, r) => stringSorter(l.price, r.price),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.price, q) }
		},
		{
			columnName: 'Obtained From',
			columnAlignment: 'center',
			defaultColumnSize: { type: 'fr', fractions: 1 },

			columnRenderer: { type: 'text', textCreator: (v) => v.obtainedFrom },
			columnSorter: (l, r) => stringSorter(l.obtainedFrom, r.obtainedFrom),
			columnSearcher: { type: 'filter', filter: (v, q) => stringFilter(v.obtainedFrom, q) }
		}
	]}
>
	{#snippet singleSelectActions(selectedItem)}
		<TableViewSelectAction iconType="edit" onClick={() => onEditClick(selectedItem[0].id)}>
			Edit
		</TableViewSelectAction>
	{/snippet}
</TableView>
