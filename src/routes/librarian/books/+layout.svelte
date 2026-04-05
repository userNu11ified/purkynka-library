<script lang="ts">
	import SidebarLink from '$client/components/view_with_sidebar/SidebarLink.svelte';
	import SidebarSeparator from '$client/components/view_with_sidebar/SidebarSeparator.svelte';
	import ViewWithSidebar from '$client/components/view_with_sidebar/ViewWithSidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<ViewWithSidebar>
	{#snippet sidebar()}
		<SidebarLink href="/librarian/books/view" iconType="book">View</SidebarLink>
		<SidebarLink href="/librarian/books/extended-view" iconType="book-info">
			Extended View
		</SidebarLink>

		<SidebarLink href="/librarian/books/discarded" iconType="book-discard">Discarded</SidebarLink>
		<SidebarSeparator />
		<SidebarLink href="/librarian/books/add-book" iconType="book-add">Add Book</SidebarLink>
	{/snippet}
	{#snippet view()}
		{@render children()}
	{/snippet}
</ViewWithSidebar>
