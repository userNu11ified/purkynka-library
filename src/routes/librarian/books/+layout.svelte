<script lang="ts">
	import SidebarLink from '$client/components/view_with_sidebar/SidebarLink.svelte';
	import ViewWithSidebar from '$client/components/view_with_sidebar/ViewWithSidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<ViewWithSidebar>
	{#snippet sidebar()}
		<SidebarLink href="/librarian/books/view" iconType="book">Seznam</SidebarLink>
		<SidebarLink href="/librarian/books/extended-view" iconType="book-info">
			Seznam informací
		</SidebarLink>

		<SidebarLink href="/librarian/books/discarded" iconType="book-discard">Vyřazené</SidebarLink>
	{/snippet}
	{#snippet view()}
		{@render children()}
	{/snippet}
</ViewWithSidebar>
