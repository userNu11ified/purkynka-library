<script lang="ts" module>
	export const mergeEditorSubmitCallbacks = new EditorCallbackHandler<[number, number[]]>();
</script>

<script lang="ts">
	import { trapFocus } from '../attachments/focus_trap.svelte';
	import Editor from '../editor/Editor.svelte';
	import { EditorCallbackHandler } from '../editor/editor_callback_handler.svelte';
	import EditorAction from '../editor/EditorAction.svelte';
	import InfiniteList from '../infinite_list/InfiniteList.svelte';
	import Modal from '../Modal.svelte';
	import { EditorPageStates } from './editor_page_states.svelte';

	const editorPageStates = EditorPageStates.context.get();
	const mergeEditorState = $derived(editorPageStates.mergeEditorState!);

	// svelte-ignore state_referenced_locally
	let selectedIndex = $state(mergeEditorState.values[0][1]);

	let showLoading = $state(false);

	const onCancelClick = () => history.back();
	const onMergeClick = () => {
		showLoading = true;

		mergeEditorSubmitCallbacks.callbacks.forEach((v) =>
			v([selectedIndex, mergeEditorState.values.map((v) => v[1])])
		);

		showLoading = false;

		history.back();
	};
</script>

<Modal onClickOutside={() => history.back()}>
	<Editor {showLoading} {@attach trapFocus(1)}>
		{#snippet title()}
			Merge
		{/snippet}

		{#snippet fields()}
			<div class="merge-list">
				<InfiniteList items={mergeEditorState.values} itemHeight={48}>
					{#snippet listRow([v, i])}
						<button
							class="merge-list-item fill-container"
							class:selected={i === selectedIndex}
							onclick={() => (selectedIndex = i)}
						>
							{v}
						</button>
					{/snippet}
				</InfiniteList>
			</div>
		{/snippet}

		{#snippet actions()}
			<EditorAction actionColor="error" onClick={onCancelClick}>Cancel</EditorAction>
			<EditorAction actionColor="success" onClick={onMergeClick}>Merge</EditorAction>
		{/snippet}
	</Editor>
</Modal>

<style>
	.merge-list {
		width: 512px;
		height: 512px;

		border: var(--border);
		border-radius: 4px;
	}

	.merge-list-item {
		padding-inline: 12px;

		text-align: left;
		font-size: 16px;
		font-weight: 500;
	}

	.merge-list-item.selected {
		color: var(--information-color);
	}
</style>
