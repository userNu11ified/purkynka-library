<script lang="ts" module>
	export const udcEditorCancelCallbacks = new EditorCallbackHandler();
	export const udcEditorSubmitCallbacks = new EditorCallbackHandler<UDCSelect>();
</script>

<script lang="ts">
	import { clientLogger } from '$client/client_loggers';
	import type { UDCInsert, UDCSelect } from '$shared/database/tables/shorthand_tables';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { Result } from '$shared/types/result';
	import Editor from '../editor/Editor.svelte';
	import { EditorCallbackHandler } from '../editor/editor_callback_handler.svelte';
	import EditorAction from '../editor/EditorAction.svelte';
	import { EditorFieldStringState } from '../editor/inputs/state/editor_field_string_state.svelte';
	import EditorSingleColumnLayout from '../editor/layout/EditorSingleColumnLayout.svelte';
	import EditorStringInputLine from '../editor/premade_lines/EditorStringInputLine.svelte';
	import Modal from '../Modal.svelte';
	import { EditorPageStates } from './editor_page_states.svelte';

	const librarianData = LibrarianData.context.get();
	const editorPageStates = EditorPageStates.context.get();
	const udcEditorState = $derived(editorPageStates.udcEditorState!);

	const editorState = $state({
		shortName: new EditorFieldStringState('Short Name', { required: true }),
		longName: new EditorFieldStringState('Long Name', { required: true })
	});

	const hasErrors = $derived(
		Object.values(editorState).some((v) => v.parsed.parseErrors.length !== 0)
	);

	const onClickCancel = () => {
		history.back();
		udcEditorCancelCallbacks.callbacks.forEach((v) => v());
	};

	const onClickAdd = async () => {
		if (hasErrors) return;
		await librarianData.loaded;

		const udcInsert: UDCInsert[] = [
			{
				shortName: editorState.shortName.parsed.parsedValue!,
				longName: editorState.longName.parsed.parsedValue!
			}
		];

		const udcInsertResult = await librarianData.udc.post(udcInsert);
		if (Result.isError(udcInsertResult)) {
			clientLogger.fatal('Failed to add UDC!', { udcInsertResult });
			throw new Error();
		}

		udcEditorSubmitCallbacks.callbacks.forEach((v) => v(udcInsertResult.value[0]));
		history.back();
	};

	const onClickSave = () => {};
</script>

<Modal
	onClickOutside={() => {
		history.back();
	}}
>
	{#await librarianData.loaded}
		<h1>Loading</h1>
	{:then}
		<Editor>
			{#snippet title()}
				{udcEditorState.type === 'new' ? 'Add UDC' : 'Edit UDC'}
			{/snippet}

			{#snippet fields()}
				<EditorSingleColumnLayout>
					<EditorStringInputLine state={editorState.shortName}></EditorStringInputLine>
					<EditorStringInputLine state={editorState.longName}></EditorStringInputLine>
				</EditorSingleColumnLayout>
			{/snippet}

			{#snippet actions()}
				<EditorAction actionColor="error" onClick={onClickCancel}>Cancel</EditorAction>
				{#if udcEditorState.type === 'new'}
					<EditorAction actionColor="success" disabled={hasErrors} onClick={onClickAdd}>
						Add
					</EditorAction>
				{:else}
					<EditorAction actionColor="success" disabled={hasErrors} onClick={onClickSave}>
						Save
					</EditorAction>
				{/if}
			{/snippet}
		</Editor>
	{/await}
</Modal>
