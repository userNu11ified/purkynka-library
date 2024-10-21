<script lang="ts">
	import type { EditorErrorContext } from '$client/editor/editor';
	import { NUMBER_CHECKER, REQUIRED_CHECKER } from '$client/editor/error_checkers';
	import type { CopyPartEditorContext } from '$client/editors/copy_part_editor';
	import { pixels } from '$client/style/css';
	import Editor from '$components/editor/Editor.svelte';
	import EditorAction from '$components/editor/EditorAction.svelte';
	import EditorFieldGroup from '$components/editor/fields/EditorFieldGroup.svelte';
	import EditorTextField from '$components/editor/fields/EditorTextField.svelte';
	import Vertical from '$components/editor/layouts/Vertical.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { get, type Unsubscriber } from 'svelte/store';
	let editor: Editor<any, any>;

	export let cancel: () => void;
	export let submit: (ids: number[]) => void;

	let editor_error_context_unsubscriber: Unsubscriber;
	let has_errors = false;

	const on_click_cancel = () => cancel();
	const on_click_submit = () => {
		if (has_errors) return;

		const copy_part_editor_context = get(editor.editor_context) as CopyPartEditorContext;
		const from = +copy_part_editor_context.from - 1;
		const to = +copy_part_editor_context.to - 1;

		const lower_to_higher = from <= to;

		const ids: number[] = [];

		if (lower_to_higher) {
			for (let i = from; i <= to; i++) ids.push(i);
		} else {
			for (let i = from; i >= to; i--) ids.push(i);
		}

		submit(ids);
	};

	onMount(
		() =>
			(editor_error_context_unsubscriber = editor.editor_error_context.subscribe(
				(v: EditorErrorContext) => (has_errors = Object.values(v).findIndex((v) => v.size !== 0) !== -1)
			))
	);

	onDestroy(() => editor_error_context_unsubscriber());
</script>

<Editor bind:this={editor} editor_width={pixels(512)} editor_height={pixels(256)}>
	<svelte:fragment slot="title">Zkopírovat část seznamu</svelte:fragment>
	<Vertical slot="content">
		<EditorFieldGroup>
			<svelte:fragment slot="name">Začátek</svelte:fragment>
			<svelte:fragment slot="fields">
				<EditorTextField context_field="from" value={null} error_checkers={[REQUIRED_CHECKER, NUMBER_CHECKER]} />
			</svelte:fragment>
		</EditorFieldGroup>
		<EditorFieldGroup>
			<svelte:fragment slot="name">Konec</svelte:fragment>
			<svelte:fragment slot="fields">
				<EditorTextField context_field="to" value={null} error_checkers={[REQUIRED_CHECKER, NUMBER_CHECKER]} />
			</svelte:fragment>
		</EditorFieldGroup>
	</Vertical>
	<svelte:fragment slot="action-bar">
		<EditorAction button_color="var(--error-600)" on_click={on_click_cancel}>Zrušit</EditorAction>
		<EditorAction button_color="var(--success-600)" on_click={on_click_submit}>Zkopírovat</EditorAction>
	</svelte:fragment>
</Editor>
