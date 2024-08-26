<script lang="ts">
	import { DATABASE } from '$client/database/database';
	import { REQUIRED_CHECKER } from '$client/editor/error_checkers';
	import { pixels } from '$client/style/css';
	import { CURRENTLY_EDITING_UDC, type UDCEditorContext, type UDCEditorErrorContext } from '$client/editors/udc_editor';
	import Editor from '$components/editor/Editor.svelte';
	import EditorAction from '$components/editor/EditorAction.svelte';
	import EditorFieldGroup from '$components/editor/fields/EditorFieldGroup.svelte';
	import EditorTextField from '$components/editor/fields/EditorTextField.svelte';
	import Vertical from '$components/editor/layouts/Vertical.svelte';
	import type { Nullable } from '$shared/common_types';
	import { onDestroy, onMount } from 'svelte';
	import { get, type Unsubscriber } from 'svelte/store';
	import { post_request, put_request } from '$client/request/request';

	let editor: Editor<any, any>;
	const [edit_type, udc_id] = $CURRENTLY_EDITING_UDC ?? ['Přidat MDT', null];

	export let short_name: Nullable<string> = null;
	export let long_name: Nullable<string> = null;

	if (udc_id !== null) {
		const udc = $DATABASE.udc[udc_id];
		short_name = udc.short_name;
		long_name = udc.long_name;
	}

	let editor_error_context_unsubscriber: Unsubscriber;
	let has_errors = false;

	export let cancel: () => void;
	export let submit: (id: number) => void;

	const on_click_cancel = () => cancel();
	const on_click_submit = async () => {
		if (has_errors) return;
		const udc_editor_context = get(editor.editor_context) as UDCEditorContext;

		const res = await post_request(`${window.origin}/api/v1/udc`, udc_editor_context);

		if (res.ok) {
			let new_id: number;
			DATABASE.update((v) => {
				new_id = v.udc.push(udc_editor_context) - 1;
				return v;
			});

			submit(new_id!);
		}
	};

	const on_click_save = async () => {
		if (has_errors) return;
		const udc_editor_context = get(editor.editor_context) as UDCEditorContext;

		const res = await put_request(`${window.origin}/api/v1/udc/${udc_id}`, udc_editor_context);

		if (res.ok) {
			DATABASE.update((v) => {
				v.udc[udc_id!] = udc_editor_context;
				return v;
			});

			submit(udc_id!);
		}
	};

	onMount(
		() =>
			(editor_error_context_unsubscriber = editor.editor_error_context.subscribe(
				(v: UDCEditorErrorContext) => (has_errors = Object.values(v).findIndex((v) => v.size !== 0) !== -1)
			))
	);

	onDestroy(() => {
		editor_error_context_unsubscriber();
	});
</script>

<Editor bind:this={editor} editor_width={pixels(512)} editor_height={pixels(256)}>
	<svelte:fragment slot="title">{edit_type}</svelte:fragment>
	<Vertical slot="content">
		<EditorFieldGroup>
			<svelte:fragment slot="name">Zkratka</svelte:fragment>
			<svelte:fragment slot="fields">
				<EditorTextField context_field="short_name" value={short_name} error_checkers={[REQUIRED_CHECKER]}
				></EditorTextField>
			</svelte:fragment>
		</EditorFieldGroup>

		<EditorFieldGroup>
			<svelte:fragment slot="name">Celý název</svelte:fragment>
			<svelte:fragment slot="fields">
				<EditorTextField context_field="long_name" value={long_name} error_checkers={[REQUIRED_CHECKER]}
				></EditorTextField>
			</svelte:fragment>
		</EditorFieldGroup>
	</Vertical>
	<svelte:fragment slot="action-bar">
		<EditorAction button_color="var(--error-600)" on_click={on_click_cancel}>Zrušit</EditorAction>
		{#if edit_type === 'Přidat MDT'}
			<EditorAction button_color="var(--success-600)" on_click={on_click_submit} disabled={has_errors}
				>Přidat</EditorAction
			>
		{:else if edit_type === 'Upravit MDT'}
			<EditorAction button_color="var(--success-600)" on_click={on_click_save} disabled={has_errors}
				>Uložit</EditorAction
			>
		{/if}
	</svelte:fragment>
</Editor>
