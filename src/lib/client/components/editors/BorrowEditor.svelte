<script lang="ts">
	import { pushState } from '$app/navigation';
	import { stringFilter, stringFilterEqual } from '$client/collation/filters';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { onMount, tick } from 'svelte';
	import { trapFocus } from '../attachments/focus_trap.svelte';
	import Editor from '../editor/Editor.svelte';
	import EditorAction from '../editor/EditorAction.svelte';
	import EditorInput from '../editor/inputs/EditorInput.svelte';
	import EditorToggleInput from '../editor/inputs/EditorToggleInput.svelte';
	import { EditorFieldDateState } from '../editor/inputs/state/editor_field_date_state.svelte';
	import { EditorFieldIntegerState } from '../editor/inputs/state/editor_field_integer_state.svelte';
	import { EditorFieldSearchableState } from '../editor/inputs/state/editor_field_searchable_state.svelte';
	import { EditorFieldState } from '../editor/inputs/state/editor_field_state.svelte';
	import { EditorFieldStringState } from '../editor/inputs/state/editor_field_string_state.svelte';
	import EditorSingleColumnLayout from '../editor/layout/EditorSingleColumnLayout.svelte';
	import EditorDateInputLine from '../editor/premade_lines/EditorDateInputLine.svelte';
	import EditorIntegerInputLine from '../editor/premade_lines/EditorIntegerInputLine.svelte';
	import EditorSearchableInputLine from '../editor/premade_lines/EditorSearchableInputLine.svelte';
	import Modal from '../Modal.svelte';
	import { EditorPageStates } from './editor_page_states.svelte';
	import Icon from '../icon/Icon.svelte';
	import { watch } from 'runed';
	import { clientLogger } from '$client/client_loggers';
	import { Result } from '$shared/types/result';
	import { page } from '$app/state';

	const librarianData = LibrarianData.context.get();
	const editorPageStates = EditorPageStates.context.get();
	const borrowEditorState = $derived(editorPageStates.borrowEditorState!);

	const digitRegex = /\d/;
	const editorState = $state({
		borrowId: new EditorFieldIntegerState('Borrow ID', {
			inputOptions: { width: '128px', textAlignment: 'center', disabled: true },
			required: true
		}),
		bookId: new EditorFieldIntegerState('Book', {
			inputOptions: { width: '128px', textAlignment: 'center', disabled: true },
			required: true
		}),
		bookName: new EditorFieldStringState('Book Name', {
			inputOptions: { disabled: true }
		}),
		reader: new EditorFieldSearchableState('Reader', {
			list: {
				searchIn: librarianData.readers.getArray(),
				textCreator: (v) => v.readerName,
				identifierCreator: (v) =>
					librarianData.readerClasses.getValueByIdOrNull(v.readerClassId)!.value,
				filter: (v, q) =>
					stringFilter(v.item.readerName, q) ||
					stringFilter(`${v.identifier}`, q) ||
					stringFilter(`${v.identifier} ${v.item.readerName}`, q),
				matcher: (v, q) =>
					stringFilterEqual(v.item.readerName, q) ||
					(!digitRegex.test(`${v.identifier}`) && stringFilterEqual(`${v.identifier}`, q)) ||
					stringFilterEqual(`${v.identifier} ${v.item.readerName}`, q),
				onSpecialAdderClick: () =>
					pushState('', { ...page.state, userEditorState: { type: 'new' } })
			},
			required: true
		}),
		borrowDate: new EditorFieldDateState('Borrow Date', {
			inputOptions: { width: '128px', textAlignment: 'center' },
			required: true
		}),
		returnDate: new EditorFieldDateState('Return Date', {
			inputOptions: { width: '128px', textAlignment: 'center', disabled: true }
		}),
		permanent: false
	});

	const hasErrors = $derived(
		Object.values(editorState).some(
			(v) => v instanceof EditorFieldState && v.parsed.parseErrors.length !== 0
		)
	);

	const onCancelClick = () => history.back();
	const onBorrowClick = async () => {
		const reader = editorState.reader.getParsedValue();
		if (reader === null || reader.type === 'new') {
			clientLogger.fatal('Reader Input in invalid state!');
			throw new Error();
		}

		const borrowPostResult = await librarianData.borrows.post([
			{
				bookId: editorState.bookId.getParsedValue()!,
				readerId: reader.value.item.id,
				borrowDate: editorState.borrowDate.getParsedValue()!,
				permanent: editorState.permanent
			}
		]);
		if (Result.isError(borrowPostResult)) {
			clientLogger.fatal('Failed to POST borrow');
			throw new Error();
		}

		const borrow = borrowPostResult.value[0];

		const borrowHistoryResult = await librarianData.borrowHistory.post([
			{
				id: borrow.id,
				bookId: borrow.bookId,
				borrowDate: borrow.borrowDate,
				permanent: borrow.permanent,
				readerName: reader.value.item.readerName,
				readerClass: librarianData.readerClasses.getValueByIdOrNull(
					reader.value.item.readerClassId
				)!.value,
				timesExtended: borrow.timesExtended
			}
		]);
		if (Result.isError(borrowHistoryResult)) {
			clientLogger.fatal('Failed to POST borrow history');
			throw new Error();
		}

		history.back();
	};

	watch(
		() => editorState.borrowDate.parsed,
		(a) => {
			const borrowDate = a.parsedValue;
			if (borrowDate === null) editorState.returnDate.setFromValue(null);
			else {
				const year = borrowDate.getFullYear();
				const month = borrowDate.getMonth();
				const day = borrowDate.getDate();
				editorState.returnDate.setFromValue(new Date(year, month + 1, day));
			}
		}
	);

	onMount(async () => {
		await librarianData.loaded;
		await tick();

		const ids = librarianData.borrowHistory.getArray().map((v) => v.id);
		ids.sort();

		const borrowId = ids.at(-1)! + 1;
		editorState.borrowId.setFromValue(borrowId);

		const book = librarianData.books.getValueByIdOrNull(borrowEditorState.bookId)!;
		editorState.bookId.setFromValue(borrowEditorState.bookId);
		editorState.bookName.setFromValue(
			librarianData.bookNames.getValueByIdOrNull(book.bookNameId)!.value
		);
		editorState.borrowDate.setFromValue(new Date());
	});
</script>

<Modal
	onClickOutside={() => {
		if (!editorPageStates.userEditorActive) history.back();
	}}
>
	<Editor {@attach trapFocus(0)}>
		{#snippet title()}
			Borrow Book
		{/snippet}

		{#snippet fields()}
			<EditorSingleColumnLayout>
				<EditorIntegerInputLine state={editorState.borrowId}></EditorIntegerInputLine>
				<EditorIntegerInputLine state={editorState.bookId}>
					<EditorInput state={editorState.bookName}></EditorInput>
				</EditorIntegerInputLine>
				<EditorSearchableInputLine state={editorState.reader}></EditorSearchableInputLine>
				<EditorDateInputLine state={editorState.borrowDate}>
					<div class="to-icon center-grid">
						<Icon iconType="chevron-right" width={32}></Icon>
					</div>
					<EditorInput state={editorState.returnDate}></EditorInput>
					<EditorToggleInput bind:toggled={editorState.permanent}>P</EditorToggleInput>
				</EditorDateInputLine>
			</EditorSingleColumnLayout>
		{/snippet}

		{#snippet actions()}
			<EditorAction actionColor="error" onClick={onCancelClick}>Cancel</EditorAction>
			<EditorAction actionColor="success" disabled={hasErrors} onClick={onBorrowClick}
				>Borrow</EditorAction
			>
		{/snippet}
	</Editor>
</Modal>

<style>
</style>
