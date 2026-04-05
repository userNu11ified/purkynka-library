<script lang="ts">
	import SidebarLink from '$client/components/view_with_sidebar/SidebarLink.svelte';
	import SidebarSeparator from '$client/components/view_with_sidebar/SidebarSeparator.svelte';
	import ViewWithSidebar from '$client/components/view_with_sidebar/ViewWithSidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<ViewWithSidebar>
	{#snippet sidebar()}
		<SidebarLink href="/librarian/other/book-names" iconType="nametag" iconWidth={24}>
			Book <br /> Names
		</SidebarLink>
		<SidebarLink href="/librarian/other/author-names" iconType="user-edit">
			Author Names
		</SidebarLink>
		<SidebarSeparator />
		<SidebarLink href="/librarian/other/publishers" iconType="store">Publishers</SidebarLink>
		<SidebarLink href="/librarian/other/places-of-publishing" iconType="place">
			Places Of Publishing
		</SidebarLink>
		<SidebarLink href="/librarian/other/obtained-from" iconType="book-return">
			Obtained From
		</SidebarLink>
		<SidebarSeparator />
		<SidebarLink href="/librarian/other/literature-types" iconType="list-typed">
			Literature Types
		</SidebarLink>
		<SidebarLink href="/librarian/other/udc" iconType="list-numbered">UDC</SidebarLink>
		<SidebarSeparator />
		<SidebarLink href="/librarian/other/discard-reasons" iconType="trash-can">
			Discard Reasons
		</SidebarLink>
	{/snippet}
	{#snippet view()}
		{@render children()}
	{/snippet}
</ViewWithSidebar>
