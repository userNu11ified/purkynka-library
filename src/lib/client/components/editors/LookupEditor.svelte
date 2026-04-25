<script lang="ts">
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { onMount } from 'svelte';
	import { trapFocus } from '../attachments/focus_trap.svelte';
	import Editor from '../editor/Editor.svelte';
	import EditorAction from '../editor/EditorAction.svelte';
	import { EditorFieldIntegerState } from '../editor/inputs/state/editor_field_integer_state.svelte';
	import { EditorFieldStringState } from '../editor/inputs/state/editor_field_string_state.svelte';
	import EditorSingleColumnLayout from '../editor/layout/EditorSingleColumnLayout.svelte';
	import EditorIntegerInputLine from '../editor/premade_lines/EditorIntegerInputLine.svelte';
	import EditorStringInputLine from '../editor/premade_lines/EditorStringInputLine.svelte';
	import Modal from '../Modal.svelte';
	import { EditorPageStates } from './editor_page_states.svelte';
	import { Result } from '$shared/types/result';
	import { clientLogger } from '$client/client_loggers';

	const editorPageStates = EditorPageStates.context.get();
	const lookupEditorState = $derived(editorPageStates.lookupEditorState!);

	const librarianData = LibrarianData.context.get();
	const editingData = $derived.by(() => {
		if (lookupEditorState.type === 'bookName') return librarianData.bookNames;
		else if (lookupEditorState.type === 'authorName') return librarianData.authorNames;
		else if (lookupEditorState.type === 'publisher') return librarianData.publishers;
		else if (lookupEditorState.type === 'placeOfPublishing')
			return librarianData.placesOfPublishing;
		else if (lookupEditorState.type === 'obtainedFrom') return librarianData.obtainedFrom;
		else return librarianData.discardReasons;
	});
	const editedValue = $derived(editingData.getValueByIdOrNull(lookupEditorState.id)!);

	const editorState = $state({
		id: new EditorFieldIntegerState('ID', {
			inputOptions: { disabled: true, width: '128px', textAlignment: 'center' },
			required: true
		}),
		value: new EditorFieldStringState('Název', { required: true })
	});

	const hasErrors = $derived(
		Object.values(editorState).some((v) => v.parsed.parseErrors.length !== 0)
	);

	let showLoading = $state(false);

	const onCancelClick = () => history.back();
	const onSaveClick = async () => {
		showLoading = true;

		const id = editorState.id.getParsedValue()!;
		const newValue = {
			value: editorState.value.getParsedValue()!
		};

		const patchResult = await editingData.patch({ ids: [id], newValue });
		if (Result.isError(patchResult)) {
			clientLogger.fatal('Failed to PATCH lookup!', { error: patchResult.value });
			throw new Error();
		}

		showLoading = false;

		history.back();
	};

	onMount(() => {
		editorState.id.setFromValue(lookupEditorState.id);
		editorState.value.setFromValue(editedValue.value);
	});
</script>

<Modal onClickOutside={() => history.back()}>
	<Editor {showLoading} {@attach trapFocus(1)}>
		{#snippet title()}
			Upravit
		{/snippet}

		{#snippet fields()}
			<EditorSingleColumnLayout>
				<EditorIntegerInputLine state={editorState.id}></EditorIntegerInputLine>
				<EditorStringInputLine state={editorState.value}></EditorStringInputLine>
			</EditorSingleColumnLayout>
		{/snippet}

		{#snippet actions()}
			<EditorAction actionColor="error" onClick={onCancelClick}>Zrušit</EditorAction>
			<EditorAction actionColor="success" disabled={hasErrors} onClick={onSaveClick}
				>Uložit</EditorAction
			>
		{/snippet}
	</Editor>
</Modal>
