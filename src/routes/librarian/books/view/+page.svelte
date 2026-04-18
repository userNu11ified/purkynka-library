<script lang="ts">
	import { MINIMUM_COLUMN_WIDTH } from '$client/components/table_view/logic/table_view_column_sizing';
	import TableView from '$client/components/table_view/TableView.svelte';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';

	const librarianData = LibrarianData.getContext();
</script>

<TableView
	renderAfterResolved={librarianData.loaded}
	columns={[
		{ columnName: 'ID', defaultColumnSize: { type: 'fr', fractions: 1 } },
		{ columnName: '', defaultColumnSize: { type: 'px', pixels: MINIMUM_COLUMN_WIDTH } },
		{ columnName: 'Book Name', defaultColumnSize: { type: 'fr', fractions: 1 } },
		{ columnName: 'Author', defaultColumnSize: { type: 'fr', fractions: 1 } },
		{ columnName: 'Annotation', defaultColumnSize: { type: 'fr', fractions: 1 } },
		{ columnName: 'UDC', defaultColumnSize: { type: 'fr', fractions: 1 } },
		{ columnName: 'Note', defaultColumnSize: { type: 'fr', fractions: 1 } },
		{ columnName: 'Borrowed', defaultColumnSize: { type: 'fr', fractions: 1 } },
		{ columnName: 'Discarded', defaultColumnSize: { type: 'fr', fractions: 1 } }
	]}
></TableView>
