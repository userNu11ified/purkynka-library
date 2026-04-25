<script lang="ts">
	import { stringFilter, stringFilterEqual } from '$client/collation/filters';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { onMount } from 'svelte';
	import { trapFocus } from '../attachments/focus_trap.svelte';
	import Editor from '../editor/Editor.svelte';
	import EditorAction from '../editor/EditorAction.svelte';
	import { EditorFieldIntegerState } from '../editor/inputs/state/editor_field_integer_state.svelte';
	import {
		createEditorFieldSearchableStateParser,
		EditorFieldSearchableState
	} from '../editor/inputs/state/editor_field_searchable_state.svelte';
	import { EditorFieldSelectState } from '../editor/inputs/state/editor_field_select_state.svelte';
	import { EditorFieldStringState } from '../editor/inputs/state/editor_field_string_state.svelte';
	import EditorSingleColumnLayout from '../editor/layout/EditorSingleColumnLayout.svelte';
	import EditorIntegerInputLine from '../editor/premade_lines/EditorIntegerInputLine.svelte';
	import EditorSearchableInputLine from '../editor/premade_lines/EditorSearchableInputLine.svelte';
	import EditorSelectInputLine from '../editor/premade_lines/EditorSelectInputLine.svelte';
	import EditorStringInputLine from '../editor/premade_lines/EditorStringInputLine.svelte';
	import Modal from '../Modal.svelte';
	import { EditorPageStates } from './editor_page_states.svelte';
	import { clientLogger } from '$client/client_loggers';
	import { Result } from '$shared/types/result';
	import { failedToPostSearchableFields } from '$shared/error/book_editor';
	import type { ReaderInsert } from '$shared/database/tables/readers_table';

	const librarianData = LibrarianData.context.get();

	const editorPageStates = EditorPageStates.context.get();
	const userEditorState = $derived(editorPageStates.userEditorState!);

	const editorState = $state({
		id: new EditorFieldIntegerState('ID', {
			inputOptions: { width: '128px', disabled: true, textAlignment: 'center' },
			required: true
		}),
		readerName: new EditorFieldStringState('Jméno čtenáře', { required: true }),
		readerClass: new EditorFieldSearchableState('Třída čtenáře', {
			list: {
				searchIn: librarianData.readerClasses.getArray(),
				textCreator: ({ value }) => value,
				filter: (v, q) => stringFilter(v.item.value, q),
				matcher: (v, q) => stringFilterEqual(v.item.value, q)
			},
			required: true
		}),
		readerType: new EditorFieldSelectState('Typ čtenáře', {
			options: ['S', 'T'],
			textCreator: (item) => item,
			titleCreator: (item) => item,
			required: true
		})
	});

	const hasErrors = $derived(
		Object.values(editorState).some((v) => v.parsed.parseErrors.length !== 0)
	);

	const fillEditorStateNew = () => {
		editorState.readerType.setFromIndex(0);

		const lastUser = librarianData.readers.getArray().at(-1);
		if (lastUser === undefined) return editorState.id.setFromValue(1);
		else editorState.id.setFromValue(lastUser.id + 1);
	};

	const fillEditorStateOld = (userId: number) => {
		const reader = librarianData.readers.getValueByIdOrNull(userId);
		if (reader === null) {
			clientLogger.fatal('Tried editing non-existent user!');
			throw new Error();
		}

		editorState.id.setFromValue(reader.id);
		editorState.readerName.setFromValue(reader.readerName);
		editorState.readerClass.setFromListItem(
			librarianData.readerClasses.getValueByIdOrNull(reader.readerClassId)
		);
		editorState.readerType.setFromValue(reader.readerType);
	};

	const parseReaderClass = createEditorFieldSearchableStateParser(
		librarianData.readerClasses,
		(value) => ({ value })
	);

	const parseReader = async () => {
		const { readerName, readerClass, readerType } = editorState;

		const parsedReaderClass = await parseReaderClass(readerClass);
		if (Result.isError(parsedReaderClass))
			return Result.error(failedToPostSearchableFields({ errors: [parsedReaderClass.value] }));

		const newReader: ReaderInsert = {
			readerName: readerName.getParsedValue()!,
			readerClassId: parsedReaderClass.value!.id,
			readerType: readerType.getParsedValue()! as 'S' | 'T'
		};

		return Result.ok(newReader);
	};

	let showLoading = $state(false);

	const onCancelClick = () => history.back();

	const onAddClick = async () => {
		showLoading = true;

		const readerParseResult = await parseReader();
		if (Result.isError(readerParseResult)) {
			clientLogger.fatal('Failed to parse new reader!', { error: readerParseResult.value });
			throw new Error();
		}

		const parsedReader = readerParseResult.value;
		const readerPostResult = await librarianData.readers.post([parsedReader]);
		if (Result.isError(readerPostResult)) {
			clientLogger.fatal('Failed to POST reader!', { error: readerPostResult.value });
			throw new Error();
		}

		showLoading = false;

		history.back();
	};

	const onSaveClick = async () => {
		showLoading = true;

		const readerParseResult = await parseReader();
		if (Result.isError(readerParseResult)) {
			clientLogger.fatal('Failed to parse new reader!', { error: readerParseResult.value });
			throw new Error();
		}

		const parsedReader = readerParseResult.value;
		const readerPostResult = await librarianData.readers.patch({
			ids: [editorState.id.getParsedValue()!],
			newValue: parsedReader
		});
		if (Result.isError(readerPostResult)) {
			clientLogger.fatal('Failed to PATCH reader!', { error: readerPostResult.value });
			throw new Error();
		}

		showLoading = false;

		history.back();
	};

	onMount(() => {
		if (userEditorState.type === 'new') fillEditorStateNew();
		else fillEditorStateOld(userEditorState.userId);
	});
</script>

<Modal onClickOutside={() => history.back()}>
	<Editor {showLoading} {@attach trapFocus(0)}>
		{#snippet title()}
			{userEditorState.type === 'new' ? 'Přidat čtenáře' : 'Upravit čtenáře'}
		{/snippet}

		{#snippet fields()}
			<EditorSingleColumnLayout>
				<EditorIntegerInputLine state={editorState.id}></EditorIntegerInputLine>
				<EditorStringInputLine state={editorState.readerName}></EditorStringInputLine>
				<EditorSearchableInputLine state={editorState.readerClass}></EditorSearchableInputLine>
				<EditorSelectInputLine state={editorState.readerType}></EditorSelectInputLine>
			</EditorSingleColumnLayout>
		{/snippet}

		{#snippet actions()}
			<EditorAction actionColor="error" onClick={onCancelClick}>Zrušit</EditorAction>
			{#if userEditorState.type === 'new'}
				<EditorAction actionColor="success" disabled={hasErrors} onClick={onAddClick}
					>Přidat</EditorAction
				>
			{:else if userEditorState.type === 'edit'}
				<EditorAction actionColor="success" disabled={hasErrors} onClick={onSaveClick}
					>Uložit</EditorAction
				>
			{/if}
		{/snippet}
	</Editor>
</Modal>
