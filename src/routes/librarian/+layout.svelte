<script lang="ts">
	import Titlebar from '$client/components/titlebar/Titlebar.svelte';
	import SidebarLink from '$client/components/view_with_sidebar/SidebarLink.svelte';
	import SidebarSeparator from '$client/components/view_with_sidebar/SidebarSeparator.svelte';
	import ViewWithSidebar from '$client/components/view_with_sidebar/ViewWithSidebar.svelte';
	import { LibrarianData } from '$shared/types/loaded_data/librarian_data';
	import type { LayoutProps } from './$types';
	import { clientLogger } from '$client/client_loggers';
	import { onMount } from 'svelte';
	import { pushState } from '$app/navigation';
	import SidebarButton from '$client/components/view_with_sidebar/SidebarButton.svelte';
	import BookEditor from '$client/components/editors/BookEditor.svelte';
	import UDCEditor from '$client/components/editors/UDCEditor.svelte';
	import { EditorPageStates } from '$client/components/editors/editor_page_states.svelte';
	import MergeEditor from '$client/components/editors/MergeEditor.svelte';
	import LookupEditor from '$client/components/editors/LookupEditor.svelte';
	import ShorthandEditor from '$client/components/editors/ShorthandEditor.svelte';
	import UserEditor from '$client/components/editors/UserEditor.svelte';

	let { children, data }: LayoutProps = $props();

	const librarianData = LibrarianData.context.set(new LibrarianData());
	const editorPageStates = EditorPageStates.context.set(new EditorPageStates());

	const onBookAddClick = () => {
		pushState('', {
			bookEditorState: { type: 'new' }
		});
	};

	onMount(() => {
		librarianData
			.initialize(data.librarianData)
			.then(() => clientLogger.info('Librarian Data Loaded!'));
	});
</script>

<div class="librarian fill-container inverse-grid">
	<Titlebar />
	<div class="content">
		<ViewWithSidebar>
			{#snippet sidebar()}
				<SidebarLink href="/librarian/books" iconType="book">Books</SidebarLink>
				<SidebarLink href="/librarian/borrows" iconType="book-borrow">Borrows</SidebarLink>
				<SidebarLink href="/librarian/users" iconType="user">Users</SidebarLink>
				<SidebarLink href="/librarian/other" iconType="list">Other</SidebarLink>
				<SidebarSeparator />

				<SidebarButton
					iconType="book-add"
					active={editorPageStates.bookEditorActive}
					disabled={editorPageStates.bookEditorActive}
					onClick={onBookAddClick}
				>
					Add Book
				</SidebarButton>
				<SidebarLink href="/librarian/settings" iconType="settings">Settings</SidebarLink>
			{/snippet}

			{#snippet view()}
				{#if editorPageStates.bookEditorActive}
					<BookEditor></BookEditor>
				{/if}
				{#if editorPageStates.udcEditorActive}
					<UDCEditor></UDCEditor>
				{/if}
				{#if editorPageStates.mergeEditorActive}
					<MergeEditor></MergeEditor>
				{/if}
				{#if editorPageStates.lookupEditorActive}
					<LookupEditor></LookupEditor>
				{/if}
				{#if editorPageStates.shorthandEditorActive}
					<ShorthandEditor></ShorthandEditor>
				{/if}
				{#if editorPageStates.userEditorActive}
					<UserEditor></UserEditor>
				{/if}
				{@render children()}
			{/snippet}
		</ViewWithSidebar>
	</div>
</div>

<style>
	.librarian {
		grid-template-rows: 32px auto;
	}
</style>
