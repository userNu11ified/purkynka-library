<script lang="ts">
	import { DATABASE } from '$client/database/database';
	import { REQUIRED_CHECKER } from '$client/editor/error_checkers';
	import { pixels } from '$client/style/css';
	import Editor from '$components/editor/Editor.svelte';
	import EditorAction from '$components/editor/EditorAction.svelte';
	import EditorFieldGroup from '$components/editor/fields/EditorFieldGroup.svelte';
	import EditorTextField from '$components/editor/fields/EditorTextField.svelte';
	import Vertical from '$components/editor/layouts/Vertical.svelte';
	import type { ID, Nullable } from '$shared/common_types';
	import { onDestroy, onMount } from 'svelte';
	import { get, type Unsubscriber } from 'svelte/store';
	import {
		CURRENTLY_EDITING_READER,
		type ReaderEditorContext,
		type ReaderEditorErrorContext
	} from '$client/editors/reader_editor';
	import EditorSearchableTextField from '$components/editor/fields/EditorSearchableTextField.svelte';
	import { string_compare } from '$shared/common_util';
	import { map_or_null } from '$shared/book_util';
	import { post_request, put_request } from '$client/request/request';

	let editor: Editor<any, any>;

	const [edit_type, reader_id] = $CURRENTLY_EDITING_READER!;

	export let name: Nullable<string> = null;
	export let class_name: Nullable<string> = null;

	if (edit_type === 'Upravit čtenáře') {
		const reader = $DATABASE.readers.find((v) => v.id === reader_id)!;
		name = reader.name;
		class_name = map_or_null<string>($DATABASE, 'reader_classes', reader.class_name);
	}

	let editor_error_context_unsubscriber: Unsubscriber;
	let has_errors = false;

	export let cancel: () => void;
	export let submit: (id: number) => void;

	const on_click_cancel = () => cancel();

	const parse_context_data = async () => {
		const reader_editor_context = get(editor.editor_context) as ReaderEditorContext;
		reader_editor_context['id'] = +reader_editor_context['id'] as ID;

		const class_name = reader_editor_context['class_name'];
		if (typeof class_name === 'number') return reader_editor_context;

		const res = await post_request(`${window.origin}/api/v1/reader-classes`, class_name);

		if (res.ok) {
			reader_editor_context['class_name'] = ($DATABASE.reader_classes.push(class_name) - 1) as ID;
			return reader_editor_context;
		}
	};

	const on_click_add = async () => {
		if (has_errors) return;

		const reader_editor_context = (await parse_context_data()) as ReaderEditorContext;

		const res = await post_request(`${window.origin}/api/v1/readers`, reader_editor_context);

		if (res.ok) {
			submit($DATABASE.readers.push(reader_editor_context) - 1);
		}
	};

	const on_click_save = async () => {
		if (has_errors) return;

		const reader_editor_context = (await parse_context_data()) as ReaderEditorContext;

		const res = await put_request(`${window.origin}/api/v1/readers/${reader_id}`, reader_editor_context);

		if (res.ok) {
			$DATABASE.readers[$DATABASE.readers.findIndex((v) => v.id === reader_id)] = reader_editor_context;
			submit(reader_id);
		}
	};

	onMount(
		() =>
			(editor_error_context_unsubscriber = editor.editor_error_context.subscribe(
				(v: ReaderEditorErrorContext) => (has_errors = Object.values(v).findIndex((v) => v.size !== 0) !== -1)
			))
	);

	onDestroy(() => {
		editor_error_context_unsubscriber();
	});
</script>

<Editor bind:this={editor} editor_width={pixels(512)}>
	<svelte:fragment slot="title">{edit_type}</svelte:fragment>
	<Vertical slot="content">
		<EditorFieldGroup>
			<svelte:fragment slot="name">ID</svelte:fragment>
			<svelte:fragment slot="fields">
				<EditorTextField context_field="id" value={`${reader_id}`} width={pixels(128)} center disabled
				></EditorTextField>
			</svelte:fragment>
		</EditorFieldGroup>

		<EditorFieldGroup>
			<svelte:fragment slot="name">Jméno</svelte:fragment>
			<svelte:fragment slot="fields">
				<EditorTextField context_field="name" value={name} error_checkers={[REQUIRED_CHECKER]}></EditorTextField>
			</svelte:fragment>
		</EditorFieldGroup>

		<EditorFieldGroup>
			<svelte:fragment slot="name">Třída / Zkratka</svelte:fragment>
			<svelte:fragment slot="fields">
				<EditorSearchableTextField
					context_field="class_name"
					value={class_name}
					error_checkers={[REQUIRED_CHECKER]}
					items={$DATABASE.reader_classes}
					sorter={(left, right) => string_compare(left[1], right[1])}
				></EditorSearchableTextField>
			</svelte:fragment>
		</EditorFieldGroup>
	</Vertical>
	<svelte:fragment slot="action-bar">
		<EditorAction button_color="var(--error-600)" on_click={on_click_cancel}>Zrušit</EditorAction>
		{#if edit_type === 'Přidat čtenáře'}
			<EditorAction button_color="var(--success-600)" on_click={on_click_add} disabled={has_errors}>Přidat</EditorAction
			>
		{:else}
			<EditorAction button_color="var(--success-600)" on_click={on_click_save} disabled={has_errors}
				>Uložit</EditorAction
			>
		{/if}
	</svelte:fragment>
</Editor>
