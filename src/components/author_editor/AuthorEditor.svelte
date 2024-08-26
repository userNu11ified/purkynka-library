<script lang="ts">
	import type { AuthorEditorContext, AuthorEditorErrorContext } from '$client/editors/author_editor';
	import { DATABASE } from '$client/database/database';
	import { REQUIRED_CHECKER } from '$client/editor/error_checkers';
	import { pixels } from '$client/style/css';
	import Editor from '$components/editor/Editor.svelte';
	import EditorAction from '$components/editor/EditorAction.svelte';
	import EditorFieldGroup from '$components/editor/fields/EditorFieldGroup.svelte';
	import EditorTextField from '$components/editor/fields/EditorTextField.svelte';
	import Vertical from '$components/editor/layouts/Vertical.svelte';
	import type { Nullable } from '$shared/common_types';
	import { onDestroy, onMount } from 'svelte';
	import { get, type Unsubscriber } from 'svelte/store';
	import { post_request } from '$client/request/request';

	let editor: Editor<any, any>;

	export let first_name: Nullable<string> = null;
	export let last_name: Nullable<string> = null;

	let editor_error_context_unsubscriber: Unsubscriber;
	let has_errors = false;

	export let cancel: () => void;
	export let submit: (id: number) => void;

	const on_click_cancel = () => cancel();
	const on_click_submit = async () => {
		if (has_errors) return;
		const author_editor_context = get(editor.editor_context) as AuthorEditorContext;

		const res = await post_request(`${window.origin}/api/v1/authors`, author_editor_context);

		if (res.ok) submit($DATABASE.authors.push(author_editor_context) - 1);
	};

	onMount(
		() =>
			(editor_error_context_unsubscriber = editor.editor_error_context.subscribe(
				(v: AuthorEditorErrorContext) => (has_errors = Object.values(v).findIndex((v) => v.size !== 0) !== -1)
			))
	);

	onDestroy(() => {
		editor_error_context_unsubscriber();
	});
</script>

<Editor bind:this={editor} editor_width={pixels(512)} editor_height={pixels(256)}>
	<svelte:fragment slot="title">Přidat autora</svelte:fragment>
	<Vertical slot="content">
		<EditorFieldGroup>
			<svelte:fragment slot="name">Jméno</svelte:fragment>
			<svelte:fragment slot="fields">
				<EditorTextField context_field="first_name" value={first_name}></EditorTextField>
			</svelte:fragment>
		</EditorFieldGroup>

		<EditorFieldGroup>
			<svelte:fragment slot="name">Příjmení</svelte:fragment>
			<svelte:fragment slot="fields">
				<EditorTextField context_field="last_name" value={last_name} error_checkers={[REQUIRED_CHECKER]}
				></EditorTextField>
			</svelte:fragment>
		</EditorFieldGroup>
	</Vertical>
	<svelte:fragment slot="action-bar">
		<EditorAction button_color="var(--error-600)" on_click={on_click_cancel}>Zrušit</EditorAction>
		<EditorAction button_color="var(--success-600)" on_click={on_click_submit} disabled={has_errors}
			>Přidat</EditorAction
		>
	</svelte:fragment>
</Editor>
