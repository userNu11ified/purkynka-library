<script lang="ts">
	import { DATABASE } from '$client/database/database';
	import { ID_REQUIRED_CHECKER, REQUIRED_CHECKER } from '$client/editor/error_checkers';
	import { CURRENTLY_EDITING_BORROW, type BorrowEditorErrorContext } from '$client/editors/borrow_editor';
	import { CURRENTLY_EDITING_READER } from '$client/editors/reader_editor';
	import type { Sorter } from '$client/list/list';
	import { post_request } from '$client/request/request';
	import { pixels, percent } from '$client/style/css';
	import Editor from '$components/editor/Editor.svelte';
	import EditorAction from '$components/editor/EditorAction.svelte';
	import EditorFieldGroup from '$components/editor/fields/EditorFieldGroup.svelte';
	import EditorSearchableTextField from '$components/editor/fields/EditorSearchableTextField.svelte';
	import EditorTextField from '$components/editor/fields/EditorTextField.svelte';
	import EditorToggle from '$components/editor/fields/EditorToggle.svelte';
	import Horizontal from '$components/editor/layouts/Horizontal.svelte';
	import Vertical from '$components/editor/layouts/Vertical.svelte';
	import Icon from '$components/icon/Icon.svelte';
	import ReaderEditor from '$components/reader_editor/ReaderEditor.svelte';
	import type { DatabaseBook } from '$shared/book_types';
	import { format_date, map_id_book, map_or_null } from '$shared/book_util';
	import type { BorrowHistory, DatabaseBorrow, DatabaseReader } from '$shared/borrow_types';
	import type { ID, Nullable } from '$shared/common_types';
	import { string_compare } from '$shared/common_util';
	import { onDestroy, onMount, tick } from 'svelte';
	import { get, type Unsubscriber, type Writable } from 'svelte/store';

	let editor: Editor<any, any>;

	let [edit_type, book_id] = $CURRENTLY_EDITING_BORROW!;

	const get_return_date = () => {
		const current_date = new Date();
		current_date.setMonth(current_date.getMonth() + 1);
		return current_date;
	};

	let borrow_id: number;
	let selected_book: Nullable<DatabaseBook> = null;
	let reader_class: Nullable<string> = null;
	let reader: Nullable<DatabaseReader> = null;
	let return_date = format_date(get_return_date());

	borrow_id = $DATABASE.borrows.length;
	selected_book = $DATABASE.books[book_id];

	let editor_error_context_unsubscriber: Unsubscriber;
	let has_errors = false;

	const book_filter = (lowercase_query: string, item: DatabaseBook) =>
		(map_or_null<string>($DATABASE, 'book_names', item.name) ?? '').toLocaleLowerCase('cs').includes(lowercase_query) ||
		item.string_id.includes(lowercase_query);

	const name_item_stringifier = (item: DatabaseBook) => map_or_null<string>($DATABASE, 'book_names', item.name)!;

	const name_sorter: Sorter<DatabaseBook> = ([left_id, left_item], [right_id, right_item]) =>
		string_compare(
			map_or_null<string>($DATABASE, 'book_names', left_item.name) ?? '',
			map_or_null<string>($DATABASE, 'book_names', right_item.name) ?? ''
		);

	const on_option_selected_book = (value: Nullable<number | string>) => {
		if (typeof value === 'number') selected_book = $DATABASE.books[value];
		else selected_book = null;
	};

	let class_input: EditorSearchableTextField<string>;
	let reader_input: EditorSearchableTextField<DatabaseReader>;

	const reader_filter = (lowercase_query: string, item: DatabaseReader) =>
		item.name.toLocaleLowerCase('cs').includes(lowercase_query) ||
		(map_or_null<string>($DATABASE, 'reader_classes', item.class_name) ?? '')
			.toLocaleLowerCase('cs')
			.includes(lowercase_query);

	const on_option_selected_class_name = (value: Nullable<number | string>) => {
		if (typeof value === 'number') {
			reader_class = map_or_null<string>($DATABASE, 'reader_classes', value as ID);

			const readers_in_class = $DATABASE.readers.filter((v) => v.class_name === value);
			if (readers_in_class.length === 1) {
				reader = readers_in_class[0];
			}
		} else {
			reader_class = null;
			reader = null;
			reader_input?.update_string_value(reader);
		}
	};

	const on_option_selected_reader = (value: Nullable<number | string>) => {
		if (typeof value === 'number') {
			reader_class = map_or_null<string>($DATABASE, 'reader_classes', $DATABASE.readers[value].class_name);
		}
	};

	const on_change_permanent = (value: boolean) => {
		if (value) {
			return_date = '—';
		} else {
			return_date = format_date(get_return_date());
		}
	};

	const cancel = () => ($CURRENTLY_EDITING_BORROW = null);
	const save = async () => {
		const editor_context = get(editor.editor_context);
		const reader = $DATABASE.readers[editor_context['reader']];

		let borrow: DatabaseBorrow = {
			id: $DATABASE.borrow_history.length,
			book: editor_context['book_id'],
			reader: reader.id,
			borrow_date: new Date().toISOString(),
			return_date: null,
			times_extended: 0,
			permanent: editor_context['permanent']
		};

		const res_borrow = await post_request(`${window.origin}/api/v1/borrows`, borrow);

		if (res_borrow.ok) {
			const res_json = await res_borrow.json();

			DATABASE.update((v) => {
				v.borrows.push(borrow);
				v.borrow_history.push(res_json);
				return v;
			});

			$CURRENTLY_EDITING_BORROW = null;
		}
	};

	const cancel_reader_editor = () => ($CURRENTLY_EDITING_READER = null);
	const submit_reader_editor = async (id: number) => {
		reader = $DATABASE.readers[id];
		reader_class = $DATABASE.reader_classes[reader.class_name];

		class_input.update_string_value(reader_class);
		reader_input.recalculate_items();

		$CURRENTLY_EDITING_READER = null;
	};

	onMount(() => {
		editor_error_context_unsubscriber = editor.editor_error_context.subscribe(
			(v: BorrowEditorErrorContext) => (has_errors = Object.values(v).findIndex((v) => v.size !== 0) !== -1)
		);

	});

	onDestroy(() => {
		editor_error_context_unsubscriber();
	});
</script>

<Editor bind:this={editor} editor_width={pixels(1024)}>
	<svelte:fragment slot="title">{edit_type}</svelte:fragment>
	<Vertical slot="content">
		<EditorFieldGroup>
			<svelte:fragment slot="name">Číslo výpůjčky</svelte:fragment>
			<svelte:fragment slot="fields">
				<EditorTextField value={`${borrow_id + 1}`} disabled center width={pixels(128)}></EditorTextField>
			</svelte:fragment>
		</EditorFieldGroup>
		<EditorFieldGroup>
			<svelte:fragment slot="name">Kniha</svelte:fragment>
			<svelte:fragment slot="fields">
				<Horizontal>
					<EditorSearchableTextField
						context_field="book_id"
						value={selected_book}
						items={$DATABASE.books}
						item_stringifier={(item) => item.string_id}
						filter={book_filter}
						sorter={([left_id, left_item], [right_id, right_item]) => left_id - right_id}
						error_checkers={[REQUIRED_CHECKER, ID_REQUIRED_CHECKER]}
						center
						width={pixels(128)}
						on_option_selected={on_option_selected_book}
						error_left
						placeholder="Přír. č..."
					>
						<svelte:fragment slot="search-result" let:id let:item>
							<div class="gray">
								{map_or_null($DATABASE, 'book_names', $DATABASE.books[id].name)}
							</div>
							{item.string_id}
						</svelte:fragment>
					</EditorSearchableTextField>
				</Horizontal>
			</svelte:fragment>
		</EditorFieldGroup>
		<EditorFieldGroup>
			<svelte:fragment slot="name">Čtenář</svelte:fragment>
			<svelte:fragment slot="fields">
				<Horizontal>
					<EditorSearchableTextField
						bind:this={class_input}
						context_field="reader_class"
						value={reader_class}
						items={$DATABASE.reader_classes}
						sorter={([left_id, left_item], [right_id, right_item]) => string_compare(left_item, right_item)}
						error_checkers={[REQUIRED_CHECKER, ID_REQUIRED_CHECKER]}
						center
						width={pixels(128)}
						error_left
						placeholder="Třída..."
						on_option_selected={on_option_selected_class_name}
					></EditorSearchableTextField>

					<EditorSearchableTextField
						bind:this={reader_input}
						option_filter={([id, item]) =>
							reader_class === null
								? true
								: map_or_null($DATABASE, 'reader_classes', $DATABASE.readers[id].class_name) === reader_class}
						context_field="reader"
						value={reader}
						items={$DATABASE.readers}
						item_stringifier={(item) => item.name}
						filter={reader_filter}
						sorter={([left_id, left_item], [right_id, right_item]) => string_compare(left_item.name, right_item.name)}
						error_checkers={[REQUIRED_CHECKER, ID_REQUIRED_CHECKER]}
						flex
						placeholder="Jméno..."
						on_option_selected={on_option_selected_reader}
						on_click_editor={(id) => ($CURRENTLY_EDITING_READER = ['Upravit čtenáře', id])}
						get_option_key={([id, item]) => `${item.class_name}-${item.name}`}
					>
						<svelte:fragment slot="search-result" let:item>
							<div class="gray">{map_or_null($DATABASE, 'reader_classes', item.class_name)}</div>
							{item.name}
						</svelte:fragment>
						<svelte:fragment slot="special-adder">a</svelte:fragment>
						<svelte:fragment slot="editor">a</svelte:fragment>
					</EditorSearchableTextField>
				</Horizontal>
			</svelte:fragment>
		</EditorFieldGroup>
		<EditorFieldGroup>
			<svelte:fragment slot="name">Datum půjčení</svelte:fragment>
			<Horizontal slot="fields">
				<EditorTextField value={format_date(new Date())} center width={pixels(128)} disabled></EditorTextField>
				<Icon type="arrow-right" />
				<EditorTextField value={return_date} center width={pixels(128)} disabled></EditorTextField>
				<EditorToggle context_field="permanent" value={false} padding on_change={on_change_permanent}
					>Trvale</EditorToggle
				>
			</Horizontal>
		</EditorFieldGroup>
	</Vertical>
	<svelte:fragment slot="action-bar">
		<EditorAction button_color="var(--error-600)" on_click={cancel}>Zrušit</EditorAction>
		<EditorAction button_color="var(--success-600)" on_click={save} disabled={has_errors}>Uložit</EditorAction>
	</svelte:fragment>
</Editor>

{#if $CURRENTLY_EDITING_READER !== null}
	<ReaderEditor cancel={cancel_reader_editor} submit={submit_reader_editor} />
{/if}

<style>
	.gray {
		color: var(--subtext-color);
	}
</style>
