<script lang="ts">
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import { onMount } from 'svelte';
	import { EditorFieldIntegerState } from '../editor/inputs/state/editor_field_integer_state.svelte';
	import { EditorFieldStringState } from '../editor/inputs/state/editor_field_string_state.svelte';
	import Modal from '../Modal.svelte';
	import Editor from '../editor/Editor.svelte';
	import { trapFocus } from '../attachments/focus_trap.svelte';
	import EditorAction from '../editor/EditorAction.svelte';
	import { Result } from '$shared/types/result';
	import { clientLogger } from '$client/client_loggers';
	import EditorSingleColumnLayout from '../editor/layout/EditorSingleColumnLayout.svelte';
	import EditorIntegerInputLine from '../editor/premade_lines/EditorIntegerInputLine.svelte';
	import EditorStringInputLine from '../editor/premade_lines/EditorStringInputLine.svelte';

	const librarianData = LibrarianData.context.get();
	const editorState = $state({
		id: new EditorFieldIntegerState('ID', {
			inputOptions: { width: '128px', textAlignment: 'center', disabled: true }
		}),
		email: new EditorFieldStringState('Email', {
			required: true
		})
	});

	const onCancelClick = () => history.back();

	const onAddClick = async () => {
		const librarianPostResult = await librarianData.librarians.post([
			{ id: editorState.id.getParsedValue()!, email: editorState.email.getParsedValue()! }
		]);
		if (Result.isError(librarianPostResult)) {
			clientLogger.fatal('Failed to POST librarian!', { error: librarianPostResult.value });
			throw new Error();
		}

		history.back();
	};

	onMount(() => {
		const lastLibrarian = librarianData.librarians.getArray().at(-1);
		const usedId = (lastLibrarian?.id ?? 0) + 1;
		editorState.id.setFromValue(usedId);
	});
</script>

<Modal onClickOutside={() => history.back()}>
	<Editor {@attach trapFocus(1)}>
		{#snippet title()}
			Add Librarian
		{/snippet}

		{#snippet fields()}
			<EditorSingleColumnLayout>
				<EditorIntegerInputLine state={editorState.id}></EditorIntegerInputLine>
				<EditorStringInputLine state={editorState.email}></EditorStringInputLine>
			</EditorSingleColumnLayout>
		{/snippet}

		{#snippet actions()}
			<EditorAction actionColor="error" onClick={onCancelClick}>Cancel</EditorAction>
			<EditorAction actionColor="success" onClick={onAddClick}>Add</EditorAction>
		{/snippet}
	</Editor>
</Modal>
