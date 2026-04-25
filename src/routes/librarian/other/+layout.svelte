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
			Názvy <br /> knih
		</SidebarLink>
		<SidebarLink href="/librarian/other/author-names" iconType="user-edit">
			Jména <br /> autorů
		</SidebarLink>
		<SidebarSeparator />
		<SidebarLink href="/librarian/other/publishers" iconType="store">Nakladat.</SidebarLink>
		<SidebarLink href="/librarian/other/places-of-publishing" iconType="place">
			Místa <br /> vydání
		</SidebarLink>
		<SidebarLink href="/librarian/other/obtained-from" iconType="book-return">
			Získáno <br /> od
		</SidebarLink>
		<SidebarSeparator />
		<SidebarLink href="/librarian/other/literature-types" iconType="list-typed">
			Typy literatury
		</SidebarLink>
		<SidebarLink href="/librarian/other/udc" iconType="list-numbered">MDT</SidebarLink>
		<SidebarSeparator />
		<SidebarLink href="/librarian/other/discard-reasons" iconType="trash-can">
			Důvody vyřazení
		</SidebarLink>
	{/snippet}
	{#snippet view()}
		{@render children()}
	{/snippet}
</ViewWithSidebar>
