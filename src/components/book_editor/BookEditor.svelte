<script lang="ts">
	import {
		CURRENTLY_EDITING_BOOK,
		type BookEditorContext,
		type BookEditorErrorContext
	} from '$client/editors/book_editor';
	import { DATABASE } from '$client/database/database';
	import { find_item_ids } from '$client/editor/editor';
	import { DATE_CHECKER, REQUIRED_CHECKER, SPECIAL_ADDER_CHECKER } from '$client/editor/error_checkers';
	import { pixels } from '$client/style/css';
	import Editor from '$components/editor/Editor.svelte';
	import EditorFieldGroup from '$components/editor/fields/EditorFieldGroup.svelte';
	import EditorSearchableTextField from '$components/editor/fields/EditorSearchableTextField.svelte';
	import EditorTextField from '$components/editor/fields/EditorTextField.svelte';
	import EditorToggle from '$components/editor/fields/EditorToggle.svelte';
	import EditorToggleList from '$components/editor/fields/EditorToggleList.svelte';
	import DoubleColumn from '$components/editor/layouts/DoubleColumn.svelte';
	import Horizontal from '$components/editor/layouts/Horizontal.svelte';
	import { create_empty_mapped_book, format_date, map_id_book, stringify_author } from '$shared/book_util';
	import { deformat_date, string_compare } from '$shared/common_util';
	import { onDestroy, onMount } from 'svelte';
	import AuthorEditor from '../author_editor/AuthorEditor.svelte';
	import UdcEditor from '../udc_editor/UDCEditor.svelte';
	import { type Unsubscriber, get } from 'svelte/store';
	import EditorAction from '$components/editor/EditorAction.svelte';
	import type { DatabaseBook } from '$shared/book_types';
	import type { Database } from '$shared/database_types';
	import { FORCE_UPDATE } from '$client/list/list';
	import { post_request, put_request } from '$client/request/request';

	let editor: Editor<any, any>;

	let editor_error_context_unsubscriber: Unsubscriber;
	let has_errors: boolean = false;

	const [edit_type, edited_book_id] = $CURRENTLY_EDITING_BOOK!;
	const book =
		edited_book_id === $DATABASE.books.length
			? create_empty_mapped_book($DATABASE, edited_book_id)
			: map_id_book($DATABASE, edited_book_id);

	if (edit_type === 'Vyřadit knihu') {
		book.discard_date = new Date();
	} else if (edit_type === 'Zrušit vyřazení knihy') {
		book.discard_date = null;
		book.discard_reason = null;
		book.discard_document = null;
	}

	const preselected_places = find_item_ids(
		$DATABASE.places_of_publishing,
		['Brno', 'Praha'],
		(find_item, item) => find_item === item
	);

	const literature_type =
		book.literature_type !== null
			? $DATABASE.literature_types.findIndex(
					(v) => v.short_name === book.literature_type?.short_name && v.long_name === book.literature_type.long_name
				)
			: null;

	const on_click_cancel = () => ($CURRENTLY_EDITING_BOOK = null);

	let amount_focused = false;
	const on_amount_focus_in = () => (amount_focused = true);
	const on_amount_focus_out = () => (amount_focused = false);

	let amount: string;
	$: amount_invalid = isNaN(+amount) || +amount <= 1;

	const NEEDS_POSTING: [book_field: keyof DatabaseBook, database_field: keyof Database][] = [
		['name', 'book_names'],
		['publisher', 'publishers'],
		['place_of_publishing', 'places_of_publishing'],
		['giver', 'givers'],
		['discard_reason', 'discard_reasons']
	];

	const parse_context_data = async () => {
		const book_editor_context = get(editor.editor_context) as BookEditorContext;

		const authors = [
			book_editor_context['author_0'],
			book_editor_context['author_1'],
			book_editor_context['author_2']
		].filter((v) => v !== null);
		delete book_editor_context['author_0'];
		delete book_editor_context['author_1'];
		delete book_editor_context['author_2'];

		book_editor_context['author'] = authors;
		book_editor_context['add_date'] = deformat_date(book_editor_context['add_date']);
		book_editor_context['discard_date'] = deformat_date(book_editor_context['discard_date']);

		NEEDS_POSTING.forEach(async ([book_field, database_field]) => {
			const value = book_editor_context[book_field];
			if (value === null || typeof value === 'number') return;

			const res = await post_request(`${window.origin}/api/v1/${database_field.replaceAll('_', '-')}`, value);

			if (res.ok) {
				const id = $DATABASE[database_field].push(value as any) - 1;
				book_editor_context[book_field] = id;
			}
		});

		return book_editor_context as DatabaseBook;
	};

	const on_click_post = async (amount: number) => {
		if (has_errors) return;
		const database_book = await parse_context_data();
		const string_id = +database_book.string_id;

		const res = await post_request(`${window.origin}/api/v1/books`, {
			amount,
			data: database_book
		});

		if (res.ok) {
			DATABASE.update((v) => {
				new Array(amount)
					.fill(null)
					.map((v, i) => `${string_id + i}`)
					.forEach((shifted_string_id) => {
						const new_book = structuredClone(database_book) as DatabaseBook;
						new_book['string_id'] = shifted_string_id;

						v.books.push(new_book);
					});

				return v;
			});
		}

		$FORCE_UPDATE = true;
		$CURRENTLY_EDITING_BOOK = null;
	};

	const on_click_patch = async () => {
		if (has_errors) return;
		const database_book = await parse_context_data();

		const res = await put_request(`${window.origin}/api/v1/books/${edited_book_id}`, database_book);

		if (res.ok) {
			DATABASE.update((v) => {
				v.books[edited_book_id] = database_book;
				return v;
			});
		}

		$FORCE_UPDATE = true;
		$CURRENTLY_EDITING_BOOK = null;
	};

	onMount(() => {
		editor_error_context_unsubscriber = editor.editor_error_context.subscribe(
			(v: BookEditorErrorContext) => (has_errors = Object.values(v).findIndex((v) => v.size !== 0) !== -1)
		);
	});

	onDestroy(() => {
		editor_error_context_unsubscriber();
	});
</script>

<Editor bind:this={editor} z_index={10000}>
	<svelte:fragment slot="title">{edit_type}</svelte:fragment>
	<DoubleColumn slot="content">
		<svelte:fragment slot="left">
			<EditorFieldGroup>
				<svelte:fragment slot="name">Přírustkové číslo</svelte:fragment>
				<svelte:fragment slot="fields">
					<Horizontal>
						<EditorTextField context_field="string_id" value={book.string_id} center disabled width={pixels(128)}
						></EditorTextField>
						<EditorToggle context_field="is_large" value={book.is_large}>
							<svelte:fragment slot="on">V</svelte:fragment>
							<svelte:fragment slot="off">m</svelte:fragment>
						</EditorToggle>
					</Horizontal>
				</svelte:fragment>
			</EditorFieldGroup>
			<EditorFieldGroup>
				<svelte:fragment slot="name">Název knihy</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorSearchableTextField
						context_field="name"
						value={book.name}
						items={$DATABASE.book_names}
						sorter={(left, right) => string_compare(left[1], right[1])}
						error_checkers={[REQUIRED_CHECKER]}
					></EditorSearchableTextField>
				</svelte:fragment>
			</EditorFieldGroup>
			<EditorFieldGroup>
				<svelte:fragment slot="name">Autor</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorSearchableTextField
						context_field="author_0"
						value={book.author[0] ?? null}
						item_stringifier={stringify_author}
						items={$DATABASE.authors}
						sorter={(left, right) => string_compare(left[1].last_name, right[1].last_name)}
						error_checkers={[SPECIAL_ADDER_CHECKER]}
					>
						<AuthorEditor slot="special-adder" let:cancel {cancel} let:submit {submit}></AuthorEditor>
					</EditorSearchableTextField>

					<EditorSearchableTextField
						context_field="author_1"
						value={book.author[1] ?? null}
						item_stringifier={stringify_author}
						items={$DATABASE.authors}
						sorter={(left, right) => string_compare(left[1].last_name, right[1].last_name)}
						error_checkers={[SPECIAL_ADDER_CHECKER]}
					>
						<AuthorEditor slot="special-adder" let:cancel {cancel} let:submit {submit}></AuthorEditor>
					</EditorSearchableTextField>

					<EditorSearchableTextField
						context_field="author_2"
						value={book.author[2] ?? null}
						item_stringifier={stringify_author}
						items={$DATABASE.authors}
						sorter={(left, right) => string_compare(left[1].last_name, right[1].last_name)}
						error_checkers={[SPECIAL_ADDER_CHECKER]}
					>
						<AuthorEditor slot="special-adder" let:cancel {cancel} let:submit {submit}></AuthorEditor>
					</EditorSearchableTextField>
				</svelte:fragment>
			</EditorFieldGroup>
			<EditorFieldGroup>
				<svelte:fragment slot="name">Nakladatelství</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorSearchableTextField
						context_field="publisher"
						value={book.publisher}
						items={$DATABASE.publishers}
						sorter={(left, right) => string_compare(left[1], right[1])}
					></EditorSearchableTextField>
				</svelte:fragment>
			</EditorFieldGroup>
			<EditorFieldGroup>
				<svelte:fragment slot="name">Místo vydání</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorSearchableTextField
						context_field="place_of_publishing"
						value={book.place_of_publishing}
						items={$DATABASE.places_of_publishing}
						sorter={(left, right) => string_compare(left[1], right[1])}
						preselected_ids={preselected_places}
					></EditorSearchableTextField>
				</svelte:fragment>
			</EditorFieldGroup>
			<EditorFieldGroup>
				<svelte:fragment slot="name">Rok vydání</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorTextField context_field="year_of_publishing" value={book.year_of_publishing} center width={pixels(128)}
					></EditorTextField>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">Číslo vydání</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorTextField context_field="edition" value={book.edition} width={pixels(256)}></EditorTextField>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">Počet stran</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorTextField context_field="page_count" value={book.page_count} width={pixels(256)}></EditorTextField>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">Typ literatury</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorToggleList
						context_field="literature_type"
						items={$DATABASE.literature_types}
						item_stringifier={(item) => item.short_name}
						value={literature_type}
					></EditorToggleList>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">MDT</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorSearchableTextField
						context_field={'udc'}
						value={book.udc}
						items={$DATABASE.udc}
						item_stringifier={(item) => item.short_name}
						filter={(lowercase_query, item) =>
							item.short_name.trim().toLocaleLowerCase('cs').includes(lowercase_query) ||
							item.long_name.trim().toLocaleLowerCase('cs').includes(lowercase_query)}
						sorter={(left, right) => string_compare(left[1].short_name, right[1].short_name)}
						error_checkers={[SPECIAL_ADDER_CHECKER]}
					>
						<UdcEditor slot="special-adder" let:cancel {cancel} let:submit {submit}></UdcEditor>
						<svelte:fragment slot="search-result" let:item>
							<div class="short-name">{item.short_name}</div>
							<div class="long-name">{item.long_name}</div>
						</svelte:fragment>
					</EditorSearchableTextField>
				</svelte:fragment>
			</EditorFieldGroup>
		</svelte:fragment>
		<svelte:fragment slot="right">
			<EditorFieldGroup>
				<svelte:fragment slot="name">Datum zápisu</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorTextField
						context_field="add_date"
						value={book.add_date ? format_date(book.add_date) : null}
						width={pixels(128)}
						center
						error_checkers={[DATE_CHECKER]}
					></EditorTextField>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">Cena knihy</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorTextField context_field="price" value={book.price} width={pixels(128)} center></EditorTextField>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">Číslo dokladu</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorTextField context_field="document_number" value={book.document_number} width={pixels(192)} center
					></EditorTextField>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">Získáno od</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorSearchableTextField
						context_field="giver"
						value={book.giver}
						items={$DATABASE.givers}
						sorter={(left, right) => string_compare(left[1], right[1])}
					></EditorSearchableTextField>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">Anotace</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorTextField context_field="annotation" value={book.annotation}></EditorTextField>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">Datum vyřazení</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorTextField
						context_field="discard_date"
						value={book.discard_date ? format_date(book.discard_date) : null}
						width={pixels(128)}
						center
						error_checkers={[DATE_CHECKER]}
					></EditorTextField>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">Důvod vyřazení</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorSearchableTextField
						context_field="discard_reason"
						value={book.discard_reason}
						items={$DATABASE.discard_reasons}
						sorter={(left, right) => string_compare(left[1], right[1])}
					></EditorSearchableTextField>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">Doklad o vyřazení</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorTextField context_field="discard_document" value={book.discard_document}></EditorTextField>
				</svelte:fragment>
			</EditorFieldGroup>

			<EditorFieldGroup>
				<svelte:fragment slot="name">Poznámka</svelte:fragment>
				<svelte:fragment slot="fields">
					<EditorTextField context_field="note" value={book.note}></EditorTextField>
				</svelte:fragment>
			</EditorFieldGroup>
		</svelte:fragment>
	</DoubleColumn>
	<svelte:fragment slot="action-bar">
		<EditorAction button_color="var(--error-600)" on_click={on_click_cancel}>Zrušit</EditorAction>
		{#if edit_type === 'Vytvořit knihu'}
			<EditorAction button_color="var(--success-600)" disabled={has_errors} on_click={() => on_click_post(1)}
				>Přidat</EditorAction
			>
			<div class="amount-error-container">
				{#if amount_invalid}
					<div class="amount-error" class:visible={amount_focused}>Hodnota musí být větší nebo rovna 2!</div>
				{/if}
				<EditorAction
					button_color="var(--tertiary-600)"
					disabled={has_errors || amount_invalid}
					on_click={() => on_click_post(+amount)}
					>Přidat <input
						class="amount-input"
						type="number"
						bind:value={amount}
						on:focusin={on_amount_focus_in}
						on:focusout={on_amount_focus_out}
					/> krát</EditorAction
				>
			</div>
		{:else if edit_type === 'Upravit knihu'}
			<EditorAction button_color="var(--success-600)" disabled={has_errors} on_click={() => on_click_patch()}
				>Uložit</EditorAction
			>
		{:else if edit_type === 'Vyřadit knihu'}
			<EditorAction button_color="var(--success-600)" disabled={has_errors} on_click={() => on_click_patch()}
				>Vyřadit</EditorAction
			>
		{:else if edit_type === 'Zrušit vyřazení knihy'}
			<EditorAction button_color="var(--success-600)" disabled={has_errors} on_click={() => on_click_patch()}
				>Zrušit vyřazení</EditorAction
			>
		{/if}
	</svelte:fragment>
</Editor>

<style>
	.short-name {
		color: var(--subtext-color);
	}

	.amount-input {
		height: 32px;
		width: 64px;

		border: var(--border);
		border-radius: var(--border-radius-regular);

		text-align: center;

		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			display: none;
		}
	}

	.amount-error-container {
		position: relative;

		&:hover .amount-error {
			display: block;
		}
	}

	.amount-error {
		display: none;

		position: absolute;
		left: 50%;
		bottom: calc(100% + 8px);

		transform: translateX(-50%);

		width: max-content;

		padding: 8px 16px;
		border: var(--border);
		border-color: var(--error-600);
		border-radius: var(--border-radius-regular);

		background-color: var(--base-surface);

		&.visible {
			display: block;
		}
	}
</style>
