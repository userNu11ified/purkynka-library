<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { stringFilter, stringFilterEqual } from '$client/collation/filters';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import Editor from '../editor/Editor.svelte';
	import EditorAction from '../editor/EditorAction.svelte';
	import EditorSearchableInput from '../editor/inputs/EditorSearchableInput.svelte';
	import EditorIntegerInputLine from '../editor/premade_lines/EditorIntegerInputLine.svelte';
	import EditorMultiLine from '../editor/lines/EditorMultiLine.svelte';
	import EditorSearchableInputLine from '../editor/premade_lines/EditorSearchableInputLine.svelte';
	import EditorSelectInputLine from '../editor/premade_lines/EditorSelectInputLine.svelte';
	import EditorStringInputLine from '../editor/premade_lines/EditorStringInputLine.svelte';
	import { EditorFieldIntegerState } from '../editor/inputs/state/editor_field_integer_state.svelte';
	import {
		createEditorFieldSearchableStateParser,
		EditorFieldSearchableState
	} from '../editor/inputs/state/editor_field_searchable_state.svelte';
	import { EditorFieldSelectState } from '../editor/inputs/state/editor_field_select_state.svelte';
	import { EditorFieldStringState } from '../editor/inputs/state/editor_field_string_state.svelte';
	import Modal from '../Modal.svelte';
	import EditorDoubleColumnLayout from '../editor/layout/EditorDoubleColumnLayout.svelte';
	import { EditorFieldDateState } from '../editor/inputs/state/editor_field_date_state.svelte';
	import EditorDateInputLine from '../editor/premade_lines/EditorDateInputLine.svelte';
	import EditorToggleInput from '../editor/inputs/EditorToggleInput.svelte';
	import { udcEditorSubmitCallbacks } from './UDCEditor.svelte';
	import { Result } from '$shared/types/result';
	import { clientLogger } from '$client/client_loggers';
	import type { BookInsert, BookSelect } from '$shared/database/tables/books_table';
	import type { AuthorToBookInsert } from '$shared/database/tables/junction_tables';
	import { onMount } from 'svelte';
	import { trapFocus } from '../attachments/focus_trap.svelte';
	import {
		failedToPostSearchableFields,
		udcFieldInvalidNewState,
		type FailedToPostSearchableFields,
		type UDCFieldInvalidNewState
	} from '$shared/error/book_editor';
	import type { AuthorNameSelect } from '$shared/database/tables/lookup_tables';
	import { Option } from '$shared/types/option';
	import type { DescriptiveError } from '$shared/types/descriptive_error';
	import type { AtLeastOneKey } from '$shared/types/util';
	import { EditorPageStates } from './editor_page_states.svelte';
	import { EditorFieldState } from '../editor/inputs/state/editor_field_state.svelte';

	const librarianData = LibrarianData.context.get();
	const editorPageStates = EditorPageStates.context.get();
	const bookEditorState = $derived(editorPageStates.bookEditorState!);

	const books = librarianData.books.getArray();

	let timesAdded = $state('');

	const bookNames = librarianData.bookNames.getArray();
	const authorNames = librarianData.authorNames.getArray();
	const publishers = librarianData.publishers.getArray();
	const placesOfPublishing = librarianData.placesOfPublishing.getArray();
	const literatureTypes = librarianData.literatureTypes.getArray();
	const udc = librarianData.udc.getArray();
	const obtainedFrom = librarianData.obtainedFrom.getArray();
	const discardReasons = librarianData.discardReasons.getArray();

	const editorState = $state({
		idState: new EditorFieldIntegerState('Book ID', {
			inputOptions: { disabled: true, textAlignment: 'center', width: '96px' },
			required: true
		}),
		isLargeState: false,
		bookNameState: new EditorFieldSearchableState('Book Name', {
			list: {
				searchIn: bookNames,
				textCreator: ({ value }) => value,
				filter: (v, q) => stringFilter(v.item.value, q),
				matcher: (v, q) => stringFilterEqual(v.item.value, q)
			}
		}),
		authorStates: [
			new EditorFieldSearchableState('Author', {
				list: {
					searchIn: authorNames,
					textCreator: ({ value }) => value,
					filter: (v, q) =>
						stringFilter(v.item.value, q) || stringFilter(v.item.value.replaceAll(',', ''), q),
					matcher: (v, q) =>
						stringFilterEqual(v.item.value, q) ||
						stringFilterEqual(v.item.value.replaceAll(',', ''), q)
				}
			}),
			new EditorFieldSearchableState('Author Two', {
				list: {
					searchIn: authorNames,
					textCreator: ({ value }) => value,
					filter: (v, q) =>
						stringFilter(v.item.value, q) || stringFilter(v.item.value.replaceAll(',', ''), q),
					matcher: (v, q) =>
						stringFilterEqual(v.item.value, q) ||
						stringFilterEqual(v.item.value.replaceAll(',', ''), q)
				}
			}),
			new EditorFieldSearchableState('Author Three', {
				list: {
					searchIn: authorNames,
					textCreator: ({ value }) => value,
					filter: (v, q) =>
						stringFilter(v.item.value, q) || stringFilter(v.item.value.replaceAll(',', ''), q),
					matcher: (v, q) =>
						stringFilterEqual(v.item.value, q) ||
						stringFilterEqual(v.item.value.replaceAll(',', ''), q)
				}
			})
		],
		publisherState: new EditorFieldSearchableState('Publisher', {
			list: {
				searchIn: publishers,
				textCreator: ({ value }) => value,
				filter: (v, q) => stringFilter(v.item.value, q),
				matcher: (v, q) => stringFilterEqual(v.item.value, q)
			}
		}),
		placeOfPublishingState: new EditorFieldSearchableState('Place Of Publishing', {
			list: {
				searchIn: placesOfPublishing,
				textCreator: ({ value }) => value,
				filter: (v, q) => stringFilter(v.item.value, q),
				matcher: (v, q) => stringFilterEqual(v.item.value, q)
			}
		}),
		yearOfPublishingState: new EditorFieldStringState('Year Of Publishing', {
			inputOptions: { width: '96px' }
		}),
		editionState: new EditorFieldStringState('Edition'),
		pageCountState: new EditorFieldStringState('Page Count'),
		literatureTypeState: new EditorFieldSelectState('Literature Type', {
			options: literatureTypes,
			textCreator: ({ shortName }) => shortName,
			titleCreator: ({ longName }) => longName
		}),
		udcState: new EditorFieldSearchableState('UDC', {
			list: {
				searchIn: udc,
				textCreator: ({ longName }) => longName,
				identifierCreator: ({ shortName }) => shortName,
				filter: (v, q) => stringFilter(v.item.shortName, q) || stringFilter(v.item.longName, q),
				matcher: (v, q) =>
					stringFilterEqual(v.item.shortName, q) || stringFilterEqual(v.item.longName, q),
				onSpecialAdderClick: () => {
					pushState('', {
						...page.state,
						udcEditorState: { type: 'new' }
					});
				}
			}
		}),
		addDateState: new EditorFieldDateState('Add Date', {
			inputOptions: { errorAlignment: 'left' }
		}),
		priceState: new EditorFieldStringState('Price', { inputOptions: { errorAlignment: 'left' } }),
		documentNumberState: new EditorFieldStringState('Document Number', {
			inputOptions: { errorAlignment: 'left' }
		}),
		obtainedFromState: new EditorFieldSearchableState('Obtained From', {
			list: {
				searchIn: obtainedFrom,
				textCreator: ({ value }) => value,
				filter: (v, q) => stringFilter(v.item.value, q),
				matcher: (v, q) => stringFilterEqual(v.item.value, q)
			}
		}),
		annotationState: new EditorFieldStringState('Annotation', {
			inputOptions: { errorAlignment: 'left' }
		}),
		discardDateState: new EditorFieldDateState('Discard Date', {
			inputOptions: { errorAlignment: 'left' }
		}),
		discardReasonState: new EditorFieldSearchableState('Discard Reason', {
			list: {
				searchIn: discardReasons,
				textCreator: ({ value }) => value,
				filter: (v, q) => stringFilter(v.item.value, q),
				matcher: (v, q) => stringFilterEqual(v.item.value, q)
			}
		}),
		discardDocumentState: new EditorFieldStringState('Discard Document', {
			inputOptions: { errorAlignment: 'left' }
		}),
		noteState: new EditorFieldStringState('Note', { inputOptions: { errorAlignment: 'left' } })
	});

	const hasErrors = $derived(
		Object.values(editorState)
			.flat()
			.filter((v) => v instanceof EditorFieldState && v.parsed.parseErrors.length !== 0).length !==
			0
	);

	const fillEditorStateNew = () => {
		const lastBook = books.at(-1);
		if (lastBook === undefined) {
			editorState.idState.setFromValue(1);
			return;
		}

		editorState.idState.setFromValue(lastBook.id + 1);
		editorState.literatureTypeState.setFromIndex(0);
		editorState.addDateState.setFromValue(new Date());
		editorState.documentNumberState.setFromValue(lastBook.documentNumber);
		editorState.obtainedFromState.setFromListItem(
			librarianData.obtainedFrom.getValueByIdOrNull(lastBook.obtainedFromId)
		);
	};

	const fillEditorStateOld = (bookId: number) => {
		const book = librarianData.books.getValueByIdOrNull(bookId);
		if (book === null) {
			clientLogger.fatal('Tried editing non-existent book!');
			throw new Error();
		}

		editorState.idState.setFromValue(book.id);
		editorState.isLargeState = book.isLarge;
		editorState.bookNameState.setFromListItem(
			librarianData.bookNames.getValueByIdOrNull(book.bookNameId)
		);
		editorState.publisherState.setFromListItem(
			librarianData.publishers.getValueByIdOrNull(book.publisherId)
		);
		editorState.placeOfPublishingState.setFromListItem(
			librarianData.placesOfPublishing.getValueByIdOrNull(book.placeOfPublishingId)
		);
		editorState.yearOfPublishingState.setFromValue(book.yearOfPublishing);
		editorState.editionState.setFromValue(book.edition);
		editorState.pageCountState.setFromValue(book.pageCount);
		editorState.literatureTypeState.setFromValue(
			librarianData.literatureTypes.getValueByIdOrNull(book.literatureTypeId)
		);
		editorState.udcState.setFromListItem(librarianData.udc.getValueByIdOrNull(book.udcId));
		editorState.addDateState.setFromValue(book.addDate);
		editorState.priceState.setFromValue(book.price);
		editorState.documentNumberState.setFromValue(book.documentNumber);
		editorState.obtainedFromState.setFromListItem(
			librarianData.obtainedFrom.getValueByIdOrNull(book.obtainedFromId)
		);
		editorState.annotationState.setFromValue(book.annotation);
		editorState.discardDateState.setFromValue(book.discardDate);
		editorState.discardReasonState.setFromListItem(
			librarianData.discardReasons.getValueByIdOrNull(book.discardReasonId)
		);
		editorState.discardDocumentState.setFromValue(book.discardDocument);
		editorState.noteState.setFromValue(book.note);

		const bookAuthors = librarianData.authorToBook.getValueByBookIdOrNull(book.id);
		if (bookAuthors === null) return;

		bookAuthors.forEach(({ authorId }, i) =>
			editorState.authorStates[i].setFromListItem(
				librarianData.authorNames.getValueByIdOrNull(authorId)
			)
		);
	};

	const fillEditorStateCopy = (bookId: number) => {
		fillEditorStateOld(bookId);

		const lastBook = books.at(-1)!;
		editorState.idState.setFromValue(lastBook.id + 1);
	};

	const onCancelClick = () => {
		history.back();
	};

	const parseBookName = createEditorFieldSearchableStateParser(
		librarianData.bookNames,
		(value) => ({ value })
	);

	const parseAuthorName = createEditorFieldSearchableStateParser(
		librarianData.authorNames,
		(value) => ({ value })
	);

	const parsePublisher = createEditorFieldSearchableStateParser(
		librarianData.publishers,
		(value) => ({ value })
	);

	const parsePlaceOfPublishing = createEditorFieldSearchableStateParser(
		librarianData.placesOfPublishing,
		(value) => ({ value })
	);

	const parseObtainedFrom = createEditorFieldSearchableStateParser(
		librarianData.obtainedFrom,
		(value) => ({ value })
	);

	const parseDiscardReason = createEditorFieldSearchableStateParser(
		librarianData.discardReasons,
		(value) => ({ value })
	);

	const parseBook = async (): Promise<
		Result<
			{ parsedBook: BookInsert; parsedAuthors: AuthorNameSelect[] },
			FailedToPostSearchableFields | UDCFieldInvalidNewState
		>
	> => {
		const {
			isLargeState,
			bookNameState,

			authorStates,

			publisherState,
			placeOfPublishingState,
			yearOfPublishingState,

			editionState,
			pageCountState,

			literatureTypeState,
			udcState,

			addDateState,
			priceState,
			documentNumberState,
			obtainedFromState,

			discardDateState,
			discardReasonState,
			discardDocumentState,

			annotationState,
			noteState
		} = editorState;

		const searchableResults = await Promise.all([
			parseBookName(bookNameState),
			parsePublisher(publisherState),
			parsePlaceOfPublishing(placeOfPublishingState),
			parseObtainedFrom(obtainedFromState),
			parseDiscardReason(discardReasonState),

			parseAuthorName(authorStates[0]),
			parseAuthorName(authorStates[1]),
			parseAuthorName(authorStates[2])
		]);

		const searchableResultErrors = searchableResults.filter((v) => Result.isError(v));
		if (searchableResultErrors.length !== 0)
			return Result.error(
				failedToPostSearchableFields({ errors: searchableResultErrors.map((v) => v.value) })
			);

		const [bookName, publisher, placeOfPublishing, obtainedFrom, discardReason, ...authors] =
			searchableResults.map((v) => Result.unwrap(v));

		const udc = udcState.getParsedValue();
		if (udc?.type === 'new') return Result.error(udcFieldInvalidNewState());

		const emptyBook: BookInsert = {
			isLarge: isLargeState,
			bookNameId: bookName?.id,

			publisherId: publisher?.id,
			placeOfPublishingId: placeOfPublishing?.id,
			yearOfPublishing: yearOfPublishingState.getParsedValue(),

			edition: editionState.getParsedValue(),
			pageCount: pageCountState.getParsedValue(),

			literatureTypeId: literatureTypeState.getParsedValue()?.id,
			udcId: udc?.value.item.id,

			addDate: addDateState.getParsedValue(),
			price: priceState.getParsedValue(),
			documentNumber: documentNumberState.getParsedValue(),
			obtainedFromId: obtainedFrom?.id,

			discardDate: discardDateState.getParsedValue(),
			discardReasonId: discardReason?.id,
			discardDocument: discardDocumentState.getParsedValue(),

			annotation: annotationState.getParsedValue(),
			note: noteState.getParsedValue()
		};

		const filteredAuthors = new Set(authors.filter((v) => v !== null));
		return Result.ok({ parsedBook: emptyBook, parsedAuthors: filteredAuthors.values().toArray() });
	};

	const addBook = async (
		addCount: number
	): Promise<Option<DescriptiveError<string, string, unknown>>> => {
		const bookParseResult = await parseBook();
		if (Result.isError(bookParseResult)) return Option.some(bookParseResult.value);

		const { parsedBook, parsedAuthors } = bookParseResult.value;

		const postedBooks = Array.from({ length: addCount }, () => parsedBook);
		const bookPostResult = await librarianData.books.post(postedBooks);
		if (Result.isError(bookPostResult)) return Option.some(bookPostResult.value);

		if (parsedAuthors.length === 0) return Option.none();

		const postedAuthorToBooks = bookPostResult.value.flatMap(({ id: bookId }) =>
			parsedAuthors.map(({ id: authorId }): AuthorToBookInsert => ({ bookId, authorId }))
		);
		const authorToBookPostResult = await librarianData.authorToBook.post(postedAuthorToBooks);
		if (Result.isError(authorToBookPostResult)) return Option.some(authorToBookPostResult.value);

		return Option.none();
	};

	const saveBook = async (): Promise<Option<DescriptiveError<string, string, unknown>>> => {
		const bookParseResult = await parseBook();
		if (Result.isError(bookParseResult)) return Option.some(bookParseResult.value);

		const { parsedBook, parsedAuthors } = bookParseResult.value;
		const bookId = editorState.idState.getParsedValue()!;
		const bookPatchResult = await librarianData.books.patch({
			ids: [bookId],
			newValue: parsedBook as AtLeastOneKey<BookSelect>
		});
		if (Result.isError(bookPatchResult)) return Option.some(bookPatchResult.value);

		const oldAuthors = librarianData.authorToBook.getValueByBookIdOrNull(bookId);
		if (oldAuthors !== null && oldAuthors.length !== 0) {
			const authorToBookDeleteResult = await librarianData.authorToBook.delete({
				deleteBy: 'both',
				ids: oldAuthors.map(({ authorId }) => ({ bookId, authorId }))
			});
			if (Result.isError(authorToBookDeleteResult))
				return Option.some(authorToBookDeleteResult.value);
		}

		if (parsedAuthors.length === 0) return Option.none();

		const postedAuthorToBooks = parsedAuthors.map(
			({ id: authorId }): AuthorToBookInsert => ({ bookId, authorId })
		);
		const authorToBookPostResult = await librarianData.authorToBook.post(postedAuthorToBooks);
		if (Result.isError(authorToBookPostResult)) return Option.some(authorToBookPostResult.value);

		return Option.none();
	};

	let showLoading = $state(false);

	const numberRegex = /^\d+$/;
	const parsedAddCount = $derived.by(() => {
		if (!numberRegex.test(timesAdded)) return null;
		const parsedCount = +timesAdded;

		if (parsedCount === 0) return null;
		return parsedCount;
	});

	const onAddMultipleClick = async () => {
		showLoading = true;

		const bookAddErrors = await addBook(parsedAddCount!);
		if (Option.isSome(bookAddErrors)) {
			clientLogger.fatal('Failed to Add Book!', { error: bookAddErrors.value });
			throw new Error();
		}

		showLoading = false;

		history.back();
	};

	const onAddClick = async () => {
		showLoading = true;

		const bookAddErrors = await addBook(1);
		if (Option.isSome(bookAddErrors)) {
			clientLogger.fatal('Failed to Add Book!', { error: bookAddErrors.value });
			throw new Error();
		}

		showLoading = false;

		history.back();
	};

	const onSaveClick = async () => {
		showLoading = true;

		const bookSaveErrors = await saveBook();
		if (Option.isSome(bookSaveErrors)) {
			clientLogger.fatal('Failed to Save Book!', { error: bookSaveErrors.value });
			throw new Error();
		}

		showLoading = false;

		history.back();
	};

	udcEditorSubmitCallbacks.registerCallback((v) => {
		editorState.udcState.setFromListItem(v);
	});

	onMount(() => {
		if (bookEditorState.type === 'new') fillEditorStateNew();
		else if (bookEditorState.type === 'new-copy') fillEditorStateCopy(bookEditorState.bookId);
		else fillEditorStateOld(bookEditorState.bookId);

		if (bookEditorState.type === 'discard') editorState.discardDateState.setFromValue(new Date());
	});
</script>

<Modal
	onClickOutside={() => {
		if (editorPageStates.udcEditorActive) return;
		history.back();
	}}
>
	<Editor
		{showLoading}
		{@attach trapFocus(
			bookEditorState.type === 'new' ? 1 : bookEditorState.type === 'discard' ? 30 : undefined
		)}
	>
		{#snippet title()}
			{bookEditorState.type === 'new' || bookEditorState.type === 'new-copy'
				? 'Add Book'
				: bookEditorState.type === 'edit'
					? 'Edit Book'
					: 'Discard Book'}
		{/snippet}

		{#snippet fields()}
			<EditorDoubleColumnLayout>
				{#snippet left()}
					<EditorIntegerInputLine state={editorState.idState}>
						<EditorToggleInput bind:toggled={editorState.isLargeState}>
							{editorState.isLargeState ? 'L' : 's'}
						</EditorToggleInput>
					</EditorIntegerInputLine>
					<EditorSearchableInputLine state={editorState.bookNameState} />
					<EditorMultiLine state={editorState.authorStates[0]}>
						<EditorSearchableInput state={editorState.authorStates[0]}></EditorSearchableInput>
						<EditorSearchableInput state={editorState.authorStates[1]}></EditorSearchableInput>
						<EditorSearchableInput state={editorState.authorStates[2]}></EditorSearchableInput>
					</EditorMultiLine>
					<EditorSearchableInputLine state={editorState.publisherState}></EditorSearchableInputLine>
					<EditorSearchableInputLine state={editorState.placeOfPublishingState}
					></EditorSearchableInputLine>
					<EditorStringInputLine state={editorState.yearOfPublishingState}></EditorStringInputLine>
					<EditorStringInputLine state={editorState.editionState}></EditorStringInputLine>
					<EditorStringInputLine state={editorState.pageCountState}></EditorStringInputLine>
					<EditorSelectInputLine state={editorState.literatureTypeState}></EditorSelectInputLine>
					<EditorSearchableInputLine state={editorState.udcState}></EditorSearchableInputLine>
				{/snippet}

				{#snippet right()}
					<EditorDateInputLine state={editorState.addDateState}></EditorDateInputLine>
					<EditorStringInputLine state={editorState.priceState}></EditorStringInputLine>
					<EditorStringInputLine state={editorState.documentNumberState}></EditorStringInputLine>
					<EditorSearchableInputLine state={editorState.obtainedFromState}
					></EditorSearchableInputLine>
					<EditorStringInputLine state={editorState.annotationState}></EditorStringInputLine>
					<EditorDateInputLine state={editorState.discardDateState}></EditorDateInputLine>
					<EditorSearchableInputLine state={editorState.discardReasonState}
					></EditorSearchableInputLine>
					<EditorStringInputLine state={editorState.discardDocumentState}></EditorStringInputLine>
					<EditorStringInputLine state={editorState.noteState}></EditorStringInputLine>
				{/snippet}
			</EditorDoubleColumnLayout>
		{/snippet}

		{#snippet actions()}
			<EditorAction actionColor="error" onClick={onCancelClick}>Cancel</EditorAction>
			{#if bookEditorState.type === 'new' || bookEditorState.type === 'new-copy'}
				<EditorAction
					actionColor="information"
					disabled={hasErrors || parsedAddCount === null}
					onClick={onAddMultipleClick}
				>
					Add <input class="book-count-input" type="text" bind:value={timesAdded} /> Times
				</EditorAction>
				<EditorAction actionColor="success" disabled={hasErrors} onClick={onAddClick}
					>Add</EditorAction
				>
			{:else}
				<EditorAction actionColor="success" disabled={hasErrors} onClick={onSaveClick}
					>Save</EditorAction
				>
			{/if}
		{/snippet}
	</Editor>
</Modal>

<style>
	.book-count-input {
		width: 48px;
		height: 28px;

		margin-inline: 4px;

		font-size: 16px;
		text-align: center;
	}
</style>
