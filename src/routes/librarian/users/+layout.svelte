<script lang="ts">
	import { pushState } from '$app/navigation';
	import { EditorPageStates } from '$client/components/editors/editor_page_states.svelte';
	import SidebarButton from '$client/components/view_with_sidebar/SidebarButton.svelte';
	import SidebarLink from '$client/components/view_with_sidebar/SidebarLink.svelte';
	import SidebarSeparator from '$client/components/view_with_sidebar/SidebarSeparator.svelte';
	import ViewWithSidebar from '$client/components/view_with_sidebar/ViewWithSidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const editorPageStates = EditorPageStates.context.get();

	const onAddLibrarianClick = () =>
		pushState('', {
			librarianEditorState: {
				type: 'new'
			}
		});

	const onAddUserClick = () =>
		pushState('', {
			userEditorState: {
				type: 'new'
			}
		});
</script>

<ViewWithSidebar>
	{#snippet sidebar()}
		<SidebarLink href="/librarian/users/students" iconType="student">Studenti</SidebarLink>
		<SidebarLink href="/librarian/users/teachers" iconType="teacher">Učitelé</SidebarLink>
		<SidebarLink href="/librarian/users/librarians" iconType="librarian">Knihovníci</SidebarLink>

		<SidebarSeparator />

		<SidebarButton
			iconType="shield-add"
			active={editorPageStates.librarianEditorActive}
			disabled={editorPageStates.librarianEditorActive || editorPageStates.userEditorActive}
			onClick={onAddLibrarianClick}>Přidat knihovníka</SidebarButton
		>
		<SidebarButton
			iconType="user-add"
			active={editorPageStates.userEditorActive}
			disabled={editorPageStates.librarianEditorActive || editorPageStates.userEditorActive}
			onClick={onAddUserClick}>Přidat čtenáře</SidebarButton
		>
	{/snippet}
	{#snippet view()}
		{@render children()}
	{/snippet}
</ViewWithSidebar>
