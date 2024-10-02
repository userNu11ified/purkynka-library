<script lang="ts">
	import { DATABASE } from '$client/database/database';
	import type { EditorContext, EditorErrorContext } from '$client/editor/editor';
	import { DATE_CHECKER, REQUIRED_CHECKER } from '$client/editor/error_checkers';
	import { CURRENTLY_EDITING_BORROW, type BorrowEditorErrorContext } from '$client/editors/borrow_editor';
	import { CURRENTLY_EDITING_READER } from '$client/editors/reader_editor';
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
	import { deformat_date, get_lowest_missing_id, string_compare } from '$shared/common_util';
	import { onDestroy, onMount, tick } from 'svelte';
	import { get, type Unsubscriber, type Writable } from 'svelte/store';

	let editor: Editor<any, any>;
	let editor_context: Writable<EditorContext>;

	let [edit_type, book_id] = $CURRENTLY_EDITING_BORROW!;

	const get_return_date = (date: Date = new Date()) => {
		date.setMonth(date.getMonth() + 1);
		return date;
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

			if (readers_in_class.length === 1 && !/[0-9]/g.test(reader_class!)) {
				$editor_context['reader'] = readers_in_class[0].id;
				reader_input.update_string_value(readers_in_class[0], false);
			}
		} else {
			reader_class = null;
			reader = null;
			reader_input?.update_string_value(reader);
		}
	};

	const on_option_selected_reader = (value: Nullable<number | string>) => {
		if (typeof value === 'number') {
			class_input.update_string_value(
				map_or_null<string>($DATABASE, 'reader_classes', $DATABASE.readers.find((v) => v.id === value)!.class_name)
			);
		}
	};

	const on_change_permanent = (value: boolean) => {
		if (value) {
			return_date = '—';
		} else {
			return_date = format_date(get_return_date());
		}
	};

	let return_date_input: EditorTextField;
	const on_change_borrow_date = (borrow_date: Nullable<string>) => {
		if (!editor?.editor_error_context) return;

		if (get(editor.editor_error_context)['borrow_date'].size !== 0) return return_date_input.set_value('Špatné datum');
		if ($editor_context['permanent']) return return_date_input.set_value('—');

		const value = $editor_context['borrow_date'];
		const return_date = format_date(get_return_date(deformat_date(value)!));
		return_date_input.set_value(return_date);
	};
	$: on_change_borrow_date($editor_context?.['borrow_date'] ?? null);

	const cancel = () => ($CURRENTLY_EDITING_BORROW = null);
	const save = async () => {
		const editor_context = $editor_context;

		if (typeof editor_context['reader_class'] === 'string') {
			const reader_class = editor_context['reader_class'];
			const class_res = await post_request(`${window.origin}/api/v1/reader-classes`, reader_class);

			if (class_res.ok) {
				editor_context['reader_class'] = $DATABASE.reader_classes.push(reader_class) - 1;
			}
		}

		if (typeof editor_context['reader'] === 'string') {
			const reader: DatabaseReader = {
				id: get_lowest_missing_id($DATABASE.readers) as ID,
				name: editor_context['reader'],
				class_name: editor_context['reader_class']
			};

			const reader_res = await post_request(`${window.origin}/api/v1/readers`, reader);

			if (reader_res.ok) {
				editor_context['reader'] = $DATABASE.readers.push(reader) - 1;
			}
		}

		const reader = $DATABASE.readers.find((v) => v.id === editor_context['reader'])!;

		let borrow: DatabaseBorrow = {
			id: $DATABASE.borrow_history.length,
			book: book_id as ID,
			reader: reader.id,
			borrow_date: deformat_date(editor_context['borrow_date'])!.toISOString(),
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
		reader = $DATABASE.readers.find((v) => v.id === id)!;
		reader_class = $DATABASE.reader_classes[reader.class_name];

		class_input.update_string_value(reader_class);
		reader_input.recalculate_items();

		$CURRENTLY_EDITING_READER = null;
	};

	onMount(() => {
		editor_context = editor.editor_context;

		editor_error_context_unsubscriber = editor.editor_error_context.subscribe(
			(v: BorrowEditorErrorContext) => (has_errors = Object.values(v).findIndex((v) => v.size !== 0) !== -1)
		);
		class_input.focus();
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
					<EditorTextField value={`${book_id + 1}`} disabled center width={pixels(128)}></EditorTextField>
					<EditorTextField value={map_or_null($DATABASE, 'book_names', selected_book?.name ?? null)} disabled flex
					></EditorTextField>
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
						filter={(lowercase_query, item) => item.toLocaleLowerCase('cs').trim().startsWith(lowercase_query)}
						error_checkers={[REQUIRED_CHECKER]}
						center
						width={pixels(128)}
						error_left
						placeholder="Třída..."
						on_option_selected={on_option_selected_class_name}
						search_result_max_count={null}
					></EditorSearchableTextField>

					<EditorSearchableTextField
						bind:this={reader_input}
						option_filter={([id, item]) =>
							reader_class === null
								? true
								: map_or_null($DATABASE, 'reader_classes', $DATABASE.readers[id].class_name) === reader_class}
						context_field="reader"
						value={reader}
						base_item_id_mapper={(v, i) => [v.id, v]}
						items={$DATABASE.readers}
						item_stringifier={(item) => item.name}
						id_mapper={(items, lowercase_query) =>
							items.find((v) => lowercase_query === v.name.trim().toLocaleLowerCase('cs'))?.id ?? -1}
						filter={reader_filter}
						sorter={([left_id, left_item], [right_id, right_item]) => string_compare(left_item.name, right_item.name)}
						error_checkers={[REQUIRED_CHECKER]}
						flex
						placeholder="Jméno..."
						on_option_selected={on_option_selected_reader}
						has_editor
						on_click_editor={(id) => ($CURRENTLY_EDITING_READER = ['Upravit čtenáře', id])}
						get_option_key={([id, item]) => `${item.class_name}-${item.name}`}
					>
						<svelte:fragment slot="search-result" let:item>
							<div class="gray">{map_or_null($DATABASE, 'reader_classes', item.class_name)}</div>
							{item.name}
						</svelte:fragment>
					</EditorSearchableTextField>
				</Horizontal>
			</svelte:fragment>
		</EditorFieldGroup>
		<EditorFieldGroup>
			<svelte:fragment slot="name">Datum půjčení</svelte:fragment>
			<Horizontal slot="fields">
				<EditorTextField
					context_field="borrow_date"
					error_checkers={[REQUIRED_CHECKER, DATE_CHECKER]}
					value={format_date(new Date())}
					center
					width={pixels(128)}
					error_left
				></EditorTextField>
				<Icon type="arrow-right" />
				<EditorTextField bind:this={return_date_input} value={return_date} center width={pixels(128)} disabled
				></EditorTextField>
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
